# 统一响应与异常处理

## 竞赛关联

比赛后端接口需要返回统一的 JSON 响应格式，选手需要理解 Result 封装类、ErrorCode 枚举、全局异常捕获等机制。正确使用这些工具类能确保后端接口的规范性和可维护性。

## 核心技能

- **Result 统一响应类**：封装 code、message、data
- **ErrorCode 错误码**：枚举定义业务错误码
- **全局异常处理**：@RestControllerAdvice + @ExceptionHandler
- **自定义异常**：BusinessException 业务异常
- **参数校验**：@Valid + BindingResult

## 详细讲解

### 1. Result 统一响应类

```java
package com.example.project.common;

import java.io.Serializable;

public class Result<T> implements Serializable {

    private Integer code;    // 状态码：0-成功，其他-失败
    private String message;  // 提示信息
    private T data;          // 响应数据

    private Result() {}

    // ===== 成功响应 =====
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.code = 0;
        result.message = "操作成功";
        result.data = data;
        return result;
    }

    public static <T> Result<T> success() {
        return success(null);
    }

    // ===== 失败响应 =====
    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.code = code;
        result.message = message;
        result.data = null;
        return result;
    }

    public static <T> Result<T> error(String message) {
        return error(1, message);
    }

    public static <T> Result<T> error(ErrorCode errorCode) {
        return error(errorCode.getCode(), errorCode.getMessage());
    }

    // ===== 分页响应 =====
    public static <T> PageResult<T> page(java.util.List<T> list, Long total) {
        PageResult<T> result = new PageResult<>();
        result.setCode(0);
        result.setMessage("查询成功");
        result.setData(list);
        result.setTotal(total);
        return result;
    }

    // ===== Getters and Setters =====
    public Integer getCode() { return code; }
    public void setCode(Integer code) { this.code = code; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public T getData() { return data; }
    public void setData(T data) { this.data = data; }
}
```

### 2. 分页响应类

```java
package com.example.project.common;

public class PageResult<T> extends Result<java.util.List<T>> {

    private Long total;  // 总记录数

    public Long getTotal() { return total; }
    public void setTotal(Long total) { this.total = total; }
}
```

### 3. ErrorCode 错误码枚举

```java
package com.example.project.common;

public enum ErrorCode {

    // 通用错误
    SUCCESS(0, "操作成功"),
    SYSTEM_ERROR(500, "系统内部错误"),

    // 用户错误（1000-1999）
    USER_NOT_FOUND(1001, "用户不存在"),
    USERNAME_OR_PASSWORD_ERROR(1002, "用户名或密码错误"),
    USERNAME_EXIST(1003, "用户名已存在"),
    PHONE_EXIST(1004, "手机号已注册"),
    USER_DISABLED(1005, "用户已被禁用"),

    // 参数错误（2000-2999）
    PARAM_ERROR(2001, "参数错误"),
    PARAM_MISSING(2002, "缺少必要参数"),
    PARAM_ILLEGAL(2003, "参数不合法"),

    // 业务错误（3000-3999）
    BUSINESS_ERROR(3001, "业务处理失败"),
    DEPT_NOT_FOUND(3002, "部门不存在"),
    DEPT_HAS_USERS(3003, "部门下存在用户，无法删除"),

    // 区块链错误（4000-4999）
    BLOCKCHAIN_ERROR(4001, "区块链操作失败"),
    CONTRACT_DEPLOY_FAILED(4002, "合约部署失败"),
    CONTRACT_NOT_FOUND(4003, "合约不存在");

    private final Integer code;
    private final String message;

    ErrorCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() { return code; }
    public String getMessage() { return message; }
}
```

### 4. 自定义业务异常

```java
package com.example.project.common;

public class BusinessException extends RuntimeException {

    private final Integer code;

    public BusinessException(String message) {
        super(message);
        this.code = 3001;
    }

    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.code = errorCode.getCode();
    }

    public BusinessException(Integer code, String message) {
        super(message);
        this.code = code;
    }

    public Integer getCode() { return code; }
}
```

### 5. 全局异常处理器

```java
package com.example.project.config;

import com.example.project.common.ErrorCode;
import com.example.project.common.BusinessException;
import com.example.project.common.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice  // 全局异常处理 + @ResponseBody
public class GlobalExceptionHandler {

    // 处理业务异常
    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        log.warn("业务异常: code={}, message={}", e.getCode(), e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    // 处理参数校验异常
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<?> handleValidException(MethodArgumentNotValidException e) {
        FieldError fieldError = e.getBindingResult().getFieldError();
        String message = fieldError != null ? fieldError.getDefaultMessage() : "参数校验失败";
        log.warn("参数校验异常: {}", message);
        return Result.error(ErrorCode.PARAM_ERROR);
    }

    // 处理绑定异常
    @ExceptionHandler(BindException.class)
    public Result<?> handleBindException(BindException e) {
        String message = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        log.warn("参数绑定异常: {}", message);
        return Result.error(ErrorCode.PARAM_ERROR.getCode(), message);
    }

    // 处理其他未捕获异常
    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        log.error("系统异常: ", e);
        return Result.error(ErrorCode.SYSTEM_ERROR);
    }
}
```

### 6. Controller 使用示例

```java
package com.example.project.controller;

import com.example.project.common.ErrorCode;
import com.example.project.common.Result;
import com.example.project.common.BusinessException;
import com.example.project.entity.SysUser;
import com.example.project.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private SysUserService sysUserService;

    @PostMapping("/login")
    public Result<SysUser> login(@RequestParam String username,
                                  @RequestParam String password) {
        SysUser user = sysUserService.login(username, password);
        if (user == null) {
            throw new BusinessException(ErrorCode.USERNAME_OR_PASSWORD_ERROR);
        }
        return Result.success(user);
    }

    @GetMapping("/list")
    public Result<?> listUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        return Result.success(
            sysUserService.listUsers(keyword, null, pageNum, pageSize)
        );
    }
}
```

## 重点内容

- `Result<T>` 泛型类封装统一响应格式：`{code, message, data}`
- `code = 0` 表示成功，非 0 表示失败
- `@RestControllerAdvice` 全局捕获异常，统一返回 Result 格式
- `BusinessException` 自定义业务异常，携带错误码
- 错误码分段管理：1000-用户、2000-参数、3000-业务、4000-区块链

## 注意事项

- 全局异常处理器中 `@ExceptionHandler` 的顺序决定优先级
- Controller 中不要 try-catch，交给全局异常处理器统一处理
- 业务异常使用 `throw new BusinessException(ErrorCode.XXX)` 而非 `return Result.error()`
- 日志级别：业务异常用 `warn`，系统异常用 `error`

## 常见误区

- 误区：每个 Controller 方法都 try-catch，代码冗余
- 误区：返回 Result 时忘记设置 code，前端判断混乱
- 误区：异常处理器中吞掉异常不记录日志
- 误区：错误码随意定义，没有分类管理

## 官方资源扩展

- [Spring Boot 异常处理](https://spring.io/blog/2013/11/01/exception-handling-in-spring-mvc) - Spring MVC 异常处理机制
- [Spring @RestControllerAdvice](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-advice.html) - 控制器增强文档
- [Java 异常最佳实践](https://docs.oracle.com/javase/tutorial/essential/exceptions/) - Oracle 官方异常处理教程