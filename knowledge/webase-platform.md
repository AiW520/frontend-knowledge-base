# WeBASE 平台搭建

## 竞赛关联

比赛要求选手部署 WeBASE 平台的完整组件链（WeBASE-Front、WeBASE-Node-Manager、WeBASE-Web），并配置 MySQL 数据库和 Nginx 反向代理。WeBASE 是区块链应用开发和运维的核心中间件平台。

## 核心技能

- **WeBASE 组件架构**：Front / Node-Manager / Sign / Web 四层架构
- **MySQL 配置**：数据库创建、字符集设置、账号权限
- **Nginx 反向代理**：静态资源服务、接口转发
- **WeBASE-Front 部署**：节点前置服务，连接区块链节点
- **WeBASE-Node-Manager**：节点管理服务，处理业务逻辑
- **WeBASE-Web**：前端管理界面，可视化操作

## 详细讲解

### 1. WeBASE 组件架构

```
┌──────────────────────────────────────┐
│           WeBASE-Web                  │  ← 前端管理页面（Vue.js）
│           (端口 5000)                  │
├──────────────────────────────────────┤
│       WeBASE-Node-Manager             │  ← 节点管理服务（Spring Boot）
│           (端口 5001)                  │
├──────────────────────────────────────┤
│       WeBASE-Front                    │  ← 节点前置服务（Spring Boot）
│           (端口 5002)                  │
├──────────────────────────────────────┤
│       FISCO BCOS 节点                  │  ← 区块链节点
│           (端口 20200)                 │
└──────────────────────────────────────┘
```

### 2. 环境准备

```bash
# 第一步：安装 MySQL
sudo apt-get install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# 第二步：创建数据库和用户
mysql -u root -p
```

```sql
-- 创建 WeBASE 数据库
CREATE DATABASE IF NOT EXISTS webasenodemanager DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- 创建用户并授权
CREATE USER 'webase'@'localhost' IDENTIFIED BY 'webase123';
GRANT ALL PRIVILEGES ON webasenodemanager.* TO 'webase'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 部署 WeBASE-Front（节点前置）

```bash
# 第一步：下载 WeBASE-Front
cd /root/tools/webase
wget https://osp-1257653870.cos.ap-guangzhou.myqcloud.com/WeBASE/releases/download/v1.5.5/webase-front.zip
unzip webase-front.zip
cd webase-front

# 第二步：拷贝节点证书
cp -r /root/tools/generator/nodes/127.0.0.1/sdk/* conf/

# 第三步：修改配置 conf/application.yml
# 确保 sdk 证书路径正确指向 conf/ 目录

# 第四步：启动 WeBASE-Front
bash start.sh

# 检查启动状态
bash status.sh
# 访问 http://localhost:5002/WeBASE-Front
```

### 4. 部署 WeBASE-Node-Manager

```bash
# 第一步：下载 WeBASE-Node-Manager
cd /root/tools/webase
wget https://osp-1257653870.cos.ap-guangzhou.myqcloud.com/WeBASE/releases/download/v1.5.5/webase-node-mgr.zip
unzip webase-node-mgr.zip
cd webase-node-mgr

# 第二步：修改 conf/application.yml
# 配置数据库连接
# spring.datasource.url=jdbc:mysql://localhost:3306/webasenodemanager
# spring.datasource.username=webase
# spring.datasource.password=webase123

# 第三步：初始化数据库
cd dist/script
bash webase.sh

# 第四步：启动服务
bash start.sh
bash status.sh
```

### 5. 部署 WeBASE-Web（前端管理界面）

```bash
# 第一步：下载 WeBASE-Web
cd /root/tools/webase
wget https://osp-1257653870.cos.ap-guangzhou.myqcloud.com/WeBASE/releases/download/v1.5.5/webase-web.zip
unzip webase-web.zip
cd webase-web

# 第二步：配置 Nginx
```

```nginx
# /etc/nginx/conf.d/webase.conf
server {
    listen 5000 default_server;
    server_name localhost;

    # WeBASE-Web 静态资源
    location / {
        root /root/tools/webase/webase-web;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 代理到 Node-Manager
    location /WeBASE-Node-Manager/ {
        proxy_pass http://127.0.0.1:5001/WeBASE-Node-Manager/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# 启动 Nginx
nginx -t
systemctl restart nginx
```

### 6. 验证 WeBASE 平台

```bash
# 检查所有服务状态
bash /root/tools/webase/webase-front/status.sh
bash /root/tools/webase/webase-node-mgr/status.sh
systemctl status nginx
systemctl status mysql

# 访问 WeBASE-Web
# http://localhost:5000
# 默认账号：admin / Abcd1234
```

## 重点内容

- WeBASE-Front 是核心组件，直接连接区块链节点
- 部署顺序：MySQL → WeBASE-Front → WeBASE-Node-Manager → WeBASE-Web
- 每个组件都有独立的 `application.yml` 配置文件
- 节点证书必须正确拷贝到 WeBASE-Front 的 conf 目录
- Nginx 负责前端静态资源和后端 API 的反向代理

## 注意事项

- MySQL 必须在 WeBASE-Node-Manager 启动前创建好数据库和表
- WeBASE-Front 的节点证书必须与区块链节点一致
- 各个服务的端口不能冲突
- 首次启动 Node-Manager 需要执行数据库初始化脚本

## 常见误区

- 误区：忘记启动 MySQL，Node-Manager 无法连接数据库
- 误区：证书路径配置错误，Front 无法连接节点
- 误区：Nginx 配置中 proxy_pass 缺少末尾斜杠
- 误区：WeBASE-Web 的 Nginx 未配置 try_files，刷新页面 404

## 官方资源扩展

- [WeBASE 快速入门](https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE/quick-start.html) - 官方快速部署指南
- [WeBASE-Front 接口文档](https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE-Front/interface.html) - 接口完整说明
- [WeBASE 安装部署](https://webasedoc.readthedocs.io/zh_CN/latest/docs/WeBASE/install.html) - 详细部署文档
- [Nginx 官方文档](https://nginx.org/en/docs/) - Nginx 配置参考