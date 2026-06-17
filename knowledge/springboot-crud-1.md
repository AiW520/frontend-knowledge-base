# Spring Boot 业务 CRUD 实战（上）

## 竞赛关联

比赛后端开发要求选手实现业务数据的创建、查询、关联绑定等操作。本知识点以部门管理为例，讲解如何实现数据的创建、参数校验、关联 WeBASE 调用等核心业务功能。

## 核心技能

- **Controller 接收参数**：@RequestBody、@RequestParam
- **Service 业务逻辑**：数据创建、关联操作、异常处理
- **参数校验**：空值校验、格式校验
- **关联绑定**：部门与用户的多对多关联
- **事务管理**：多步操作保证原子性

## 详细讲解

### 1. 实体类定义

```java
package com.example.project.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("sys_dept")
public class SysDept {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String deptName;       // 部门名称
    private String deptCode;       // 部门编码
    private String description;    // 描述
    private Long parentId;         // 父部门 ID
    private Integer sortOrder;     // 排序
    private Integer status;        // 状态：0-禁用 1-启用

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    private Integer deleted;
}
```

### 2. Controller 层

```java
package com.example.project.controller;

import com.example.project.common.Result;
import com.example.project.common.ErrorCode;
import com.example.project.common.BusinessException;
import com.example.project.entity.SysDept;
import com.example.project.service.SysDeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dept")
public class DeptController {

    @Autowired
    private SysDeptService deptService;

    /**
     * 创建部门
     */
    @PostMapping("/create")
    public Result<SysDept> createDept(@RequestBody Map<String, Object> params) {
        // 1. 获取参数
        String deptName = (String) params.get("deptName");
        String deptCode = (String) params.get("deptCode");
        String description = (String) params.get("description");
        Long parentId = params.get("parentId") != null
            ? Long.valueOf(params.get("parentId").toString()) : 0L;

        // 2. 参数校验
        if (deptName == null || deptName.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "部门名称不能为空");
        }
        if (deptCode == null || deptCode.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAM_MISSING.getCode(), "部门编码不能为空");
        }

        // 3. 检查部门编码是否已存在
        SysDept existDept = deptService.findByDeptCode(deptCode);
        if (existDept != null) {
            throw new BusinessException(3003, "部门编码已存在");
        }

        // 4. 构建部门对象
        SysDept dept = new SysDept();
        dept.setDeptName(deptName.trim());
        dept.setDeptCode(deptCode.trim());
        dept.setDescription(description);
        dept.setParentId(parentId);
        dept.setSortOrder(1);
        dept.setStatus(1);

        // 5. 保存部门
        boolean saved = deptService.save(dept);
        if (!saved) {
            throw new BusinessException(ErrorCode.BUSINESS_ERROR);
        }

        return Result.success(dept);
    }

    /**
     * 查询部门列表
     */
    @GetMapping("/list")
    public Result<List<SysDept>> listDepts(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        List<SysDept> list = deptService.listDepts(keyword, pageNum, pageSize);
        return Result.success(list);
    }
}
```

### 3. Service 层

```java
package com.example.project.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.project.entity.SysDept;
import java.util.List;

public interface SysDeptService extends IService<SysDept> {

    SysDept findByDeptCode(String deptCode);

    List<SysDept> listDepts(String keyword, Integer pageNum, Integer pageSize);

    boolean updateDeptStatus(Long deptId, Integer status);
}
```

```java
package com.example.project.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.example.project.entity.SysDept;
import com.example.project.mapper.SysDeptMapper;
import com.example.project.service.SysDeptService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SysDeptServiceImpl extends ServiceImpl<SysDeptMapper, SysDept>
        implements SysDeptService {

    @Override
    public SysDept findByDeptCode(String deptCode) {
        LambdaQueryWrapper<SysDept> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysDept::getDeptCode, deptCode);
        return this.baseMapper.selectOne(wrapper);
    }

    @Override
    public List<SysDept> listDepts(String keyword, Integer pageNum, Integer pageSize) {
        QueryWrapper<SysDept> wrapper = new QueryWrapper<>();

        if (keyword != null && !keyword.trim().isEmpty()) {
            wrapper.and(w -> w
                .like("dept_name", keyword)
                .or()
                .like("dept_code", keyword)
                .or()
                .like("description", keyword)
            );
        }

        wrapper.orderByAsc("sort_order").orderByDesc("create_time");

        Page<SysDept> page = new Page<>(pageNum, pageSize);
        return this.baseMapper.selectPage(page, wrapper).getRecords();
    }

    @Override
    @Transactional
    public boolean updateDeptStatus(Long deptId, Integer status) {
        SysDept dept = new SysDept();
        dept.setId(deptId);
        dept.setStatus(status);
        return this.updateById(dept);
    }
}
```

### 4. 部门-用户关联绑定

```java
// 实体：部门用户关联表
@Data
@TableName("sys_dept_user")
public class SysDeptUser {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long deptId;    // 部门 ID
    private Long userId;    // 用户 ID

    private LocalDateTime createTime;
}

// Service：绑定用户到部门
@Service
public class SysDeptUserServiceImpl
        extends ServiceImpl<SysDeptUserMapper, SysDeptUser>
        implements SysDeptUserService {

    @Override
    @Transactional
    public boolean bindUsers(Long deptId, List<Long> userIds) {
        // 先删除旧的绑定关系
        LambdaQueryWrapper<SysDeptUser> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysDeptUser::getDeptId, deptId);
        this.remove(wrapper);

        // 创建新的绑定关系
        List<SysDeptUser> list = userIds.stream().map(userId -> {
            SysDeptUser du = new SysDeptUser();
            du.setDeptId(deptId);
            du.setUserId(userId);
            return du;
        }).collect(Collectors.toList());

        return this.saveBatch(list);
    }
}
```

## 重点内容

- `@RequestBody Map<String, Object>` 接收 JSON 参数，灵活处理
- 参数校验必须在 Controller 或 Service 层完成，确保数据合法性
- 业务规则（如编码唯一性）在 Service 层实现
- 关联操作使用 `@Transactional` 保证事务一致性
- `saveBatch()` 批量插入，性能优于循环 `save()`

## 注意事项

- 参数校验要尽早进行，发现不合法立即抛异常
- `@RequestBody` 接收的 JSON 参数，Content-Type 必须为 `application/json`
- 批量操作前先删除旧数据再插入新数据
- 创建操作返回新创建的实体对象（含 ID）

## 常见误区

- 误区：Controller 中直接操作 Mapper，跳过 Service 层
- 误区：参数校验不完整，空值导致 NullPointerException
- 误区：关联操作不加事务，中途失败导致数据不一致
- 误区：`saveBatch` 的 `List` 过大，应分批处理

## 官方资源扩展

- [Spring Boot REST 控制器](https://spring.io/guides/gs/rest-service/) - 官方 REST 服务指南
- [MyBatis-Plus 批量操作](https://baomidou.com/pages/49cc81/) - 批量插入/更新文档
- [Spring 事务管理](https://docs.spring.io/spring-framework/reference/data-access/transaction.html) - 事务管理官方文档