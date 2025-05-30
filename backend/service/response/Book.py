"""书籍相关API的响应处理"""
from flask import Flask, request, session, jsonify, make_response
from service.database.DAO import Database
from service.File import FileManager
from service.response._Utils import _loginCheck


def bookResponse(app: Flask, file_manager: FileManager, db: Database):
    """
    书籍相关的API路由
    :param app: Flask app
    :param file_manager: 文件管理器对象，用于获取图片路径
    :param db: 数据库对象，用于获取书籍信息
    """

    @app.route("/api/books", methods=["GET"])
    def get_books():
        """获取书籍列表"""
        _loginCheck()
        books = db.getBook(limit=0)
        for book_ in books:
            book_["book_cover"] = file_manager.getBookCoverPath(book_["id"])
        return jsonify({
            "status": "success",
            "data": books
        })

    @app.route("/api/books/<int:book_id>", methods=["GET"])
    def get_book(book_id: int):
        """获取书籍详情"""
        _loginCheck()
        book_ = db.getBook(id=book_id)
        if not book_:
            return make_response(jsonify({
                "status": "error",
                "message": "Book not found"
            }), 404)

        book_["book_cover"] = file_manager.getBookCoverPath(book_id)
        return jsonify({
            "status": "success",
            "data": book_
        })

    @app.route("/api/books", methods=["POST"])
    def create_book():
        """创建新书籍"""
        _loginCheck()
        
        # 权限检查
        if session.get("login_user").get("role") not in ["admin", "teacher"]:
            return make_response(jsonify({
                "status": "error",
                "message": "Permission denied"
            }), 403)

        data = request.form.to_dict()
        if not data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing book information"
            }), 400)

        # 创建书籍记录
        book_id = db.addBook(**data)
        if not book_id:
            return make_response(jsonify({
                "status": "error",
                "message": "Failed to create book, please check if the book already exists"
            }), 400)

        # 处理封面图片
        if "book_cover" in request.files:
            book_cover = request.files["book_cover"]
            target_path = file_manager.generateBookCoverPath(book_id, abs_path=True)
            book_cover.save(target_path)

        return jsonify({
            "status": "success",
            "data": {
                "book_id": book_id,
                "message": "Book created successfully"
            }
        })

    @app.route("/api/books/<int:book_id>", methods=["PUT"])
    def update_book(book_id: int):
        """更新书籍信息"""
        _loginCheck()
        
        # 权限检查
        if session.get("login_user").get("role") not in ["admin", "teacher"]:
            return make_response(jsonify({
                "status": "error",
                "message": "Permission denied"
            }), 403)

        # 检查书籍是否存在
        book_ = db.getBook(id=book_id)
        if not book_:
            return make_response(jsonify({
                "status": "error",
                "message": "Book not found"
            }), 404)

        # 更新书籍信息
        data = request.get_json()
        if not data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing book information"
            }), 400)

        if db.modifyBook(book_id, **data):
            return jsonify({
                "status": "success",
                "data": {
                    "message": "Book updated successfully"
                }
            })
        else:
            return make_response(jsonify({
                "status": "error",
                "message": "Failed to update book"
            }), 500)
