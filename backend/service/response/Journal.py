"""书评相关API的响应处理"""
from flask import Flask, request, session, jsonify, make_response
from datetime import datetime
from service import Img
from service.database.DAO import Database
from service.File import FileManager
from service.response._Utils import _loginCheck


def journalResponse(app: Flask, file_manager: FileManager, db: Database):
    """
    书评相关的API路由
    :param app: Flask应用
    :param file_manager: 文件管理器
    :param db: 数据库
    """

    @app.route("/api/journals", methods=["GET"])
    def get_journals():
        """获取书评列表"""
        _loginCheck()
        journals = db.getJournal(limit=0)
        for journal_ in journals:
            journal_["account"] = db.getUser(id=journal_.get("author_id")).get("account")
            journal_["header_path"] = file_manager.getJournalHeaderPath(journal_["id"])
            journal_["author_profile_photo"] = file_manager.getProfilePhotoPath(journal_["author_id"])
        return jsonify({
            "status": "success",
            "data": journals
        })

    @app.route("/api/journals/<int:journal_id>", methods=["GET"])
    def get_journal(journal_id: int):
        """获取特定书评详情"""
        journal_ = db.getJournal(id=journal_id)
        if not journal_:
            return make_response(jsonify({
                "status": "error",
                "message": "Journal not found"
            }), 404)

        # 获取作者信息
        author = db.getUser(id=journal_.get("author_id"))
        author['profile_photo'] = file_manager.getProfilePhotoPath(author.get("id"))
        
        # 获取书籍信息
        book = db.getBook(id=journal_["book_id"])
        book['cover'] = file_manager.getBookCoverPath(book["id"])
        
        # 获取评论
        comments = db.getJournalComment(journal_id=journal_id)
        for comment in comments:
            comment["account"] = db.getUser(id=comment.get("author_id")).get("account")
            comment["profile_photo"] = file_manager.getProfilePhotoPath(comment["author_id"])
        
        # 标记为已读
        if session.get("login_user") and journal_['author_id'] == session.get("login_user")['id']:
            db.markJournalCommentsAsRead(journal_id)

        return jsonify({
            "status": "success",
            "data": {
                "journal": journal_,
                "author": author,
                "book": book,
                "comments": comments
            }
        })

    @app.route("/api/journals/<int:journal_id>/comments", methods=["POST"])
    def add_comment(journal_id: int):
        """添加评论"""
        _loginCheck()
        data = request.get_json()
        
        if not data or "comment" not in data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing required fields"
            }), 400)

        author_id = session.get("login_user")["id"]
        publish_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        db.addJournalComment(journal_id, data["comment"], author_id, publish_time)
        
        return jsonify({
            "status": "success",
            "data": {
                "account": session.get("login_user")["account"],
                "author_id": author_id,
                "author_profile_photo": file_manager.getProfilePhotoPath(author_id),
                "publish_time": publish_time,
                "comment": data["comment"]
            }
        })

    @app.route("/api/journals/<int:journal_id>/like", methods=["POST"])
    def toggle_like(journal_id: int):
        """切换点赞状态"""
        _loginCheck()
        author_id = session.get("login_user")["id"]
        like_num = db.getJournal(id=journal_id).get("like_num")
        
        if db.addJournalLike(journal_id, author_id):
            return jsonify({
                "status": "success",
                "data": {
                    "like_num": like_num + 1,
                    "is_liked": False
                }
            })
        else:
            return jsonify({
                "status": "success",
                "data": {
                    "like_num": like_num,
                    "is_liked": True
                }
            })

    @app.route("/api/journals", methods=["POST"])
    def create_journal():
        """创建新书评"""
        _loginCheck()
        data = request.get_json()
        
        if not data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing request body"
            }), 400)

        # 添加必要字段
        data["publish_time"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data["author_id"] = session.get("login_user")["id"]
        
        # 创建书评
        journal_id = db.addJournal(**data)
        
        # 处理封面图片（如果有）
        if "header_image" in request.files:
            journal_header = request.files["header_image"]
            target_path = file_manager.generateJournalHeaderPath(journal_id, abs_path=True)
            journal_header.save(target_path)
            Img.cropImageByScale(target_path, 5, 2)

        return jsonify({
            "status": "success",
            "data": {
                "journal_id": journal_id,
                "message": "Journal created successfully"
            }
        })
