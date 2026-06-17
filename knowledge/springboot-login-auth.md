# Spring Boot 登录认证开发

## 竞赛关联

比赛后端开发要求选手实现登录接口，包括密码加密验证、Token 生成、用户信息返回。这是后端最核心的安全功能，也是前端登录页面的后端支撑。

## 核心技能

- **密码加密**：BCrypt / MD5 加密验证
- **Token 生成**：JWT / UUID Token
- **登录接口**：参数接收、用户验证、Token 返回
- **用户信息返回**：脱敏处理、不返回密码
- **Controller 接口**：@RestController、@PostMapping、@RequestParam

## 详细讲解

### 1. 登录 Controller

```java
package com.example.project.controller;

import com.example.project.common.Result;
import com.example.project.common.ErrorCode;
import com.example.project.common.BusinessException;
import com.example.project.entity.SysUser;
import com.example.project.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/user")
public class LoginController {

    @Autowired
    private SysUserService sysUserService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(
            @RequestParam String username,
            @RequestParam String password) {

        // 1. 参数校验
        if (username == null || username.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "用户名不能为空");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "密码不能为空");
        }

        // 2. 调用 Service 层验证
        SysUser user = sysUserService.login(username, password);
        if (user == null) {
            throw new BusinessException(ErrorCode.USERNAME_OR_PASSWORD_ERROR);
        }

        // 3. 检查用户状态
        if (user.getStatus() == 0) {
            throw new BusinessException(ErrorCode.USER_DISABLED);
        }

        // 4. 生成 Token
        String token = UUID.randomUUID().toString().replace("-", "");

        // 5. 缓存 Token（可选：存入 Redis 或数据库）
        // redisTemplate.opsForValue().set("token:" + token, user.getId(), 30, TimeUnit.MINUTES);

        // 6. 构建返回数据
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("userId", user.getId());
        result.put("username", user.getUsername());
        result.put("realName", user.getRealName());
        result.put("role", user.getRole());

        return Result.success(result);
    }

    @PostMapping("/logout")
    public Result<?> logout(@RequestHeader("Authorization") String token) {
        // 清除 Token（从 Redis 或数据库删除）
        // redisTemplate.delete("token:" + token);
        return Result.success();
    }
}
```

### 2. Service 层密码验证

```java
package com.example.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.project.entity.SysUser;
import com.example.project.mapper.SysUserMapper;
import com.example.project.service.SysUserService;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser>
        implements SysUserService {

    @Override
    public SysUser login(String username, String password) {
        // 1. 查询用户
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysUser::getUsername, username);

        SysUser user = this.baseMapper.selectOne(wrapper);
        if (user == null) {
            return null;
        }

        // 2. 密码验证（MD5 方式）
        String md5Password = DigestUtils.md5DigestAsHex(password.getBytes());
        if (!md5Password.equals(user.getPassword())) {
            return null;
        }

        // 3. 返回用户信息（密码置空）
        user.setPassword(null);
        return user;
    }
}
```

### 3. BCrypt 密码加密（安全推荐）

```java
package com.example.project.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordUtil {

    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * 加密密码
     */
    public static String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    /**
     * 验证密码
     */
    public static boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}
```

```java
// 在 Service 中使用 BCrypt
@Override
public SysUser login(String username, String password) {
    SysUser user = this.findByUsername(username);
    if (user == null) {
        return null;
    }

    // BCrypt 验证
    if (!PasswordUtil.matches(password, user.getPassword())) {
        return null;
    }

    user.setPassword(null);
    return user;
}
```

### 4. JWT Token 生成（三部分结构）

```java
package com.example.project.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class JwtUtil {

    private static final String SECRET = "your-secret-key-here-at-least-256-bits";
    private static final long EXPIRATION = 30 * 60 * 1000;  // 30 分钟

    /**
     * 生成 JWT Token
     */
    public static String generateToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }

    /**
     * 解析 JWT Token
     */
    public static Claims parseToken(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 验证 Token 是否过期
     */
    public static boolean isExpired(String token) {
        return parseToken(token).getExpiration().before(new Date());
    }
}
```

### 5. 登录接口调用示例

```bash
# 登录请求
curl -X POST http://localhost:8080/user/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"

# 成功响应
{
  "code": 0,
  "message": "操作成功",
  "data": {
    "token": "a1b2c3d4e5f6...",
    "userId": 1,
    "username": "admin",
    "realName": "管理员",
    "role": "admin"
  }
}

# 失败响应
{
  "code": 1002,
  "message": "用户名或密码错误",
  "data": null
}
```

## 重点内容

- 登录接口使用 `@PostMapping` + `@RequestParam` 接收参数
- 密码加密推荐使用 BCrypt（Spring Security 提供），MD5 已不安全
- Token 生成后缓存到 Redis，设置过期时间
- 返回用户信息时必须将密码字段置为 null
- JWT Token 由三部分组成：Header.Payload.Signature

## 注意事项

- 登录接口必须使用 POST 方法，避免密码出现在 URL 中
- 密码不要明文存储，必须加密后存入数据库
- Token 需要设置过期时间，防止永久有效
- 同一用户多次登录，旧 Token 应失效

## 常见误区

- 误区：登录接口用 GET 方法，密码暴露在 URL
- 误区：返回用户信息时包含密码字段
- 误区：Token 不过期，安全风险
- 误区：密码比对使用 `==` 而非 `equals()`

## 官方资源扩展

- [Spring Security 官方文档](https://spring.io/projects/spring-security) - 安全认证框架
- [JWT 官方文档](https://jwt.io/introduction) - JSON Web Token 介绍
- [BCrypt 密码哈希](https://en.wikipedia.org/wiki/Bcrypt) - 密码哈希算法
- [Spring Security 密码编码](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html) - 密码存储最佳实践