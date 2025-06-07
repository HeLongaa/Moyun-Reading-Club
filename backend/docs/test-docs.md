> 测试文档，记录了API测试过程

# By HeLong

以下是完整的 API 文档，用于 Postman 测试：

说明：

    ✅测试完成的API端点

    ⚠️待测试/未经测试/开发中的API端点

    ❌错误/未修复的API端点

# MoYun API 文档

## 基本信息

- **基础 URL**: `http://localhost:5000/api`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON

## 认证相关

### 1. 用户注册✅

- **URL**: `/account/register`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "account": "tea-1",
    "password": "passwd",
    "email": "tea@mail.com",
    "telephone": "19888998888",
    "signature": "我是老师",
    "role": "teacher"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "注册成功",
    "data": {
        "id": 9,
        "account": "tea-1",
        "email": "tea@mail.com",
        "telephone": "19888998888",
        "signature": "我是老师",
        "role": "teacher",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiYWNjb3VudCI6InRlYS0xIiwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3NDkwNTA1MzUsImV4cCI6MTc0OTA1MDU0Mn0.zmC5PYO89fmPcNj73vpxxuF4i91vtv65zOr7SfVxMtM"
    }
  } 
  ```
  
### 2. 用户登录✅

- **URL**: `/account/login`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "account": "tea-1",
    "password": "passwd"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "登录成功",
    "data": {
        "id": 9,
        "account": "tea-1",
        "email": "tea@mail.com",
        "telephone": "19888998888",
        "signature": "我是老师",
        "role": "teacher",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiYWNjb3VudCI6InRlYS0xIiwicm9sZSI6InRlYWNoZXIiLCJpYXQiOjE3NDkwNTA3NTYsImV4cCI6MTc0OTA1MDc2M30.3ZFztTabU3wBcqeHnErxzQDqlFIizCqQ2lWmC0Jb7r4"
    }
  }
  ```

### 3. 请求重置密码⚠️

- **URL**: `/account/request-password-reset`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "email": "邮箱"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "如果该邮箱已注册，您将收到一封包含密码重置链接的邮件"
  }
  ```

### 4. 重置密码⚠️

- **URL**: `/account/reset-password`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "token": "重置令牌",
    "newPassword": "新密码"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "密码重置成功"
  }
  ```

### 5. 获取当前用户信息✅

- **URL**: `/account/me`
- **方法**: `GET`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "data": {
        "id": 9,
        "account": "tea-1",
        "email": "tea@mail.com",
        "telephone": "19888998888",
        "signature": "我是老师",
        "role": "teacher"
    }
  }
  ```

### 6. 修改密码✅

- **URL**: `/account/change-password`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "currentPassword": "当前密码",
    "newPassword": "新密码"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "密码修改成功"
  }
  ```

## 个人资料相关

### 1. 获取用户个人资料✅

- **URL**: `/profile/:id?`（不提供 id 时获取自己的资料）
- **方法**: `GET`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "account": "用户名",
      "signature": "个性签名",
      "email": "邮箱",
      "telephone": "手机号",
      "role": "student"
    }
  }
  ```

### 2. 更新个人资料✅

- **URL**: `/profile`
- **方法**: `PUT`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "signature": "新签名",
    "email": "新邮箱",
    "telephone": "新手机号"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "个人资料更新成功",
    "data": {
      "id": 1,
      "account": "用户名",
      "signature": "新签名",
      "email": "新邮箱",
      "telephone": "新手机号",
      "role": "student"
    }
  }
  ```

### 3. 上传头像✅

- **URL**: `/profile/upload-photo`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**: FormData 格式，字段名为 `photo`
- **响应**:
  ```json
  {
    "success": true,
    "message": "头像上传成功",
    "userId": 10,
    "data": {
        "path": "/profilePhoto/1749285931536-Eqy4gfCD.png"
    }
  }
  ```

