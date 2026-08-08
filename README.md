# 🛒 超市仓库货物管理系统 (Supermarket Goods System)

一个完整的超市仓库货物管理系统，包含商品管理、库存管理、入库出库、供应商管理、仓库管理、员工管理等功能模块。采用前后端分离架构，支持多角色权限控制。

## 📋 项目概述

本项目为超市仓库货物管理系统，旨在帮助超市实现对仓库货物、供应商、入库/出库记录等业务的信息化管理。系统支持**管理员（admin）**和**员工（employee）**两种角色，不同角色具有不同的操作权限。

### 核心功能

| 功能模块 | 描述 | 管理员 | 员工 |
|---------|------|--------|------|
| 📊 仪表盘 | 系统概览、库存统计、预警信息 | ✅ | ✅ |
| 📦 商品管理 | 商品的增删改查与库存管理 | ✅ | ✅ |
| 📂 分类管理 | 商品分类的增删改查 | ✅ | ✅ |
| 🏭 仓库管理 | 仓库信息管理、容量配置 | ✅ | ❌ |
| 🚚 供应商管理 | 供应商信息的增删改查 | ✅ | ❌ |
| 📥 入库管理 | 商品入库记录管理 | ✅ | ✅ |
| 📤 出库管理 | 商品出库记录管理 | ✅ | ✅ |
| 🔍 库存查询 | 库存查询与低库存预警 | ✅ | ✅ |
| 👥 员工管理 | 系统用户的增删改查 | ✅ | ❌ |

---

## 🏗️ 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────┐
│                   前端 (Frontend)                 │
│  ┌─────────────────┐  ┌───────────────────────┐  │
│  │  Vue 3 SPA 版本  │  │  原生 HTML/JS 版本     │  │
│  │  (推荐使用)       │  │  (静态演示版)          │  │
│  └────────┬────────┘  └───────────┬───────────┘  │
│           │         HTTP/REST      │              │
└───────────┼───────────────────────┼──────────────┘
            │                       │
┌───────────┼───────────────────────┼──────────────┐
│           ▼                       ▼              │
│              后端 (Spring Boot)                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  Controller Layer (REST API)                │ │
│  ├─────────────────────────────────────────────┤ │
│  │  Service Layer (业务逻辑)                    │ │
│  ├─────────────────────────────────────────────┤ │
│  │  Repository Layer (Spring Data JPA)         │ │
│  ├─────────────────────────────────────────────┤ │
│  │  Security (Spring Security + JWT)           │ │
│  └────────────────────┬────────────────────────┘ │
│                       │                          │
│              ┌────────▼────────┐                 │
│              │   H2 Database   │                 │
│              │  (文件持久化)     │                 │
│              └─────────────────┘                 │
└─────────────────────────────────────────────────┘
```

### 后端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Spring Boot | 3.3.1 | 核心框架 |
| Spring Data JPA | — | ORM 数据访问 |
| Spring Security | — | 认证与授权 |
| JWT (jjwt) | 0.12.6 | JSON Web Token 认证 |
| H2 Database | — | 嵌入式关系数据库 |
| Spring Validation | — | 请求参数校验 |
| Java | 17 | 运行环境 |

### 前端技术栈 (Vue 3 SPA)

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4 | 渐进式前端框架 |
| Vite | 5.3 | 构建工具 |
| Vue Router | 4.3 | 前端路由 |
| Pinia | 2.1 | 状态管理 |
| Axios | 1.7 | HTTP 客户端 |

---

## 🚀 快速开始

### 环境要求

- **JDK 17** 或更高版本
- **Node.js 18** 或更高版本
- **Maven 3.6** 或更高版本

### 1. 克隆项目

```bash
git clone https://github.com/3427721896/SupermarketGoodsSystem.git
cd SupermarketGoodsSystem
```

### 2. 启动后端

```bash
cd supermarket-backend

# 使用 Maven Wrapper（Windows）
mvnw.cmd spring-boot:run

# 使用 Maven Wrapper（Linux/macOS）
./mvnw spring-boot:run

# 或使用系统 Maven
mvn spring-boot:run
```

后端服务启动后运行在 `http://localhost:8080`

- **H2 控制台**: `http://localhost:8080/h2-console`
- **API 基础路径**: `http://localhost:8080/api`

### 3. 启动前端 (Vue 3 版本)

```bash
cd supermarket-frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

前端开发服务器运行在 `http://localhost:5173`，并自动代理 API 请求到后端。

### 4. 访问系统

打开浏览器访问 `http://localhost:5173`，使用以下预置账号登录：

| 角色 | 用户名 | 密码 | 权限 |
|------|--------|------|------|
| 管理员 | `admin` | `123456` | 全部功能 |
| 员工 | `employee` | `123456` | 有限功能 |

---

## 📁 项目结构

