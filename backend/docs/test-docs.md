> 测试文档，记录了API测试过程

# By HeLong

以下是完整的 API 文档，用于 Postman 测试：

说明：

    ✅测试完成的API端点

    ⚠️待测试/未经测试/开发中的API端点

    ❌错误/未修复的API端点

# MoYun API 文档

## 基本信息

- **基础 URL**: `http://localhost:{port}/api`
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
    "account": "tea-1",// New：注意，这部分也可以填写邮箱
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

### 3. 请求重置密码✅

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

### 4. 重置密码✅

- **URL**: `/account/reset-password`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "email": "helong_001@qq.com",
    "code": "975437",//验证码
    "newPassword":"newpassdwd" //新的密码
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
        "role": "teacher",
        "avatar_path": ""//需要拼接
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

### AI助手__测试功能

#### AI聊天✅

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
    ```json
    {
      "success": true,
      "data": {
          "response": "\n\n你好！很高兴见到你！有什么我可以帮忙的吗？"
      }
    }
    ```

#### 书籍推荐 ✅

  - **URL**: `/public/recommend-books`
  - **方法**: `post`
  - **认证**: 需要 Bearer Token
  - **请求体**:
    ```json
    {
      "preferences": "偏好", 
      "genres": "类型", 
      "exclude": "排除书籍"
    }
    ```
  - **响应**
    ```json
    {
      "success": true,
      "data": {
          "recommendations": "\n\n当然可以！以下是一些经典的与历史相关的书籍推荐：\n\n1. **《伤寒论》（The Ten Commentaries） - Hippocrates**  \n   推荐理由：这是一部古老的医学著作，同时也是西方最早的传染病论著。 Hippocrates 是西方医学史上第一位伟大的医生，他的著作体现了对疾病本质的深刻理解。\n\n2. **《办事》（Liber Magniorum） - Galeno**  \n   推荐理由：这是 Galen 对人体生理和解剖学的系统总结，奠定了中世纪医学的基础。 Galen 的科学精神和方法论至今仍被广泛尊重。\n\n3. **《苏格拉底传》（The Apology） - Plato**  \n   推荐理由：这是柏拉图撰写的第一部对话体著作，以苏格拉底的 Herb淮南人哲学思想为核心。 这本书展现了柏拉图对西方哲学的深远影响。\n\n4. **《历史会车》（Les Antiquaires du foremost） - Hilaire Belloc**  \n   推荐理由：这本书通过.url/分享历史书籍的对比分析，展示了东西方文明的发展和差异，具有独特的视角和见解。\n\n5. **《资本与现存的精神》（Capital and现存的精神） - Karl Marx**  \n   推荐理由：马克思的《资本论》是经济学和政治经济学的经典之作，深刻分析了资本主义的内在矛盾和发展的必然规律。\n\n希望这些推荐能让你对历史书籍有更多的了解和兴趣！"
      }
    }
    ```