### 4. 获取用户统计信息✅

- **URL**: `/profile/stats/get/:id?`（不提供 id 时获取自己的统计信息）
- **方法**: `GET`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "journalCount": 10,
      "likeCount": 20,
      "commentCount": 5,
      "groupCount": 3
    }
  }
  ```

## 书籍相关

### 1. 获取书籍列表✅

- **URL**: `/book`
- **方法**: `GET`
- **参数**:
  - `page`: 页码（默认 1）
  - `limit`: 每页数量（默认 10）
  - `type`: 书籍类型（可选）
  - `search`: 搜索关键词（可选）
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "books": [
        {
          "id": 1,
          "isbn": "9787020002207",
          "title": "三国演义",
          "author": "罗贯中",
          "publisher": "人民文学出版社",
          "type": "文学"
        }
      ]
    }
  }
  ```

### 2. 获取书籍详情✅

- **URL**: `/book/:id`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "isbn": "9787020002207",
      "title": "三国演义",
      "origin_title": "",
      "subtitle": "",
      "author": "罗贯中",
      "page": 500,
      "publish_date": "1990-01-01T00:00:00.000Z",
      "publisher": "人民文学出版社",
      "description": "《三国演义》是中国古典四大名著之一...",
      "douban_score": 9.5,
      "douban_id": "1234567",
      "bangumi_score": 9.0,
      "bangumi_id": "7654321",
      "type": "文学"
    }
  }
  ```

### 3. 获取书籍类型列表✅

- **URL**: `/book/types`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      "马列主义、毛泽东思想、邓小平理论",
      "哲学、宗教",
      "社会科学总论",
      "文学",
      "艺术",
      "历史、地理"
    ]
  }
  ```

### 4. 创建书籍（需要管理员/教师权限）✅

- **URL**: `/book`
- **方法**: `POST`
- **认证**: 需要 Bearer Token（管理员/教师）
- **请求体**:
  ```json
  {
    "isbn": "9787020002207",
    "title": "三国演义",
    "origin_title": "",
    "subtitle": "",
    "author": "罗贯中",
    "page": 500,
    "publish_date": "1990-01-01",
    "publisher": "人民文学出版社",
    "description": "《三国演义》是中国古典四大名著之一...",
    "douban_score": 9.5,
    "douban_id": "1234567",
    "bangumi_score": 9.0,
    "bangumi_id": "7654321",
    "type": "文学"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "书籍创建成功",
    "data": {
        "local_path": "/bookLocal/default.pdf",
        "book_icon": "/book_icon/default.png",
        "id": 7,
        "isbn": "9787020002207",
        "title": "三国演义",
        "origin_title": "",
        "subtitle": "",
        "author": "罗贯中",
        "page": 500,
        "publish_date": "1990-01-01T00:00:00.000Z",
        "publisher": "人民文学出版社",
        "description": "《三国演义》是中国古典四大名著之一...",
        "douban_score": 9.5,
        "douban_id": "1234567",
        "bangumi_score": 9,
        "bangumi_id": "7654321",
        "type": "文学"
    }
  }
  ```

  ⚠️ 注意，完整的上传流程应该是：先填写信息获取返回的id，通过id添加书籍的内容和图片

### 5. 上传书籍内容/文件 ✅

- **URL**: `/book/upload/:id`
- **方法**: `POST`
- **认证**: 需要 Bearer Token（管理员/教师）
- **请求体**: FormData 格式，字段名为 `book`
- **响应**:
  ```json
  {
    "success": true,
    "message": "书籍上传成功",
    "data": {
        "id": "7",
        "path": "/bookLocal/1749293013641-78TgDick.pdf"
    }
  }
  ```

### 6. 更新书籍（需要管理员/教师权限）✅

