"""认证相关API的响应处理"""
from flask import request, session, jsonify, make_response, Flask
import random
from service.database.DAO import Database
from service.File import FileManager
from service.Network import Mail


def accountResponse(app: Flask, file_manager: FileManager, db: Database, mail: Mail):
    """
    认证相关的API路由
    :param app: Flask应用
    :param file_manager: 文件管理器
    :param db: 数据库
    :param mail: 邮件服务
    """

    @app.route("/api/auth/login", methods=["POST"])
    def login():
        """用户登录"""
        data = request.get_json()
        if not data or "account" not in data or "password" not in data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing account or password"
            }), 400)

        # 验证用户名和密码
        user_id = db.checkLogin(data["account"], data["password"])
        if not user_id:
            return make_response(jsonify({
                "status": "error",
                "message": "Invalid account or password"
            }), 401)

        # 获取用户信息并设置会话
        user = db.getUser(id=user_id)
        user["profile_photo"] = file_manager.getProfilePhotoPath(user_id)
        session["login_user"] = user
        db.modifyUser(filter_id=user_id)  # 更新登录时间

        return jsonify({
            "status": "success",
            "data": {
                "user": user,
                "message": "Login successful"
            }
        })

    @app.route("/api/auth/register", methods=["POST"])
    def register():
        """用户注册"""
        data = request.get_json()
        if not data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing request body"
            }), 400)

        # 验证必要字段
        required_fields = ["account", "password", "email"]
        for field in required_fields:
            if field not in data:
                return make_response(jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400)

        # 检查用户名是否已存在
        if db.getUser(account=data["account"]):
            return make_response(jsonify({
                "status": "error",
                "message": "Account already exists"
            }), 409)

        # 创建新用户
        user_id = db.addUser(
            account=data["account"],
            raw_password=data["password"],
            email=data["email"],
            telephone=data.get("telephone")
        )

        return jsonify({
            "status": "success",
            "data": {
                "user_id": user_id,
                "message": "Registration successful"
            }
        })

    @app.route("/api/auth/captcha", methods=["POST"])
    def send_captcha():
        """发送验证码"""
        data = request.get_json()
        if not data or "account" not in data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing account"
            }), 400)

        user = db.getUser(account=data["account"])
        if not user:
            return make_response(jsonify({
                "status": "error",
                "message": "Account not found"
            }), 404)

        # 生成并发送验证码
        captcha = str(random.randint(100000, 999999))
        try:
            mail.sendCaptcha(user["email"], captcha)
        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"Failed to send captcha: {str(e)}"
            }), 500)

        # 保存验证码到会话
        session["captcha"] = captcha
        session["resetPasswdAccount"] = data["account"]

        return jsonify({
            "status": "success",
            "data": {
                "message": "Captcha sent successfully"
            }
        })

    @app.route("/api/auth/reset-password", methods=["POST"])
    def reset_password():
        """重置密码"""
        data = request.get_json()
        if not data or "captcha" not in data or "password" not in data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing captcha or new password"
            }), 400)

        # 验证验证码
        if data["captcha"] != session.get("captcha"):
            return make_response(jsonify({
                "status": "error",
                "message": "Invalid captcha"
            }), 400)

        # 重置密码
        account = session.get("resetPasswdAccount")
        if not account:
            return make_response(jsonify({
                "status": "error",
                "message": "Reset password session expired"
            }), 400)

        db.modifyUser(filter_account=account, password=data["password"])

        # 清除会话中的验证码相关信息
        session.pop("captcha", None)
        session.pop("resetPasswdAccount", None)

        return jsonify({
            "status": "success",
            "data": {
                "message": "Password reset successful"
            }
        })

    @app.route("/api/auth/logout", methods=["POST"])
    def logout():
        """退出登录"""
        if not session.get("login_user"):
            return make_response(jsonify({
                "status": "error",
                "message": "Not logged in"
            }), 401)

        # 清除会话
        session.clear()

        return jsonify({
            "status": "success",
            "data": {
                "message": "Logged out successfully"
            }
        })
