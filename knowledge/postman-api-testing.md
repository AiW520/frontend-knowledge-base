# Postman 接口测试

## 竞赛关联

比赛要求选手使用 Postman 对后端 API 进行接口测试，包括构造请求、设置环境变量、编写断言、导出测试集合。Postman 是业界标准的 API 测试工具，也是验证后端功能是否正确的关键手段。

## 核心技能

- **请求构造**：GET/POST、Headers、Body、Params
- **环境变量**：base_url、token 等变量管理
- **断言脚本**：Tests 选项卡编写断言
- **Collections**：组织测试用例集合
- **导出与导入**：JSON 格式导出测试集合

## 详细讲解

### 1. 创建环境变量

```
环境名称：区块链后端-开发环境

变量：
  base_url    = http://localhost:8080
  token       = （登录后自动填充）
  username    = admin
  password    = admin123
```

在 Postman 右上角选择环境后，使用 `{{base_url}}` 引用变量。

### 2. 登录接口测试

**请求配置**：

```
Method: POST
URL: {{base_url}}/user/login
Headers:
  Content-Type: application/x-www-form-urlencoded
Body (x-www-form-urlencoded):
  username: {{username}}
  password: {{password}}
```

**Tests 断言脚本**：

```javascript
// 验证状态码
pm.test("状态码为 200", function () {
    pm.response.to.have.status(200);
});

// 解析响应 JSON
var jsonData = pm.response.json();

// 验证 code 为 0（成功）
pm.test("code 为 0", function () {
    pm.expect(jsonData.code).to.eql(0);
});

// 验证返回数据包含 token
pm.test("响应包含 token", function () {
    pm.expect(jsonData.data).to.have.property("token");
    pm.expect(jsonData.data.token).to.not.be.empty;
});

// 验证返回数据包含 userId
pm.test("响应包含 userId", function () {
    pm.expect(jsonData.data).to.have.property("userId");
});

// 将 token 保存到环境变量
pm.test("保存 token 到环境变量", function () {
    pm.environment.set("token", jsonData.data.token);
    pm.environment.set("userId", jsonData.data.userId);
});

// 验证响应时间
pm.test("响应时间小于 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});
```

### 3. 部门列表接口测试

**请求配置**：

```
Method: GET
URL: {{base_url}}/dept/list?pageNum=1&pageSize=10
Headers:
  Authorization: {{token}}
```

**Tests 断言脚本**：

```javascript
// 验证状态码
pm.test("状态码为 200", function () {
    pm.response.to.have.status(200);
});

var jsonData = pm.response.json();

// 验证 code 为 0
pm.test("code 为 0", function () {
    pm.expect(jsonData.code).to.eql(0);
});

// 验证返回数据是数组
pm.test("返回数据是数组", function () {
    pm.expect(jsonData.data).to.be.an("array");
});

// 验证数组不为空
pm.test("部门列表不为空", function () {
    pm.expect(jsonData.data.length).to.be.greaterThan(0);
});

// 验证每个部门对象包含必要字段
pm.test("每个部门包含必要字段", function () {
    jsonData.data.forEach(function (dept) {
        pm.expect(dept).to.have.property("id");
        pm.expect(dept).to.have.property("deptName");
        pm.expect(dept).to.have.property("deptCode");
    });
});
```

### 4. 创建部门接口测试

**请求配置**：

```
Method: POST
URL: {{base_url}}/dept/create
Headers:
  Content-Type: application/json
  Authorization: {{token}}
Body (raw JSON):
{
  "deptName": "测试部门",
  "deptCode": "TEST001",
  "description": "这是一个测试部门",
  "parentId": 0
}
```

**Tests 断言脚本**：

```javascript
pm.test("状态码为 200", function () {
    pm.response.to.have.status(200);
});

var jsonData = pm.response.json();

pm.test("创建成功", function () {
    pm.expect(jsonData.code).to.eql(0);
});

pm.test("返回部门信息", function () {
    pm.expect(jsonData.data).to.have.property("id");
    pm.expect(jsonData.data.deptName).to.eql("测试部门");
    pm.expect(jsonData.data.deptCode).to.eql("TEST001");
});

// 保存部门 ID 到环境变量
pm.test("保存部门 ID", function () {
    pm.environment.set("deptId", jsonData.data.id);
});
```

### 5. 未登录拦截测试

**请求配置**：

```
Method: GET
URL: {{base_url}}/dept/list?pageNum=1&pageSize=10
Headers:
  （不传 Authorization）
```

**Tests 断言脚本**：

```javascript
pm.test("未登录返回 401", function () {
    pm.response.to.have.status(401);
});

var jsonData = pm.response.json();

pm.test("提示未登录", function () {
    pm.expect(jsonData.code).to.eql(401);
    pm.expect(jsonData.message).to.include("登录");
});
```

### 6. Collections 导出

**导出步骤**：

1. 点击 Collection 名称旁的 `...` 按钮
2. 选择 `Export`
3. 选择 `Collection v2.1` 格式
4. 点击 `Export` 保存为 JSON 文件

**导出后的 JSON 结构**：

```json
{
  "info": {
    "name": "区块链后端接口测试",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "用户模块",
      "item": [
        {
          "name": "登录",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/user/login",
            "header": [...],
            "body": {...}
          }
        }
      ]
    }
  ]
}
```

### 7. 常用断言方法

```javascript
// 状态码断言
pm.response.to.have.status(200);
pm.response.to.have.status(401);

// JSON 断言
var json = pm.response.json();
pm.expect(json.code).to.eql(0);
pm.expect(json.data).to.be.an("array");
pm.expect(json.data).to.have.lengthOf(10);

// 字符串断言
pm.expect(json.message).to.include("成功");
pm.expect(json.message).to.not.include("失败");

// 响应头断言
pm.response.to.have.header("Content-Type");
pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");

// 响应时间断言
pm.expect(pm.response.responseTime).to.be.below(500);

// 环境变量
pm.environment.set("token", json.data.token);
pm.environment.get("token");
pm.environment.unset("token");
```

## 重点内容

- 使用 `{{变量名}}` 引用环境变量，避免硬编码
- 登录接口的 Tests 脚本中自动保存 Token 到环境变量
- 断言脚本使用 `pm.test()` 包裹，每个测试有独立名称
- `pm.expect()` 是 Chai BDD 风格的断言
- 环境变量可跨请求共享，实现请求链

## 注意事项

- 环境变量和全局变量的区别：环境变量随环境切换，全局变量永久有效
- 请求的 Body 类型要与后端接口一致（form-data / x-www-form-urlencoded / raw JSON）
- Token 过期后需要重新登录刷新环境变量
- 导出 Collection 时选择 v2.1 格式，兼容性更好

## 常见误区

- 误区：忘记选择环境，变量未定义
- 误区：POST 请求用 `Params` 传参，应该用 `Body`
- 误区：断言脚本中未 `JSON.parse`，直接使用字符串
- 误区：登录成功后未保存 Token，后续请求 401

## 官方资源扩展

- [Postman 官方文档](https://learning.postman.com/docs/) - 最权威的 Postman 学习资源
- [Postman 断言脚本](https://learning.postman.com/docs/writing-scripts/test-scripts/) - Tests 脚本编写指南
- [Postman 环境变量](https://learning.postman.com/docs/sending-requests/variables/) - 变量管理文档
- [Postman Collections](https://learning.postman.com/docs/collections/collections-overview/) - 集合管理指南