- **URL**: `/book/:id`
- **方法**: `PUT`
- **认证**: 需要 Bearer Token（管理员/教师）
- **请求体**: 同创建书籍
- **响应**:
  ```json
  {
    "success": true,
    "message": "书籍更新成功",
    "data": {
        "id": 7,
        "isbn": "9787020002207",
        "title": "三国演义-新",
        "origin_title": "",
        "subtitle": "",
        "author": "罗贯中",
        "page": 500,
        "publish_date": "1990-01-01T00:00:00.000Z",
        "publisher": "人民文学出版社",
        "description": "《三国演义》是中国古典四大名著之一...",
        "douban_score": 9.5,
        "douban_id": "1234567",
        "bangumi_score": 9,
        "bangumi_id": "7654321",
        "type": "文学",
        "local_path": "/bookLocal/1749293013641-78TgDick.pdf",
        "book_icon": "/book_icon/default.png"
    }
  }
  ```

### 7. 删除书籍（需要管理员/教师权限）✅

- **URL**: `/book/:id`
- **方法**: `DELETE`
- **认证**: 需要 Bearer Token（管理员/教师）
- **响应**:
  ```json
  {
    "success": true,
    "message": "书籍删除成功"
  }
  ```

### 8. 上传书籍封面（需要管理员权限）✅

- **URL**: `/book/upload-cover/:id`
- **方法**: `POST`
- **认证**: 需要 Bearer Token（管理员）
- **请求体**: FormData 格式，字段名为 `cover`
- **响应**:
  ```json
  {
    "success": true,
    "message": "封面上传成功",
    "data": {
      "path": "/bookCover/文件名.jpg"
    }
  }
  ```

## 书评相关

### 1. 获取书评列表 ✅

- **URL**: `/journal`
- **方法**: `GET`
- **参数**:
  - `page`: 页码（默认 1）
  - `limit`: 每页数量（默认 10）
  - `bookId`: 书籍 ID（可选）
  - `userId`: 用户 ID（可选）
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "journals": [
        {
          "id": 1,
          "title": "读《三国演义》有感",
          "content": "这本书非常精彩...",
          "author_id": 1,
          "book_id": 1,
          "created_at": "2023-01-01T00:00:00.000Z",
          "author": {
            "id": 1,
            "account": "用户名"
          },
          "book": {
            "id": 1,
            "title": "三国演义"
          }
        }
      ]
    }
  }
  ```

### 2. 获取书评详情 ✅

- **URL**: `/journal/:id`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "读《三国演义》有感",
      "content": "这本书非常精彩...",
      "author_id": 1,
      "book_id": 1,
      "created_at": "2023-01-01T00:00:00.000Z",
      "likes_count": 10,
      "comments_count": 5,
      "author": {
        "id": 1,
        "account": "用户名",
        "signature": "个性签名"
      },
      "book": {
        "id": 1,
        "title": "三国演义",
        "author": "罗贯中"
      }
    }
  }
  ```

### 3. 获取书评评论 ✅

- **URL**: `/journal/:id/comments`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "content": "写得真好！",
        "author_id": 2,
        "journal_id": 1,
        "created_at": "2023-01-02T00:00:00.000Z",
        "author": {
          "id": 2,
          "account": "评论者",
          "signature": "评论者签名"
        }
      }
    ]
  }
  ```

### 4. 创建书评 ✅

- **URL**: `/journal`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "title": "读《三国演义》有感",
    "content": "这本书非常精彩...",
    "book_id": 1,
    "header_image": "/journalHeader/文件名.jpg"//注意，前端应该提供上传位置以获取这个位置的图片？
  }

  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "书评创建成功",
    "data": {
        "id": 2,
        "title": "读《三国演义》有感",
        "first_paragraph": "这本书非常精彩...",
        "content": "这本书非常精彩...",// 这个字段不需要特地在请求体中给出，如不给出自动截断作为预览部分的内容
        "book_id": 7,
        "author_id": 9,
        "publish_time": "2025-06-07T11:48:24.523Z"
    }
  }
  ```

