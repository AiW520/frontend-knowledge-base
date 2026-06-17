# MyBatis-Plus Service 层开发

## 竞赛关联

比赛后端部分要求选手在 Service 层实现业务逻辑。Service 层是 Controller 和 Mapper 之间的桥梁，负责业务逻辑处理、事务管理和权限校验。Spring Boot 的 Service 接口 + ServiceImpl 实现类是标准的三层架构模式。

## 核心技能

- **IService 接口**：继承 MyBatis-Plus 的 IService
- **ServiceImpl 实现类**：继承 ServiceImpl，实现自定义业务方法
- **QueryWrapper 条件构造**：复杂查询条件拼接
- **LambdaQueryWrapper**：类型安全的查询条件
- **事务管理**：@Transactional 注解

## 详细讲解

### 1. Service 接口定义

```java
package com.example.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.project.entity.SysUser;
import java.util.List;

public interface SysUserService extends IService<SysUser> {

    // 登录验证
    SysUser login(String username, String password);

    // 根据用户名查询
    SysUser findByUsername(String username);

    // 根据手机号查询
    SysUser findByPhone(String phone);

    // 分页查询用户列表
    List<SysUser> listUsers(String keyword, Integer status, Integer pageNum, Integer pageSize);

    // 更新用户状态
    boolean updateUserStatus(Long userId, Integer status);

    // 批量删除用户
    boolean batchDeleteUsers(List<Long> ids);

    // 统计用户数量
    long countUsersByRole(String role);
}
```

### 2. ServiceImpl 实现类

```java
package com.example.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.project.entity.SysUser;
import com.example.project.mapper.SysUserMapper;
import com.example.project.service.SysUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;
import java.util.List;

@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser>
        implements SysUserService {

    @Override
    public SysUser login(String username, String password) {
        // 使用 LambdaQueryWrapper 构建查询条件
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysUser::getUsername, username);  // 类型安全

        SysUser user = this.baseMapper.selectOne(wrapper);
        if (user == null) {
            return null;  // 用户不存在
        }

        // 密码验证（MD5 加密比对）
        String md5Password = DigestUtils.md5DigestAsHex(password.getBytes());
        if (!md5Password.equals(user.getPassword())) {
            return null;  // 密码错误
        }

        return user;
    }

    @Override
    public SysUser findByUsername(String username) {
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysUser::getUsername, username);
        return this.baseMapper.selectOne(wrapper);
    }

    @Override
    public SysUser findByPhone(String phone) {
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysUser::getPhone, phone);
        return this.baseMapper.selectOne(wrapper);
    }

    @Override
    public List<SysUser> listUsers(String keyword, Integer status,
                                    Integer pageNum, Integer pageSize) {
        // 使用 QueryWrapper 构建复杂查询条件
        QueryWrapper<SysUser> wrapper = new QueryWrapper<>();

        // 关键词搜索（用户名、真实姓名、手机号）
        if (keyword != null && !keyword.isEmpty()) {
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

        // 排序：按创建时间倒序
        wrapper.orderByDesc("create_time");

        // 分页查询
        Page<SysUser> page = new Page<>(pageNum, pageSize);
        IPage<SysUser> result = this.baseMapper.selectPage(page, wrapper);

        return result.getRecords();
    }

    @Override
    @Transactional  // 事务管理
    public boolean updateUserStatus(Long userId, Integer status) {
        SysUser user = new SysUser();
        user.setId(userId);
        user.setStatus(status);
        return this.updateById(user);
    }

    @Override
    @Transactional
    public boolean batchDeleteUsers(List<Long> ids) {
        // 逻辑删除：实际执行 UPDATE SET deleted = 1
        return this.removeByIds(ids);
    }

    @Override
    public long countUsersByRole(String role) {
        LambdaQueryWrapper<SysUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysUser::getRole, role);
        return this.count(wrapper);
    }
}
```

### 3. QueryWrapper 条件构造详解

