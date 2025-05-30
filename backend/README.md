# MoYun API Server

> "墨韵"在线读书交流平台 API 服务端

## 项目介绍

墨韵是一个在线读书交流平台，旨在为用户提供一个分享阅读心得、交流读书感悟的空间。项目采用前后端分离架构，本部分为API服务端。

### 主要功能

* 用户系统：完整的账号管理和认证
* 书评系统：发布、点赞、评论书评
* 圈子系统：创建和管理读书交流圈
* 消息系统：私信和通知集中管理
* AI助手：基于通义千问的创作辅助

### 技术特点

* RESTful API设计
* 标准化的JSON响应格式
* Redis缓存集成
* 完整的错误处理
* 第三方API集成（通义千问、今日诗词等）

## API文档

### 认证相关

#### 登录
- **POST** `/api/auth/login`
```json
请求体：
{
    "account": "username",
    "password": "password"
}

响应：
{
    "status": "success",
    "data": {
        "token": "xxx",
        "user": {
            "id": 1,
            "account": "username",
            "role": "student"
        }
    }
}
```

#### 注册
- **POST** `/api/auth/register`
```json
请求体：
{
    "account": "username",
    "password": "password",
    "email": "user@example.com"
}

响应：
{
    "status": "success",
    "data": {
        "message": "Registration successful"
    }
}
```

### 用户相关

#### 获取当前用户信息
- **GET** `/api/users/me`
```json
响应：
{
    "status": "success",
    "data": {
        "user": {
            "id": 1,
            "account": "username",
            "signature": "个性签名",
            "email": "user@example.com"
        },
        "profile_photo": "/static/profilePhoto/1.jpg"
    }
}
```

#### 更新用户资料
- **PUT** `/api/users/me`
```json
请求体：
{
    "account": "new_username",
    "signature": "新的签名",
    "email": "new@example.com"
}

响应：
{
    "status": "success",
    "data": {
        "message": "Profile updated successfully"
    }
}
```

### 书评相关

#### 获取书评列表
- **GET** `/api/journals?limit=10&offset=0`
```json
响应：
{
    "status": "success",
    "data": {
        "journals": [{
            "id": 1,
            "title": "书评标题",
            "first_paragraph": "首段内容",
            "author": {
                "id": 1,
                "name": "作者名"
            },
            "publish_time": "2024-04-17T19:53:52+08:00"
        }],
        "pagination": {
            "total": 100,
            "current_page": 1,
            "per_page": 10
        }
    }
}
```

#### 发表书评
- **POST** `/api/journals`
```json
请求体：
{
    "title": "书评标题",
    "content": "书评内容",
    "book_id": 1
}

响应：
{
    "status": "success",
    "data": {
        "journal_id": 1,
        "message": "Journal published successfully"
    }
}
```

### 圈子相关

#### 获取圈子列表
- **GET** `/api/groups`
```json
响应：
{
    "status": "success",
    "data": {
        "groups": [{
            "id": 1,
            "name": "圈子名称",
            "description": "圈子描述",
            "founder": {
                "id": 1,
                "name": "创建者"
            }
        }]
    }
}
```

#### 创建圈子
- **POST** `/api/groups`
```json
请求体：
{
    "name": "圈子名称",
    "description": "圈子描述"
}

响应：
{
    "status": "success",
    "data": {
        "group_id": 1,
        "message": "Group created successfully"
    }
}
```

### 消息相关

#### 获取未读消息
- **GET** `/api/messages`
```json
响应：
{
    "status": "success",
    "data": {
        "journal_messages": {
            "journals": [],
            "comments": []
        },
        "group_messages": {
            "groups": [],
            "discussions": []
        },
        "chat_messages": {
            "senders": [],
            "chats": []
        }
    }
}
```

#### 发送私信
- **POST** `/api/messages/chat`
```json
请求体：
{
    "receiver_id": 2,
    "content": "消息内容"
}

响应：
{
    "status": "success",
    "data": {
        "message": "Message sent successfully"
    }
}
```

## 数据库结构

### 主要实体表

#### user（用户表）
```sql
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account` varchar(24) NOT NULL COMMENT '用户名',
  `password` text NOT NULL COMMENT '密码',
  `signature` varchar(128) DEFAULT '' COMMENT '签名档',
  `email` varchar(128) DEFAULT NULL COMMENT '邮箱',
  `telephone` varchar(11) DEFAULT NULL COMMENT '联系电话',
  `role` enum('student','teacher','admin') NOT NULL DEFAULT 'student' COMMENT '身份组',
  PRIMARY KEY (`id`)
)
```

#### book（书籍表）
```sql
CREATE TABLE `book` (
  `id` int NOT NULL AUTO_INCREMENT,
  `isbn` varchar(32) NOT NULL COMMENT 'ISBN',
  `title` varchar(128) NOT NULL COMMENT '标题',
  `author` varchar(128) NOT NULL COMMENT '作者',
  `description` text COMMENT '简介',
  PRIMARY KEY (`id`)
)
```

#### journal（书评表）
```sql
CREATE TABLE `journal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(128) NOT NULL,
  `first_paragraph` text NOT NULL,
  `content` text NOT NULL,
  `publish_time` datetime NOT NULL,
  `author_id` int NOT NULL,
  `book_id` int NOT NULL,
  PRIMARY KEY (`id`)
)
```