### 5. 更新书评 ✅

- **URL**: `/journal/:id`
- **方法**: `PUT`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "title": "读《三国演义》有感（修改版）",
    "content": "这本书非常精彩，我要再补充一些内容...",
    "header_image": "/journalHeader/新文件名.jpg"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "书评更新成功",
    "data": {
      "id": 1,
      "title": "读《三国演义》有感（修改版）",
      "content": "这本书非常精彩，我要再补充一些内容..."
    }
  }
  ```

### 6. 删除书评 ✅

- **URL**: `/journal/:id`
- **方法**: `DELETE`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "message": "书评删除成功"
  }
  ```

### 7. 添加评论 ✅

- **URL**: `/journal/:id/comments`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "content": "写得真好！"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "评论添加成功",
    "data": {
        "id": 3,
        "journal_id": "2",
        "author_id": 9,
        "content": "写得真好！",
        "publish_time": "2025-06-07T11:54:25.595Z",
        "is_read": false,
        "author": {
            "id": 9,
            "account": "tea-1",
            "signature": "测试更新"
        }
    }
  }
  ```

### 8. 删除评论 ✅

- **URL**: `/journal/:id/comments/:commentId`
- **方法**: `DELETE`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "message": "评论删除成功"
  }
  ```

### 9. 点赞/取消点赞 ✅

- **URL**: `/journal/:id/like`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "message": "点赞成功",
    "data": {
      "liked": true
    }
  }
  ```

### 10. 上传书评头图 ✅

- **URL**: `/journal/upload-header/:id`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**: FormData 格式，字段名为 `header`
- **响应**:
  ```json
  {
    "success": true,
    "message": "头图上传成功",
    "data": {
      "path": "/journalHeader/文件名.jpg"
    }
  }
  ```

## 圈子相关

### 1. 获取圈子列表 ✅

- **URL**: `/group`
- **方法**: `GET`
- **参数**:
  - `page`: 页码（默认 1）
  - `limit`: 每页数量（默认 10）
  - `search`: 搜索关键词（可选）
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "groups": [
        {
          "id": 1,
          "name": "三国迷",
          "description": "讨论三国相关的书籍",
          "founder_id": 1,
          "created_at": "2023-01-01T00:00:00.000Z",
          "member_count": 15,
          "founder": {
            "id": 1,
            "account": "创建者"
          }
        }
      ]
    }
  }
  ```

### 2. 获取圈子详情 ✅

- **URL**: `/group/:id`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "三国迷",
      "description": "讨论三国相关的书籍",
      "icon": "/groupIcon/文件名.jpg",
      "founder_id": 1,
      "created_at": "2023-01-01T00:00:00.000Z",
      "member_count": 15,
      "discussion_count": 8,
      "founder": {
        "id": 1,
        "account": "创建者",
        "signature": "创建者签名"
      }
    }
  }
  ```

### 3. 获取圈子成员 ✅

- **URL**: `/group/:id/members`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "account": "用户1",
        "signature": "签名1",
        "joined_at": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### 4. 获取圈子讨论列表 ✅

- **URL**: `/group/:id/discussions`
- **方法**: `GET`
- **参数**:
  - `page`: 页码（默认 1）
  - `limit`: 每页数量（默认 10）
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "total": 20,
      "page": 1,
      "limit": 10,
      "discussions": [
        {
          "id": 1,
          "title": "讨论三国中的刘备形象",
          "content": "大家觉得三国中的刘备是什么样的人？",
          "poster_id": 1,
          "group_id": 1,
          "created_at": "2023-01-02T00:00:00.000Z",
          "reply_count": 5,
          "poster": {
            "id": 1,
            "account": "发帖人"
          }
        }
      ]
    }
  }
  ```

### 5. 获取讨论详情 ✅