```java
// ===== QueryWrapper 常用方法 =====

// 等值查询
wrapper.eq("username", "admin")           // username = 'admin'
wrapper.ne("status", 0)                   // status != 0
wrapper.like("username", "张")             // username LIKE '%张%'
wrapper.likeLeft("username", "张")         // username LIKE '%张'
wrapper.likeRight("username", "张")        // username LIKE '张%'

// 范围查询
wrapper.gt("age", 18)                     // age > 18
wrapper.ge("age", 18)                     // age >= 18
wrapper.lt("age", 60)                     // age < 60
wrapper.le("age", 60)                     // age <= 60
wrapper.between("age", 18, 60)           // age BETWEEN 18 AND 60

// 空值判断
wrapper.isNull("email")                   // email IS NULL
wrapper.isNotNull("email")                // email IS NOT NULL

// 组合查询
wrapper.and(w -> w.eq("status", 1).or().eq("role", "admin"))
// (status = 1 OR role = 'admin')

wrapper.or(w -> w.eq("role", "admin").eq("status", 1))
// OR (role = 'admin' AND status = 1)

// 排序
wrapper.orderByAsc("id")                  // ORDER BY id ASC
wrapper.orderByDesc("create_time")        // ORDER BY create_time DESC
```

### 4. LambdaQueryWrapper vs QueryWrapper

```java
// QueryWrapper：字符串拼接字段名，灵活但易出错
QueryWrapper<SysUser> qw = new QueryWrapper<>();
qw.eq("username", "admin");  // 字段名写错了编译期不会报错

// LambdaQueryWrapper：类型安全，IDE 自动补全
LambdaQueryWrapper<SysUser> lqw = new LambdaQueryWrapper<>();
lqw.eq(SysUser::getUsername, "admin");  // 字段名写错编译期直接报错
```

### 5. 事务管理

```java
@Service
public class DeptServiceImpl extends ServiceImpl<DeptMapper, Dept>
        implements DeptService {

    @Override
    @Transactional(rollbackFor = Exception.class)  // 任何异常都回滚
    public boolean createDeptWithUsers(Dept dept, List<Long> userIds) {
        // 第一步：创建部门
        this.save(dept);

        // 第二步：绑定用户到部门
        for (Long userId : userIds) {
            // ... 绑定操作
        }

        // 任何一步失败，整个操作回滚
        return true;
    }
}
```

## 重点内容

- `ServiceImpl<M extends BaseMapper<T>, T>` 提供内置的 CRUD 方法
- `this.baseMapper` 获取 Mapper 实例，用于自定义查询
- `LambdaQueryWrapper` 使用 Lambda 表达式，类型安全、IDE 友好
- `QueryWrapper` 使用字符串字段名，灵活但需要手动维护
- `@Transactional(rollbackFor = Exception.class)` 确保异常时回滚
- 分页查询使用 `Page` 对象，返回 `IPage` 结果

## 注意事项

- Service 接口必须继承 `IService<T>`，实现类继承 `ServiceImpl<M, T>`
- `@Transactional` 默认只回滚 RuntimeException，需要加 `rollbackFor`
- 逻辑删除会自动过滤 `deleted = 1` 的数据，无需手动加条件
- `this.save()` / `this.updateById()` 等是 MyBatis-Plus 内置方法

## 常见误区

- 误区：Service 接口未继承 `IService`，无法使用内置方法
- 误区：在 ServiceImpl 中直接 new 一个 Mapper 而不用 `this.baseMapper`
- 误区：`@Transactional` 忘记 `rollbackFor`，异常未被回滚
- 误区：查询条件中用 `eq` 但字段值为 null，SQL 条件未生效

## 官方资源扩展

- [MyBatis-Plus Service CRUD](https://baomidou.com/pages/49cc81/) - Service 层 CRUD 接口文档
- [MyBatis-Plus 条件构造器](https://baomidou.com/pages/10c804/) - QueryWrapper 完整文档
- [Spring 事务管理](https://docs.spring.io/spring-framework/reference/data-access/transaction.html) - 官方事务管理文档
- [MyBatis-Plus 分页](https://baomidou.com/pages/2976a3/) - 分页查询指南