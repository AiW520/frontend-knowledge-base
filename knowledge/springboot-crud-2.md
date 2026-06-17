# Spring Boot 业务 CRUD 实战（下）

## 竞赛关联

比赛后端开发要求选手实现用户的权限判断、分页查询、批量操作等功能。本知识点承接上篇，讲解用户绑定、角色权限判断、分页查询等进阶操作。

## 核心技能

- **用户绑定**：创建用户并关联部门
- **角色权限判断**：根据角色限制操作
- **分页查询封装**：PageResult 响应格式
- **批量操作**：批量删除、批量更新状态
- **条件筛选**：多条件组合查询

## 详细讲解

### 1. 用户绑定到部门

```java
package com.example.project.controller;

import com.example.project.common.Result;
import com.example.project.common.ErrorCode;
import com.example.project.common.BusinessException;
import com.example.project.service.SysUserService;
import com.example.project.service.SysDeptUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private SysUserService userService;

    @Autowired
    private SysDeptUserService deptUserService;

    /**
     * 创建用户并绑定部门
     */
    @PostMapping("/create")
    public Result<?> createUser(@RequestBody Map<String, Object> params) {
        String username = (String) params.get("username");
        String password = (String) params.get("password");
        String realName = (String) params.get("realName");
        String phone = (String) params.get("phone");
        Long deptId = params.get("deptId") != null
            ? Long.valueOf(params.get("deptId").toString()) : null;

        // 参数校验
        if (username == null || username.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "用户名不能为空");
        }
        if (password == null || password.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "密码不能为空");
        }

        // 检查用户名是否存在
        if (userService.findByUsername(username) != null) {
            throw new BusinessException(ErrorCode.USERNAME_EXIST);
        }

        // 检查手机号是否存在
        if (phone != null && userService.findByPhone(phone) != null) {
            throw new BusinessException(ErrorCode.PHONE_EXIST);
        }

        // 创建用户
        SysUser user = userService.createUser(username, password, realName, phone, deptId);

        return Result.success(user);
    }

    /**
     * 分页查询用户列表
     */
    @GetMapping("/list")
    public Result<?> listUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        List<SysUser> list = userService.listUsersByCondition(keyword, status, role, pageNum, pageSize);
        long total = userService.countUsersByCondition(keyword, status, role);

        return Result.page(list, total);
    }

    /**
     * 批量删除用户
     */
    @PostMapping("/batch-delete")
    public Result<?> batchDeleteUsers(@RequestBody Map<String, List<Long>> params) {
        List<Long> ids = params.get("ids");

        if (ids == null || ids.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "请选择要删除的用户");
        }

        // 检查是否包含管理员
        List<SysUser> admins = userService.listByIds(ids).stream()
            .filter(u -> "admin".equals(u.getRole()))
            .collect(Collectors.toList());

        if (!admins.isEmpty()) {
            throw new BusinessException(3005, "不能删除管理员用户");
        }

        userService.batchDeleteUsers(ids);
        return Result.success();
    }
}
```

### 2. Service 层多条件查询

```java
@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser>
        implements SysUserService {

    @Override
    public SysUser createUser(String username, String password,
                               String realName, String phone, Long deptId) {
        // 1. 创建用户
        SysUser user = new SysUser();
        user.setUsername(username);
        user.setPassword(DigestUtils.md5DigestAsHex(password.getBytes()));
        user.setRealName(realName);
        user.setPhone(phone);
        user.setRole("user");  // 默认普通用户
        user.setStatus(1);
        this.save(user);

        // 2. 绑定到部门
        if (deptId != null) {
            deptUserService.bindUsers(deptId, Collections.singletonList(user.getId()));
        }

        return user;
    }

    @Override
    public List<SysUser> listUsersByCondition(String keyword, Integer status,
                                               String role, Integer pageNum,
                                               Integer pageSize) {
        QueryWrapper<SysUser> wrapper = new QueryWrapper<>();

        // 关键词搜索
        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.and(w -> w
                .like("username", keyword)
                .or()
                .like("real_name", keyword)
                .or()
                .like("phone", keyword)
            );
        }

        // 状态筛选
        if (status != null) {
            wrapper.eq("status", status);
        }

        // 角色筛选
        if (role != null && !role.trim().isEmpty()) {
            wrapper.eq("role", role);
        }

        wrapper.orderByDesc("create_time");

        Page<SysUser> page = new Page<>(pageNum, pageSize);
        return this.baseMapper.selectPage(page, wrapper).getRecords();
    }

    @Override
    public long countUsersByCondition(String keyword, Integer status, String role) {
        QueryWrapper<SysUser> wrapper = new QueryWrapper<>();

        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.and(w -> w
                .like("username", keyword)
                .or()
                .like("real_name", keyword)
                .or()
                .like("phone", keyword)
            );
        }
        if (status != null) {
            wrapper.eq("status", status);
        }
        if (role != null && !role.trim().isEmpty()) {
            wrapper.eq("role", role);
        }

        return this.count(wrapper);
    }
}
```

### 3. 权限判断

```java
// Controller 中根据角色判断
@PostMapping("/update")
public Result<?> updateUser(@RequestBody SysUser user) {
    SysUser currentUser = LoginInterceptor.getCurrentUser();

    // 权限判断：只有管理员可以修改角色
    if (!"admin".equals(currentUser.getRole())) {
        throw new BusinessException(3006, "无权限修改用户信息");
    }

    // 不能把自己的角色改为非管理员
    if (currentUser.getId().equals(user.getId())
            && !"admin".equals(user.getRole())) {
        throw new BusinessException(3007, "不能修改自己的管理员角色");
    }

    userService.updateById(user);
    return Result.success();
}
```

### 4. 分页响应格式

```json
// 返回给前端的分页响应
{
  "code": 0,
  "message": "查询成功",
  "data": [
    { "id": 1, "username": "admin", "realName": "管理员", ... },
    { "id": 2, "username": "user1", "realName": "用户1", ... }
  ],
  "total": 100
}
```

## 重点内容

- 分页查询需要返回 `list` 和 `total` 两个字段
- 权限判断在 Controller 层进行，业务逻辑在 Service 层
- 批量操作使用 `removeByIds`，逻辑删除
- 创建用户时自动绑定部门，使用事务保证一致性
- `PageResult` 继承 `Result`，额外添加 `total` 字段

## 注意事项

- 批量删除前检查数据合法性（如不能删除管理员）
- 分页查询和计数查询使用相同的条件
- 权限判断要细粒度，区分不同角色和操作
- 密码不能明文返回，查询时必须脱敏

## 常见误区

- 误区：分页查询只返回 list 不返回 total，前端无法显示页数
- 误区：权限判断在 Service 层，Controller 无法区分不同接口
- 误区：批量操作前未检查数据合法性
- 误区：创建用户后忘记设置默认角色

## 官方资源扩展

- [MyBatis-Plus 分页查询](https://baomidou.com/pages/2976a3/) - 分页插件文档
- [Spring Boot 参数校验](https://spring.io/guides/gs/validating-form-input/) - 官方参数校验指南
- [MyBatis-Plus 批量操作](https://baomidou.com/pages/49cc81/) - 批量操作文档