- **URL**: `/group/:id/discussions/:discussionId`
- **方法**: `GET`
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "讨论三国中的刘备形象",
      "content": "大家觉得三国中的刘备是什么样的人？",
      "poster_id": 1,
      "group_id": 1,
      "created_at": "2023-01-02T00:00:00.000Z",
      "poster": {
        "id": 1,
        "account": "发帖人",
        "signature": "发帖人签名"
      },
      "replies": [
        {
          "id": 1,
          "content": "我认为刘备是个非常有野心的人",
          "author_id": 2,
          "discussion_id": 1,
          "created_at": "2023-01-02T01:00:00.000Z",
          "author": {
            "id": 2,
            "account": "回复人",
            "signature": "回复人签名"
          }
        }
      ]
    }
  }
  ```

### 6. 创建圈子 ✅

- **URL**: `/group`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "name": "三国迷",
    "description": "讨论三国相关的书籍"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "圈子创建成功",
    "data": {
      "id": 1,
      "name": "三国迷",
      "description": "讨论三国相关的书籍",
      "founder_id": 1
    }
  }
  ```

### 7. 更新圈子 ✅

- **URL**: `/group/:id`
- **方法**: `PUT`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "name": "三国爱好者",
    "description": "讨论三国相关的书籍和历史"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "圈子更新成功",
    "data": {
      "id": 1,
      "name": "三国爱好者",
      "description": "讨论三国相关的书籍和历史"
    }
  }
  ```

### 8. 删除圈子 ✅

- **URL**: `/group/:id`
- **方法**: `DELETE`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "message": "圈子删除成功"
  }
  ```

### 9. 加入圈子 ✅ ⚠️[Update] 加入圈子需要审核

- **URL**: `/group/:id/join`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "message": "成功加入圈子"
  }
  ```

### 10. 退出圈子 ✅

- **URL**: `/group/:id/leave`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "message": "成功退出圈子"
  }
  ```

### 11. 创建讨论 ✅

- **URL**: `/group/:id/discussions`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "title": "讨论三国中的刘备形象",
    "content": "大家觉得三国中的刘备是什么样的人？"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "讨论创建成功",
    "data": {
      "id": 1,
      "title": "讨论三国中的刘备形象",
      "content": "大家觉得三国中的刘备是什么样的人？",
      "poster_id": 1,
      "group_id": 1
    }
  }
  ```

### 12. 回复讨论 ✅

- **URL**: `/group/:id/discussions/:discussionId/reply`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "content": "我认为刘备是个非常有野心的人"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "回复成功",
    "data": {
      "id": 1,
      "content": "我认为刘备是个非常有野心的人",
      "author_id": 2,
      "discussion_id": 1
    }
  }
  ```

### 13. 删除讨论 ✅

- **URL**: `/group/:id/discussions/:discussionId`
- **方法**: `DELETE`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "message": "讨论删除成功"
  }
  ```

### 14. 上传圈子图标 ✅

- **URL**: `/group/upload-icon/:id`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**: FormData 格式，字段名为 `icon`
- **响应**:
  ```json
  {
    "success": true,
    "message": "图标上传成功",
    "data": {
      "path": "/groupIcon/文件名.jpg"
    }
  }
  ```

### 15. 获取圈子图标 ❌[不在开发计划！get /group/:id]

### 16. 获取待审核的加入圈子成员 🆕 ✅

- **URL**: `/group/:groupid/agree-join`
- **方法**: `get`
- **认证**: 需要 Bearer Token
- **请求体**: 无
- **响应**:
  ```json
  {
    "success": true,
    "data": [
        {
            "user_id": 10,
            "group_id": 3,
            "join_time": "2025-06-07T12:36:26.000Z",
            "state": "wait",
            "user": {
                "id": 10,
                "account": "stu-1",
                "signature": "我是学生",
                "avatar_path": "/profilePhoto/1749285931536-Eqy4gfCD.png"
            }
        }
    ]
  }
  ```

### 17. 审核新加入圈子的成员 ✅

- **URL**: `/group/:id/review/:userId/`
- **方法**: `post`
- **认证**: 需要 Bearer Token
- **请求体**: 
  ```json
  {
    "isOno": true(false)
  }
  ```
- **响应**:
  ```json
  {
      "success": true,
      "message": "isOno ? '成员审核通过' : '成员审核不通过'",
      "data": {
        "user_id": "userId",
        "state": "isOno ? 'agree' : 'refuse'"
      }
  }
  ```


## 聊天相关

### 1. 获取聊天列表 ✅

- **URL**: `/chat`
- **方法**: `GET`
- **认证**: 需要 Bearer Token
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "partner_id": 2,
        "partner_account": "聊天对象",
        "last_message": "你好！",
        "last_message_time": "2023-01-05T10:00:00.000Z",
        "unread_count": 3
      }
    ]
  }
  ```

