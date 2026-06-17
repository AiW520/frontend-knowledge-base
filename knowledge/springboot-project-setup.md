# Spring Boot 项目搭建与配置

## 竞赛关联

比赛后端开发部分要求选手在给定的 Spring Boot 项目模板中补充代码。选手需要理解项目结构、pom.xml 依赖配置、application.yml 配置项，以及多模块项目的组织方式。

## 核心技能

- **Maven 项目结构**：pom.xml、多模块、依赖管理
- **application.yml 配置**：数据库、服务器端口、MyBatis-Plus
- **Spring Boot 启动类**：@SpringBootApplication、@MapperScan
- **配置文件**：多环境配置、占位符
- **项目结构**：Controller → Service → Mapper 分层

## 详细讲解

### 1. 项目结构

```
springboot-project/
├── pom.xml                          # 父 POM
├── src/
│   └── main/
│       ├── java/com/example/project/
│       │   ├── ProjectApplication.java      # 启动类
│       │   ├── controller/                   # 控制器层
│       │   │   ├── UserController.java
│       │   │   └── DeptController.java
│       │   ├── service/                      # 服务层
│       │   │   ├── UserService.java
│       │   │   └── impl/
│       │   │       └── UserServiceImpl.java
│       │   ├── mapper/                       # 数据访问层
│       │   │   ├── UserMapper.java
│       │   │   └── DeptMapper.java
│       │   ├── entity/                       # 实体类
│       │   │   ├── User.java
│       │   │   └── Dept.java
│       │   ├── config/                       # 配置类
│       │   │   └── MyBatisPlusConfig.java
│       │   └── common/                       # 公共类
│       │       ├── Result.java
│       │       └── ErrorCode.java
│       └── resources/
│           ├── application.yml               # 配置文件
│           ├── application-dev.yml           # 开发环境
│           └── application-prod.yml          # 生产环境
```

### 2. pom.xml 配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.18</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>blockchain-backend</artifactId>
    <version>1.0.0</version>
    <name>blockchain-backend</name>
    <description>区块链应用后端服务</description>

    <properties>
        <java.version>1.8</java.version>
        <mybatis-plus.version>3.5.3.1</mybatis-plus.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- MyBatis-Plus -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>${mybatis-plus.version}</version>
        </dependency>

        <!-- MySQL 驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- 测试 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 3. application.yml 配置

```yaml
# application.yml - 主配置文件
server:
  port: 8080

spring:
  profiles:
    active: dev                          # 激活开发环境配置
  application:
    name: blockchain-backend
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/blockchain_db?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: root123
    type: com.zaxxer.hikari.HikariDataSource
    hikari:
      minimum-idle: 5
      maximum-pool-size: 20
      idle-timeout: 30000
      max-lifetime: 1800000

# MyBatis-Plus 配置
mybatis-plus:
  mapper-locations: classpath*:mapper/**/*.xml
  type-aliases-package: com.example.project.entity
  configuration:
    map-underscore-to-camel-case: true    # 驼峰转换
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl  # SQL 日志
  global-config:
    db-config:
      id-type: auto                       # 主键自增
      logic-delete-field: deleted         # 逻辑删除字段
      logic-delete-value: 1
      logic-not-delete-value: 0

# 日志配置
logging:
  level:
    com.example.project: debug
    com.baomidou.mybatisplus: debug
```

### 4. 启动类

```java
package com.example.project;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.project.mapper")  // 扫描 Mapper 接口
public class ProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectApplication.class, args);
        System.out.println("========================================");
        System.out.println("  区块链后端服务启动成功！");
        System.out.println("  访问地址: http://localhost:8080");
        System.out.println("========================================");
    }
}
```

### 5. 多环境配置

```yaml
# application-dev.yml - 开发环境
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/blockchain_dev
    username: dev
    password: dev123

# application-prod.yml - 生产环境
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://production-server:3306/blockchain_prod
    username: prod_user
    password: ${DB_PASSWORD}          # 从环境变量读取
```

## 重点内容

- `@SpringBootApplication` 是 Spring Boot 应用的入口注解
- `@MapperScan` 扫描 MyBatis-Plus 的 Mapper 接口，必须配置
- MyBatis-Plus 配置 `map-underscore-to-camel-case: true` 自动转换数据库字段 `user_name` 为 Java 属性 `userName`
- 逻辑删除通过 `logic-delete-field` 配置，自动在查询时过滤已删除数据
- 生产环境密码通过环境变量 `${DB_PASSWORD}` 注入，不硬编码

## 注意事项

- Spring Boot 版本与 MyBatis-Plus 版本需要兼容（2.x 配 3.5.x）
- `@MapperScan` 路径必须与 Mapper 接口的实际包路径一致
- MySQL 连接池使用 HikariCP（Spring Boot 默认），性能最优
- 多环境配置文件命名规则：`application-{profile}.yml`

## 常见误区

- 误区：忘记 `@MapperScan`，Mapper 注入失败
- 误区：`spring.datasource.url` 中的 `serverTimezone` 不设置，时区错误
- 误区：MyBatis-Plus 版本与 Spring Boot 版本不兼容
- 误区：生产环境密码硬编码在配置文件中

## 官方资源扩展

- [Spring Boot 官方文档](https://spring.io/projects/spring-boot) - 最权威的 Spring Boot 文档
- [MyBatis-Plus 官方文档](https://baomidou.com/) - MyBatis-Plus 完整指南
- [Spring Boot 配置参考](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html) - 所有配置项
- [HikariCP 连接池](https://github.com/brettwooldridge/HikariCP) - 高性能连接池文档