### 其他-获取公开数据
  推荐书评;热门书籍;活跃圈子;今日诗词
  - **URL**: `/public/data`
  - **方法**: `get`
  - **认证**: 需要 Bearer Token
  - **请求体**:
  - **响应**
    ```json
    {
    "success": true,
    "data": {
        "featuredJournals": [
            {
                "id": 2,
                "title": "读《三国演义》有感aaaaa",
                "first_paragraph": "这本书非常精彩...",
                "content": "这本书非常精彩aaaa...",
                "publish_time": "2025-06-07T11:48:24.000Z",
                "author_id": 9,
                "book_id": 7,
                "header": "/journalHeader/1749297863087-nBCv3RKm.png",
                "author": {
                    "id": 9,
                    "account": "tea-1",
                    "signature": "测试更新"
                },
                "book": {
                    "id": 7,
                    "title": "三国演义-新",
                    "author": "罗贯中",
                    "publisher": "人民文学出版社"
                }
            }
        ],
        "popularBooks": [
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
            },
            {
                "id": 3,
                "isbn": "9787801656087",
                "title": "明朝那些事儿（1-9）",
                "origin_title": null,
                "subtitle": "限量版",
                "author": "当年明月",
                "page": null,
                "publish_date": "2009-04-01",
                "publisher": "中国海关出版社",
                "description": "《明朝那些事儿》讲述从1344年到1644年，明朝三百年间的历史。作品以史料为基础，以年代和具体人物为主线，运用小说的笔法，对明朝十七帝和其他王公权贵和小人物的命运进行全景展示，尤其对官场政治、战争、帝王心术着墨最多。作品也是一部明朝政治经济制度、人伦道德的演义。",
                "douban_score": 9.2,
                "douban_id": "3674537",
                "bangumi_score": null,
                "bangumi_id": null,
                "type": "历史、地理",
                "local_path": "",
                "book_icon": "/bookCover/default.png"
            },
            {
                "id": 1,
                "isbn": "9787508696010",
                "title": "老人与海",
                "origin_title": "The Old Man and the Sea",
                "subtitle": null,
                "author": "[美] 欧内斯特·海明威",
                "page": 264,
                "publish_date": "2018-11-01",
                "publisher": "中信出版社",
                "description": "“人可以被毁灭，但不能被打败。”一位老人孤身在海上捕鱼，八十四天一无所获，等终于钓到大鱼，用了两天两夜才将其刺死。返航途中突遭鲨鱼袭击，经过一天一夜的缠斗，大鱼仅存骨架。但老人并未失去希望和信心，休整之后，准备再次出海……\r\n编辑推荐\r\n◆ 海明威等了64年的中文译本终于来了！华语传奇作家鲁羊首次翻译外国经典，译稿出版前在各界名人中广泛流传，好评如潮，口碑爆棚。\r\n◆ 《老人与海》有声演读版音频，李蕾姐姐读经典演绎，用声音为你复活《老人与海》。\r\n◆ 附英文原版，校自海明威1952年亲自授权的美国Scribner原版定本！中英双语，超值典藏。\r\n◆ 国际当红女插画师SlavaShults，首次为中文版《老人与海》专门创作12副海报级手绘插图，带给你前所未有的阅读体验；随书附赠精1张精美明信片（一套10张随机送）。\r\n◆ “所有的原则自天而降：那就是你必须相信魔法，相信美，相信那些在百万个钻石中总结我们的人，相信此刻你手捧的鲁羊先生的译本，就是‘不朽’这个璀璨的词语给出的最好佐证。”——丁玲文学大奖、徐志摩诗歌金奖双奖得主何三坡\r\n◆“鲁羊的译文，其语言的简洁、节奏、语感、画面感和情感浓与淡的交错堪称完美，我感觉是海明威用中文写了《老人与海》，真棒！”——美籍华人知名学者、博士后导师邢若曦\r\n◆ 自1954年荣获诺贝尔文学奖至今，《老人与海》风靡全球，横扫每个必读经典书单，征服了亿万读者；据作家榜官方统计：截至2017年1月，113位诺贝尔文学奖得主作品中文版销量排行榜，海明威高居榜首，总销量突破550万册。\r\n◆ “人可以被毁灭，但不能被打败。”——本书作者海明威（诺贝尔文学奖、普利策奖双奖得主）",
                "douban_score": 9,
                "douban_id": "30338134",
                "bangumi_score": 8.3,
                "bangumi_id": "156705",
                "type": "文学",
                "local_path": "",
                "book_icon": "/bookCover/default.png"
            },
            {
                "id": 6,
                "isbn": "9787533936020",
                "title": "月亮与六便士",
                "origin_title": "The Moon and Sixpence",
                "subtitle": null,
                "author": "[英] 威廉·萨默塞特·毛姆",
                "page": 304,
                "publish_date": "2017-01-01",
                "publisher": "浙江文艺出版社",
                "description": "“满地都是六便士，他却抬头看见了月亮。”\r\n银行家查尔斯，人到中年，事业有成，为了追求内心隐秘的绘画梦想，突然抛妻别子，弃家出走。他深知：人的每一种身份都是一种自我绑架，唯有失去是通向自由之途。\r\n在异国他乡，他贫病交加，对梦想却愈发坚定执着。他说：我必须画画，就像溺水的人必须挣扎。\r\n在经历种种离奇遭遇后，他来到南太平洋的一座孤岛，同当地一位姑娘结婚生子，成功创作出一系列惊世杰作。就在此时，他被绝症和双目失明击倒，临死之前，他做出了让所有人震惊的决定……\r\n人世漫长得转瞬即逝，有人见尘埃，有人见星辰。查尔斯就是那个终其一生在追逐星辰的人。",
                "douban_score": 8.7,
                "douban_id": "26954760",
                "bangumi_score": null,
                "bangumi_id": null,
                "type": "文学",
                "local_path": "",
                "book_icon": "/bookCover/default.png"
            },
            {
                "id": 5,
                "isbn": "9787532776771",
                "title": "挪威的森林",
                "origin_title": "ノルウェイの森",
                "subtitle": null,
                "author": "[日] 村上春树",
                "page": 380,
                "publish_date": "2018-03-01",
                "publisher": "上海译文出版社",
                "description": "《挪威的森林》是日本作家村上春树所著的一部长篇爱情小说，影响了几代读者的青春名作。故事讲述主角渡边纠缠在情绪不稳定且患有精神疾病的直子和开朗活泼的小林绿子之间，苦闷彷徨，最终展开了自我救赎和成长的旅程。彻头彻尾的现实笔法，描绘了逝去的青春风景，小说中弥散着特有的感伤和孤独气氛。自1987年在日本问世后，该小说在年轻人中引起共鸣，风靡不息。上海译文出版社于2018年2月，推出该书的全新纪念版。",
                "douban_score": 8.5,
                "douban_id": "27200257",
                "bangumi_score": 8,
                "bangumi_id": "920",
                "type": "文学",
                "local_path": "",
                "book_icon": "/bookCover/default.png"
            },
            {
                "id": 2,
                "isbn": "9787535447340",
                "title": "文化苦旅",
                "origin_title": null,
                "subtitle": "余秋雨三十年散文自选集",
                "author": "余秋雨",
                "page": 287,
                "publish_date": "2014-04-01",
                "publisher": "长江文艺出版社",
                "description": "《文化苦旅》一书于1992年首次出版，是余秋雨先生1980年代在海内外讲学和考察途中写下的作品，是他的第一部文化散文集。全书主要包括两部分，一部分为历史、文化散文，另一部分为回忆散文。甫一面世，该书就以文采飞扬、知识丰厚、见解独到而备受万千读者喜爱。由此开创“历史大散文”一代文风，令世人重拾中华文化价值。他的散文别具一格，见常人所未见，思常人所未思，善于在美妙的文字中一步步将读者带入历史文化长河，启迪哲思，引发情致，具有极高的审美价值和史学、文化价值。书中多篇文章后入选中学教材。但由于此书的重大影响，在为余秋雨先生带来无数光环和拥趸的同时，也带来了数之不尽的麻烦和盗版。誉满天下，“谤”亦随身。余秋雨先生在身心俱疲之下，决定亲自修订、重编此书。\r\n新版《文化苦旅》作为余秋雨先生30年历史文化散文修订自选集，删掉旧版37篇文章中的13篇，新增文章17篇，其中入选教材的《道士塔》《莫高窟》《都江堰》等经典篇目全部经过改写、修订。新版内容与旧版相比，全新和改写的篇目达到三分之二以上，对新老读者都是一场全新的阅读体验和人文享受。堪称余秋雨30年来不懈的文化考察和人生思索的完美结晶。",
                "douban_score": 8.2,
                "douban_id": "19940743",
                "bangumi_score": null,
                "bangumi_id": null,
                "type": "文学",
                "local_path": "",
                "book_icon": "/bookCover/default.png"
            }
        ],
        "activeGroups": [
            {
                "id": 3,
                "name": "三国爱好者",
                "founder_id": 9,
                "establish_time": "2025-06-07T12:12:08.000Z",
                "description": "讨论三国相关的书籍和历史",
                "group_icon": "/groupIcon/1749298794180-HC2zJRqK.png",
                "founder": {
                    "id": 9,
                    "account": "tea-1",
                    "signature": "测试更新"
                }
            }
        ],
        "poem": {
            "id": "5b8b9572e116fb3714e72ed6",
            "content": "好段东风，好轮明月，尽教封侯误。",
            "popularity": 5190000,
            "origin": {
                "title": "青玉案·丝丝香篆浓于雾",
                "dynasty": "清代",
                "author": "高鹗",
                "content": [
                    "丝丝香篆浓于雾，织就绿阴红雨。乳燕飞来傍莲幕，杨花欲雪，梨云如梦，又是清明暮。",
                    "屏山遮断相思路，子规啼到无声处。鳞瞑羽迷谁与诉。好段东风，好轮明月，尽教封侯误。"
                ],
                "translate": null
            },
            "matchTags": [
                "东风",
                "晚上",
                "风"
            ],
            "recommendedReason": "",
            "cacheAt": "2025-06-09T20:56:01.813487352"
        },
        "weather": null
    }
  }
    ```