### 2. 获取与指定用户的聊天记录 ✅

- **URL**: `/chat/:partnerId`(应该为接受者id)
- **方法**: `GET`
- **认证**: 需要 Bearer Token
- **参数**:
  - `page`: 页码（默认 1）
  - `limit`: 每页数量（默认 20）
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "partner": {
        "id": 2,
        "account": "聊天对象",
        "signature": "聊天对象签名"
      },
      "messages": [
        {
          "id": 1,
          "content": "你好！",
          "sender_id": 2,
          "receiver_id": 1,
          "created_at": "2023-01-05T10:00:00.000Z",
          "is_read": false
        }
      ]
    }
  }
  ```

### 3. 发送消息 ✅

- **URL**: `/chat`
- **方法**: `POST`
- **认证**: 需要 Bearer Token
- **请求体**:
  ```json
  {
    "receiver_id": 2,
    "content": "你好，很高兴认识你！"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "消息发送成功",
    "data": {
      "id": 2,
      "content": "你好，很高兴认识你！",
      "sender_id": 1,
      "receiver_id": 2,
      "created_at": "2023-01-05T10:05:00.000Z",
      "is_rea

## 搜索

### 综合搜索 ✅

- **URL**: `/search`
- **方法**: `get`
- **认证**: NULL
- **请求体**:
  keyword:搜索关键字
  type:搜索类型，可以是：book(书籍)、journal(书评)、user(用户)、group(圈子)；默认搜索所有类型
  page
  limit
  📢 使用参数传递：    
  `http://localhost:5001/api/search?keyword=测试&type=book&page=1&limit=10`
  适用于axios：
  ```c
  axios.get('/api/search', {
  params: {
    keyword: '测试',
    type: 'book',
    page: 1,
    limit: 10
  }
  });
  ```

- **响应**:
  ```json
  {
    "success": true,
    "data": {
        "keyword": "三国",
        "type": "book",
        "total": 1,
        "page": 1,
        "limit": 10,
        "results": [
            {
                "id": 7,
                "isbn": "9787020002207",
                "title": "三国演义-新",
                "origin_title": "",
                "subtitle": "",
                "author": "罗贯中",
                "page": 500,
                "publish_date": "1990-01-01",
                "publisher": "人民文学出版社",
                "description": "《三国演义》是中国古典四大名著之一...",
                "douban_score": 9.5,
                "douban_id": "1234567",
                "bangumi_score": 9,
                "bangumi_id": "7654321",
                "type": "文学",
                "local_path": "/bookLocal/1749293013641-78TgDick.pdf",
                "book_icon": "/bookCover/1749293471250-Bhp12fF1.png"
            }
        ]
    }
  }
  ```

## 公共路由

### AI助手

#### AI聊天

  - **URL**: `/public/chat`
  - **方法**: `post`
  - **认证**: 需要 Bearer Token
  - **请求体**:
    ```json
    {
      "prompt": "你好！！！"
    }
    ```
  - **响应**