```
SupermarketGoodsSystem/
│
├── supermarket-backend/              # Spring Boot 后端项目
│   ├── pom.xml                       # Maven 配置
│   └── src/main/
│       ├── java/com/supermarket/
│       │   ├── SupermarketApplication.java    # 启动类
│       │   ├── config/
│       │   │   ├── SecurityConfig.java        # Spring Security 配置
│       │   │   ├── JwtUtil.java               # JWT 工具类
│       │   │   ├── JwtAuthFilter.java         # JWT 认证过滤器
│       │   │   ├── DataInitializer.java       # 测试数据初始化
│       │   │   └── GlobalExceptionHandler.java # 全局异常处理
│       │   ├── controller/           # REST 控制器层
│       │   │   ├── AuthController.java        # 认证接口
│       │   │   ├── UserController.java        # 用户管理
│       │   │   ├── GoodsController.java       # 商品管理
│       │   │   ├── CategoryController.java    # 分类管理
│       │   │   ├── WarehouseController.java   # 仓库管理
│       │   │   ├── SupplierController.java    # 供应商管理
│       │   │   ├── InboundController.java     # 入库管理
│       │   │   └── OutboundController.java    # 出库管理
│       │   ├── service/              # 业务逻辑层
│       │   ├── repository/           # 数据访问层 (JPA)
│       │   ├── entity/               # 数据实体
│       │   │   ├── User.java                  # 用户
│       │   │   ├── Goods.java                 # 商品
│       │   │   ├── Category.java              # 分类
│       │   │   ├── Warehouse.java             # 仓库
│       │   │   ├── Supplier.java              # 供应商
│       │   │   ├── InboundRecord.java         # 入库记录
│       │   │   └── OutboundRecord.java        # 出库记录
│       │   └── dto/                  # 数据传输对象
│       └── resources/
│           └── application.yml       # 应用配置
│
├── supermarket-frontend/             # Vue 3 前端项目
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.js                   # 入口文件
│       ├── App.vue                   # 根组件
│       ├── router/index.js           # 路由配置
│       ├── stores/auth.js            # 认证状态管理
│       ├── api/index.js              # API 封装
│       ├── components/               # 公共组件
│       │   ├── Sidebar.vue           # 侧边栏导航
│       │   └── Topbar.vue            # 顶栏
│       └── views/                    # 页面组件
│           ├── Login.vue             # 登录页
│           ├── DashboardLayout.vue   # 主布局
│           ├── Dashboard.vue         # 仪表盘
│           ├── GoodsManage.vue       # 商品管理
│           ├── CategoryManage.vue    # 分类管理
│           ├── WarehouseManage.vue   # 仓库管理
│           ├── SupplierManage.vue    # 供应商管理
│           ├── InboundManage.vue     # 入库管理
│           ├── OutboundManage.vue    # 出库管理
│           ├── InventoryQuery.vue    # 库存查询
│           └── EmployeeManage.vue    # 员工管理
│
├── 项目文档/                          # 项目设计文档
│   ├── ER图.png                      # 数据库 ER 图
│   ├── 功能结构图.png                 # 系统功能结构图
│   ├── 数据顶层流图.png               # 数据顶层流图 (DFD)
│   └── 第4小组24计科3《超市仓库货物管理系统》课程报告（第二版）.docx
│
├── index.html                        # 原生 HTML 登录页（静态版）
├── dashboard.html                    # 原生 HTML 仪表盘（静态版）
├── css/style.css                     # 静态版样式
├── js/                               # 静态版脚本
│   ├── data.js                       # 数据管理
│   ├── auth.js                       # 认证逻辑
│   └── app.js                        # 应用逻辑
└── README.md                         # 项目说明文档
```

---

## 📊 数据库设计

系统使用 7 张核心数据表：

| 表名 | 说明 | 主要字段 |
|------|------|----------|
| `users` | 系统用户 | id, username, password, name, role, phone |
| `goods` | 商品信息 | id, name, code, price, stock, minStock |
| `category` | 商品分类 | id, name, code, desc |
| `warehouse` | 仓库信息 | id, name, code, manager, capacity |
| `supplier` | 供应商 | id, name, contact, phone, address |
| `inbound_record` | 入库记录 | id, goodsId, quantity, price, supplierId |
| `outbound_record` | 出库记录 | id, goodsId, quantity, price, customer |

> 详细 ER 图请查看 `项目文档/ER图.png`

---

## 🔐 安全设计

- **认证方式**: 基于 JWT (JSON Web Token) 的无状态认证
- **密码加密**: BCrypt 加密存储
- **角色权限**:
  - `ADMIN`（管理员）：拥有全部操作权限
  - `EMPLOYEE`（员工）：仅能操作商品、分类、入库、出库、库存查询
- **Token 有效期**: 24 小时（可配置）
- **CORS**: 已配置跨域支持

---

## 🔌 API 接口概览

| 接口路径 | 方法 | 说明 | 权限 |
|----------|------|------|------|
| `/api/auth/login` | POST | 用户登录 | 公开 |
| `/api/auth/me` | GET | 获取当前用户信息 | 登录用户 |
| `/api/users/**` | CRUD | 用户管理 | ADMIN |
| `/api/goods/**` | CRUD | 商品管理 | 登录用户 |
| `/api/categories/**` | CRUD | 分类管理 | 登录用户 |
| `/api/warehouses/**` | CRUD | 仓库管理 | ADMIN |
| `/api/suppliers/**` | CRUD | 供应商管理 | ADMIN |
| `/api/inbound/**` | CRUD | 入库记录 | 登录用户 |
| `/api/outbound/**` | CRUD | 出库记录 | 登录用户 |

---

## ⚙️ 配置说明

主要配置项位于 `supermarket-backend/src/main/resources/application.yml`：

```yaml
server:
  port: 8080                          # 后端服务端口

spring:
  datasource:
    url: jdbc:h2:file:./data/supermarket  # H2 数据库文件路径

app:
  jwt:
    secret: your-secret-key            # JWT 签名密钥
    expiration-ms: 86400000            # Token 有效期（毫秒）
```

---

## 🎯 项目特点

1. **前后端分离**: 后端提供 RESTful API，前端独立开发部署
2. **双前端方案**: 同时提供 Vue 3 SPA 和原生 HTML/JS 两种前端实现
3. **角色权限**: 细粒度的 RBAC 权限控制
4. **嵌入式数据库**: 使用 H2 文件数据库，无需额外安装数据库
5. **即开即用**: 启动后自动初始化测试数据
6. **库存预警**: 自动检测低库存商品并预警

---

## 👥 开发者

本项目为 **第4小组 24计科3** 课程设计项目。

---

## 📄 许可证

本项目仅用于学习和教育目的。
