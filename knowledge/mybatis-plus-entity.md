# MyBatis-Plus 实体与 Mapper

## 竞赛关联

比赛后端部分要求选手编写实体类（Entity）和数据访问层（Mapper），包括 `@TableName`、`@TableId`、`BaseMapper` 等 MyBatis-Plus 注解的运用。正确配置实体-数据库映射是后端开发的基础。

## 核心技能

- **实体类注解**：@TableName、@TableId、@TableField
- **BaseMapper**：继承获得基础 CRUD 方法
- **自定义 SQL**：@Select、@Update、XML 映射
- **分页查询**：Page 对象、MybatisPlusInterceptor
- **条件构造**：QueryWrapper、LambdaQueryWrapper

## 详细讲解

### 1. 实体类定义

```java
package com.example.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("sys_user")  // 映射数据库表名
public class SysUser {

    @TableId(type = IdType.AUTO)  // 主键自增
    private Long id;

    @TableField("username")  // 映射字段名（默认驼峰转下划线）
    private String username;

    private String password;

    private String realName;

    @TableField("phone")
    private String phone;

    private String email;

    private Integer status;  // 0-禁用 1-启用

    private String role;     // admin / user

    @TableField(fill = FieldFill.INSERT)  // 插入时自动填充
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)  // 插入和更新时自动填充
    private LocalDateTime updateTime;

    @TableLogic  // 逻辑删除标志
    private Integer deleted;
}
```

### 2. Mapper 接口

```java
package com.example.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.project.entity.SysUser;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SysUserMapper extends BaseMapper<SysUser> {

    // 方式一：注解方式自定义 SQL
    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0")
    SysUser selectByUsername(@Param("username") String username);

    @Select("SELECT * FROM sys_user WHERE phone = #{phone} AND deleted = 0")
    SysUser selectByPhone(@Param("phone") String phone);

    @Update("UPDATE sys_user SET status = #{status} WHERE id = #{id}")
    int updateStatus(@Param("id") Long id, @Param("status") Integer status);

    // 方式二：XML 方式自定义 SQL（在 mapper/SysUserMapper.xml 中定义）
    IPage<SysUser> selectPageByCondition(Page<SysUser> page, @Param("keyword") String keyword);

    List<SysUser> selectByRole(@Param("role") String role);
}
```

### 3. XML 映射文件

```xml
<!-- resources/mapper/SysUserMapper.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.project.mapper.SysUserMapper">

    <!-- 结果映射 -->
    <resultMap id="BaseResultMap" type="com.example.project.entity.SysUser">
        <id column="id" property="id" />
        <result column="username" property="username" />
        <result column="password" property="password" />
        <result column="real_name" property="realName" />
        <result column="phone" property="phone" />
        <result column="email" property="email" />
        <result column="status" property="status" />
        <result column="role" property="role" />
        <result column="create_time" property="createTime" />
        <result column="update_time" property="updateTime" />
    </resultMap>

    <!-- 分页查询（条件分页） -->
    <select id="selectPageByCondition" resultMap="BaseResultMap">
        SELECT * FROM sys_user
        WHERE deleted = 0
        <if test="keyword != null and keyword != ''">
            AND (username LIKE CONCAT('%', #{keyword}, '%')
                 OR real_name LIKE CONCAT('%', #{keyword}, '%')
                 OR phone LIKE CONCAT('%', #{keyword}, '%'))
        </if>
        ORDER BY create_time DESC
    </select>

    <!-- 按角色查询 -->
    <select id="selectByRole" resultMap="BaseResultMap">
        SELECT * FROM sys_user
        WHERE role = #{role} AND deleted = 0
        ORDER BY id ASC
    </select>

</mapper>
```

### 4. 分页插件配置

```java
package com.example.project.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyBatisPlusConfig {

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 分页插件
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

### 5. 自动填充处理器

```java
package com.example.project.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        // 插入时自动填充创建时间和更新时间
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        // 更新时自动填充更新时间
        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());
    }
}
```

### 6. BaseMapper 常用方法速查

| 方法 | 说明 |
|------|------|
| `insert(T entity)` | 插入一条记录 |
| `deleteById(Serializable id)` | 根据 ID 删除 |
| `updateById(T entity)` | 根据 ID 更新 |
| `selectById(Serializable id)` | 根据 ID 查询 |
| `selectList(Wrapper<T> wrapper)` | 条件查询列表 |
| `selectPage(Page<T> page, Wrapper<T> wrapper)` | 分页查询 |
| `selectCount(Wrapper<T> wrapper)` | 统计数量 |

## 重点内容

- `@TableName` 指定数据库表名，不写则默认类名转下划线
- `@TableId(type = IdType.AUTO)` 主键自增策略
- `@TableLogic` 配合逻辑删除配置，自动过滤 `deleted = 1` 的数据
- `BaseMapper<T>` 提供了 17 个内置 CRUD 方法
- 分页需要配置 `MybatisPlusInterceptor` + `PaginationInnerInterceptor`
- 自动填充需要实现 `MetaObjectHandler` 并注册为 Bean

## 注意事项

- `@TableField` 默认映射规则是驼峰转下划线，字段名特殊时需显式指定
- 逻辑删除字段名必须与全局配置 `logic-delete-field` 一致
- 自定义 SQL 的 XML 文件必须放在 `resources/mapper/` 目录下
- `@MapperScan` 扫描的是 Mapper 接口包，不是 XML 路径

## 常见误区

- 误区：忘记配置分页插件，`selectPage` 返回全量数据
- 误区：`@TableName` 与数据库表名大小写不一致
- 误区：逻辑删除字段未加 `@TableLogic`，查询时不过滤
- 误区：XML 的 `namespace` 与 Mapper 接口全限定名不一致

## 官方资源扩展

- [MyBatis-Plus 官方文档](https://baomidou.com/pages/223848/) - 核心功能文档
- [MyBatis-Plus 注解](https://baomidou.com/pages/223848/#%E6%B3%A8%E8%A7%A3) - 所有注解说明
- [MyBatis-Plus 分页插件](https://baomidou.com/pages/2976a3/) - 分页配置指南
- [MyBatis XML 映射](https://mybatis.org/mybatis-3/zh/sqlmap-xml.html) - MyBatis 官方 XML 映射文档