"""用户资料相关API的响应处理"""
from flask import session, request, jsonify, make_response, Flask
from service import Img
from service.File import FileManager
from service.database.DAO import Database
from service.response._Utils import _loginCheck


def profileResponse(app: Flask, file_manager: FileManager, db: Database):
    """
    用户资料相关的API路由
    :param app: Flask应用
    :param file_manager: 文件管理器
    :param db: 数据库
    """

    @app.route("/api/users/me", methods=["GET"])
    def get_current_user():
        """获取当前登录用户信息"""
        _loginCheck()
        user_id = session.get("login_user")["id"]
        
        return jsonify({
            "status": "success",
            "data": {
                "user": session.get("login_user"),
                "profile_photo": file_manager.getProfilePhotoPath(user_id)
            }
        })

    @app.route("/api/users/<int:user_id>", methods=["GET"])
    def get_user(user_id: int):
        """获取指定用户的信息"""
        _loginCheck()
        
        user = db.getUser(id=user_id)
        if not user:
            return make_response(jsonify({
                "status": "error",
                "message": "User not found"
            }), 404)

        # 获取用户书评
        journals = db.getJournal(limit=0, author_id=user_id)
        for journal in journals:
            journal["header_path"] = file_manager.getJournalHeaderPath(journal["id"])

        return jsonify({
            "status": "success",
            "data": {
                "user": user,
                "profile_photo": file_manager.getProfilePhotoPath(user_id),
                "journals": journals
            }
        })

    @app.route("/api/users/me", methods=["PUT"])
    def update_profile():
        """更新当前用户的资料"""
        _loginCheck()
        user_id = session.get("login_user")["id"]

        # 处理基本信息
        data = request.form.to_dict()
        required_fields = ["account", "email"]
        for field in required_fields:
            if field not in data:
                return make_response(jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400)

        try:
            # 更新用户信息
            db.modifyUser(
                filter_id=user_id,
                account=data["account"],
                signature=data.get("signature"),
                email=data["email"],
                telephone=data.get("telephone")
            )

            # 处理头像
            if "profile_photo" in request.files:
                profile_photo = request.files["profile_photo"]
                photo_path = file_manager.getProfilePhotoPath(user_id, abs_path=True, enable_default=False)
                
                if not photo_path:  # 之前使用默认头像
                    photo_path = file_manager.generateProfilePhotoPath(user_id, abs_path=True)
                else:
                    file_manager.deleteProfilePhoto(user_id)  # 删除原有头像
                
                profile_photo.save(photo_path)
                Img.cropImageSquare(photo_path)  # 裁剪为正方形

            # 更新会话中的用户信息
            updated_user = db.getUser(id=user_id)
            session["login_user"] = updated_user
            session["login_user"]["profile_photo"] = file_manager.getProfilePhotoPath(user_id)

            return jsonify({
                "status": "success",
                "data": {
                    "user": updated_user,
                    "profile_photo": file_manager.getProfilePhotoPath(user_id),
                    "message": "Profile updated successfully"
                }
            })

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"Failed to update profile: {str(e)}"
            }), 500)
