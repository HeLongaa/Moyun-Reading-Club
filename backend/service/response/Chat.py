"""聊天相关API的响应处理"""
from datetime import datetime
from flask import Flask, session, request, jsonify, make_response
from service.database.DAO import Database
from service.File import FileManager
from service.response._Utils import _loginCheck


def chatResponse(app: Flask, file_manager: FileManager, db: Database):
    """
    聊天相关的API路由
    :param app: Flask对象，用于添加路由
    :param file_manager: FileManager类对象，用于获取文件路径
    :param db: Database类对象，用于数据库操作
    """

    @app.route('/api/chats/<int:user_id>', methods=['GET'])
    def get_chat_history(user_id: int):
        """获取与指定用户的聊天历史"""
        _loginCheck()
        current_user_id = session.get("login_user").get("id")

        # 不能查看与自己的聊天记录
        if current_user_id == user_id:
            return make_response(jsonify({
                "status": "error",
                "message": "Cannot chat with yourself"
            }), 400)

        # 检查目标用户是否存在
        user = db.getUser(id=user_id)
        if not user:
            return make_response(jsonify({
                "status": "error",
                "message": "User not found"
            }), 404)

        # 获取用户信息和聊天记录
        user['profile_photo'] = file_manager.getProfilePhotoPath(user_id)
        user['last_time'] = db.getChatLastTime(user_id, current_user_id, True)
        chats = db.getChat(sender_id=user_id, receiver_id=current_user_id, each=True)

        # 标记消息为已读
        db.markChatsAsRead(current_user_id, user_id)

        return jsonify({
            "status": "success",
            "data": {
                "user": user,
                "messages": chats
            }
        })

    @app.route('/api/chats/<int:receiver_id>/messages', methods=['POST'])
    def send_message(receiver_id: int):
        """发送消息给指定用户"""
        _loginCheck()
        current_user_id = session.get("login_user").get("id")

        # 不能给自己发送消息
        if current_user_id == receiver_id:
            return make_response(jsonify({
                "status": "error",
                "message": "Cannot send message to yourself"
            }), 400)

        # 检查接收者是否存在
        receiver = db.getUser(id=receiver_id)
        if not receiver:
            return make_response(jsonify({
                "status": "error",
                "message": "Receiver not found"
            }), 404)

        # 验证消息内容
        data = request.get_json()
        if not data or "content" not in data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing message content"
            }), 400)

        # 发送消息
        send_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        success = db.addChat(
            sender_id=current_user_id,
            receiver_id=receiver_id,
            send_time=send_time,
            content=data["content"]
        )

        if not success:
            return make_response(jsonify({
                "status": "error",
                "message": "Failed to send message"
            }), 500)

        return jsonify({
            "status": "success",
            "data": {
                "content": data["content"],
                "send_time": send_time,
                "sender_id": current_user_id,
                "receiver_id": receiver_id,
                "profile_photo": file_manager.getProfilePhotoPath(current_user_id)
            }
        })