#### group（圈子表）
```sql
CREATE TABLE `group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL COMMENT '圈子的名称',
  `founder_id` int NOT NULL COMMENT '圈子创建者的ID',
  `establish_time` datetime NOT NULL,
  `description` text COMMENT '对该圈子的介绍',
  PRIMARY KEY (`id`)
)
```

### 关联表

- chat：私信记录
- journal_comment：书评评论
- journal_like：书评点赞
- group_discussion：圈子讨论
- group_user：圈子成员

## 开发和部署指南

### 环境要求

* Python 3.10+
* MySQL 8.0+
* Redis 6.0+
* 操作系统：Windows/Linux

### 本地开发

1. 获取代码
```bash
git clone [仓库地址]
cd MoYun-updating-version
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 配置文件
复制`config.yaml.example`为`config.yaml`并修改：
- 数据库连接信息
- Redis配置
- 通义千问API密钥（可选）
- 邮箱服务配置（可选）

4. 初始化数据库
```bash
python initDB.py
```

5. 运行开发服务器
```bash
python app.py
```

### 生产环境部署

1. 配置Nginx
将`nginx.cfg`复制到Nginx配置目录：
```bash
cp nginx.cfg /etc/nginx/conf.d/moyun.conf
nginx -t && nginx -s reload
```

2. 使用uWSGI（Linux）
```bash
uwsgi --ini uwsgi.ini
```

或使用Tornado（Windows）
```bash
python tornadoApp.py
```

### 文件存储

用户上传的文件存储在static目录下：
- /static/profilePhoto/：用户头像
- /static/bookCover/：书籍封面
- /static/journalHeader/：书评封面
- /static/groupIcon/：圈子图标

## 项目结构

```
MoYun-updating-version/
├── app.py                 # Flask主应用入口
├── tornadoApp.py         # Tornado服务器入口（Windows生产环境）
├── uwsgi.ini             # uWSGI配置（Linux生产环境）
├── config.yaml           # 全局配置文件
├── requirements.txt      # Python依赖列表
├── ddl.sql              # 数据库结构定义
├── initDB.py            # 数据库初始化脚本
├── nginx.cfg            # Nginx配置示例
│
├── service/             # 核心服务模块
│   ├── File.py         # 文件处理服务
│   ├── Img.py          # 图片处理服务
│   ├── Network.py      # 网络请求服务（第三方API封装）
│   ├── Utils.py        # 通用工具函数
│   │
│   ├── database/       # 数据库操作模块
│   │   ├── DAO.py     # 数据访问对象
│   │   ├── Model.py   # 数据模型定义
│   │   ├── Redis.py   # Redis缓存操作
│   │   └── Utils.py   # 数据库工具函数
│   │
│   └── response/       # API响应处理模块
│       ├── __init__.py
│       ├── _Utils.py   # 响应工具函数
│       ├── Book.py     # 书籍相关API
│       ├── Chat.py     # 私信相关API
│       ├── Error.py    # 错误处理API
│       ├── Group.py    # 圈子相关API
│       ├── Home.py     # 首页相关API
│       ├── Index.py    # 认证相关API
│       ├── Journal.py  # 书评相关API
│       ├── LLM.py      # AI助手API
│       ├── Message.py  # 消息中心API
│       ├── Profile.py  # 用户资料API
│       └── Search.py   # 搜索功能API
│
└── uwsgi/              # uWSGI运行时文件
    └── uwsgi.pid      # uWSGI进程ID文件

主要目录说明：

1. 根目录配置文件
   - config.yaml：项目配置，包括数据库、Redis、第三方API等配置
   - requirements.txt：项目依赖清单
   - ddl.sql：数据库结构定义
   - nginx.cfg：Nginx服务器配置示例
   - uwsgi.ini：uWSGI服务器配置

2. 核心服务模块（service/）
   - File.py：处理文件上传、删除、路径管理等
   - Img.py：处理图片压缩、格式转换等
   - Network.py：封装第三方API调用（今日诗词、通义千问等）
   - Utils.py：提供通用工具函数

3. 数据库模块（service/database/）
   - DAO.py：实现数据库CRUD操作
   - Model.py：定义数据库模型和关系
   - Redis.py：实现缓存层操作
   - Utils.py：数据库工具函数

4. API响应模块（service/response/）
   - _Utils.py：共用的响应处理工具
   - Book.py：书籍增删改查API
   - Chat.py：私信发送和管理API
   - Error.py：统一的错误响应处理
   - Group.py：圈子管理和互动API
   - Home.py：首页数据聚合API
   - Index.py：用户认证和授权API
   - Journal.py：书评发布和互动API
   - LLM.py：AI创作助手API
   - Message.py：消息中心API
   - Profile.py：用户资料管理API
   - Search.py：全局搜索API

5. 入口文件
   - app.py：开发环境入口
   - tornadoApp.py：Windows生产环境入口
   - uwsgi.ini：Linux生产环境入口
