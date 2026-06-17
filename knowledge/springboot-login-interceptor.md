# Spring Boot 登录拦截器

## 竞赛关联

比赛后端开发要求实现登录拦截功能，未登录用户访问受保护接口时返回未授权。选手需要掌握 HandlerInterceptor 拦截器的编写，以及 WebMvcConfigurer 的注册配置。

## 核心技能

- **HandlerInterceptor**：实现拦截器接口，编写拦截逻辑
- **WebMvcConfigurer**：注册拦截器，配置拦截路径
- **Token 验证**：从请求头获取 Token，验证有效性
- **用户信息注入**：将用户信息存入 ThreadLocal 或 Request 属性
- **白名单配置**：放行不需要拦截的接口（如登录接口）

## 详细讲解

### 1. 登录拦截器

```java
package com.example.project.config;

import com.example.project.entity.SysUser;
import com.example.project.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Autowired
    private SysUserService sysUserService;

    // 线程本地变量：存储当前请求的用户信息
    private static final ThreadLocal<SysUser> currentUser = new ThreadLocal<>();

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        // 1. 获取请求头中的 Token
        String token = request.getHeader("Authorization");

        // 2. Token 为空，未登录
        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            response.setContentType("application/json;charset=utf-8");
            response.getWriter().write("{\"code\":401,\"message\":\"未登录，请先登录\"}");
            return false;
        }

        // 3. 验证 Token（从 Redis 或数据库查询用户）
        // 简化示例：Token 格式为 "token_用户ID"
        if (token.startsWith("token_")) {
            Long userId = Long.parseLong(token.substring(6));
            SysUser user = sysUserService.getById(userId);

            if (user == null || user.getStatus() == 0) {
                response.setStatus(401);
                response.setContentType("application/json;charset=utf-8");
                response.getWriter().write("{\"code\":401,\"message\":\"用户不存在或已被禁用\"}");
                return false;
            }

            // 4. 将用户信息存入 ThreadLocal
            currentUser.set(user);
            return true;
        }

        // 5. Token 无效
        response.setStatus(401);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write("{\"code\":401,\"message\":\"Token无效或已过期\"}");
        return false;
    }

    @Override
    public void afterCompletion(HttpServletRequest request,
                                HttpServletResponse response,
                                Object handler, Exception ex) {
        // 请求完成后清除 ThreadLocal，防止内存泄漏
        currentUser.remove();
    }

    /**
     * 获取当前登录用户
     */
    public static SysUser getCurrentUser() {
        return currentUser.get();
    }

    /**
     * 获取当前用户 ID
     */
    public static Long getCurrentUserId() {
        SysUser user = currentUser.get();
        return user != null ? user.getId() : null;
    }
}
```

### 2. JWT 版本拦截器

```java
package com.example.project.config;

import com.example.project.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtLoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String token = request.getHeader("Authorization");

        if (token == null || token.isEmpty()) {
            sendUnauthorized(response, "未登录");
            return false;
        }

        try {
            // 去掉 "Bearer " 前缀
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Claims claims = JwtUtil.parseToken(token);

            if (JwtUtil.isExpired(token)) {
                sendUnauthorized(response, "Token已过期");
                return false;
            }

            // 将用户信息存入 request 属性
            request.setAttribute("userId", claims.get("userId"));
            request.setAttribute("username", claims.get("username"));

            return true;
        } catch (Exception e) {
            sendUnauthorized(response, "Token无效");
            return false;
        }
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws Exception {
        response.setStatus(401);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(
            String.format("{\"code\":401,\"message\":\"%s\"}", message)
        );
    }
}
```

### 3. WebMvcConfigurer 注册拦截器

```java
package com.example.project.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")           // 拦截所有路径
                .excludePathPatterns(             // 排除白名单
                    "/user/login",                // 登录接口
                    "/user/register",             // 注册接口
                    "/error",                     // 错误页面
                    "/static/**"                  // 静态资源
                );
    }
}
```

### 4. Controller 中使用当前用户

```java
package com.example.project.controller;

import com.example.project.common.Result;
import com.example.project.config.LoginInterceptor;
import com.example.project.entity.SysUser;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("/info")
    public Result<SysUser> getUserInfo() {
        // 从拦截器的 ThreadLocal 获取当前用户
        SysUser currentUser = LoginInterceptor.getCurrentUser();

        if (currentUser != null) {
            currentUser.setPassword(null);  // 脱敏
        }

        return Result.success(currentUser);
    }

    @GetMapping("/current")
    public Result<Long> getCurrentUserId() {
        Long userId = LoginInterceptor.getCurrentUserId();
        return Result.success(userId);
    }
}

// 或者从 Request 属性获取（JWT 版本）
@RestController
@RequestMapping("/user")
public class UserControllerV2 {

    @GetMapping("/info")
    public Result<?> getUserInfo(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        String username = (String) request.getAttribute("username");
        // ...
        return Result.success(null);
    }
}
```

### 5. 角色权限拦截器（进阶）

```java
package com.example.project.config;

import com.example.project.entity.SysUser;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class RoleInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        SysUser user = LoginInterceptor.getCurrentUser();

        if (user == null) {
            sendForbidden(response, "未登录");
            return false;
        }

        // 获取接口上标注的角色要求
        // 简化：通过 URL 前缀判断
        String uri = request.getRequestURI();

        if (uri.startsWith("/admin/") && !"admin".equals(user.getRole())) {
            sendForbidden(response, "无管理员权限");
            return false;
        }

        return true;
    }

    private void sendForbidden(HttpServletResponse response, String message) throws Exception {
        response.setStatus(403);
        response.setContentType("application/json;charset=utf-8");
        response.getWriter().write(
            String.format("{\"code\":403,\"message\":\"%s\"}", message)
        );
    }
}
```

## 重点内容

- `preHandle` 返回 `true` 放行，`false` 拦截
- 拦截器通过 `ThreadLocal` 传递用户信息给 Controller
- `afterCompletion` 中清除 `ThreadLocal`，防止内存泄漏
- `addPathPatterns("/**")` 拦截所有，`excludePathPatterns` 排除白名单
- 白名单必须包含登录接口，否则死循环

## 注意事项

- 拦截器是 Spring 组件，需要 `@Component` 注解
- `ThreadLocal` 必须在 `afterCompletion` 中清除
- 拦截器执行顺序：按注册顺序执行
- 静态资源路径需要加入白名单，否则页面无法加载

## 常见误区

- 误区：忘记将登录接口加入白名单，导致无法登录
- 误区：`ThreadLocal` 未清除，导致内存泄漏
- 误区：拦截器返回 `false` 后未设置响应，前端收到空响应
- 误区：拦截器中使用 `@Autowired` 注入但未加 `@Component`

## 官方资源扩展

- [Spring MVC 拦截器](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config/interceptors.html) - 官方拦截器文档
- [Spring WebMvcConfigurer](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-config.html) - MVC 配置接口
- [ThreadLocal 最佳实践](https://docs.oracle.com/javase/8/docs/api/java/lang/ThreadLocal.html) - Java 官方 ThreadLocal 文档