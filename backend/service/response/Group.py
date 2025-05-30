"""圈子相关API的响应处理"""
from datetime import datetime
from flask import Flask, session, request, jsonify, make_response
from service import Img
from service.database.DAO import Database
from service.File import FileManager
from service.response._Utils import _loginCheck


def groupResponse(app: Flask, file_manager: FileManager, db: Database) -> None:
    """
    圈子相关的API路由
    :param app: Flask app
    :param file_manager: 文件管理器对象，用于获取图片路径
    :param db: 数据库对象，用于获取圈子信息
    """

    @app.route("/api/groups", methods=["GET"])
    def get_groups():
        """获取圈子列表"""
        _loginCheck()
        groups = db.getGroup(limit=0)
        for group_ in groups:
            group_["group_icon"] = file_manager.getGroupIconPath(group_["id"])
            group_["user_num"] = db.getGroupUsersNum(group_["id"])
            group_["discussion_num"] = db.getGroupDiscussionNum(group_id=group_["id"])
        
        return jsonify({
            "status": "success",
            "data": groups
        })

    @app.route("/api/groups/<int:group_id>", methods=["GET"])
    def get_group(group_id: int):
        """获取圈子详情"""
        _loginCheck()
        group_ = db.getGroup(id=group_id)
        if not group_:
            return make_response(jsonify({
                "status": "error",
                "message": "Group not found"
            }), 404)

        # 获取圈子详细信息
        group_["account"] = db.getUser(id=group_.get("founder_id")).get("account")
        group_["group_icon"] = file_manager.getGroupIconPath(group_id)
        
        # 标记创建者的讨论为已读
        if session.get("login_user")["id"] == group_["founder_id"]:
            db.markGroupDiscussionsAsRead(group_id)

        # 获取讨论列表
        discussions = db.getGroupDiscussion(limit=0, group_id=group_id)
        for discussion_ in discussions:
            discussion_["account"] = db.getUser(id=discussion_.get("poster_id")).get("account")
            discussion_["reply_num"] = db.getGroupDiscussionReplyNum(discussion_id=discussion_["id"])

        # 获取成员列表
        members = db.getGroupUser(limit=0, group_id=group_id)
        for member in members:
            member["account"] = db.getUser(id=member.get("user_id")).get("account")
            member["profile_photo"] = file_manager.getProfilePhotoPath(member["user_id"])

        # 获取回复列表
        replies = db.getGroupReply(group_id)
        for reply in replies:
            reply["account"] = db.getUser(id=reply.get("author_id")).get("account")
            reply["profile_photo"] = file_manager.getProfilePhotoPath(reply["author_id"])

        return jsonify({
            "status": "success",
            "data": {
                "group": group_,
                "members": members,
                "discussions": discussions,
                "replies": replies
            }
        })

    @app.route("/api/groups", methods=["POST"])
    def create_group():
        """创建新圈子"""
        _loginCheck()
        
        # 验证必要字段
        if not request.form.get("name") or not request.form.get("description"):
            return make_response(jsonify({
                "status": "error",
                "message": "Missing required fields"
            }), 400)

        # 创建圈子
        group_id = db.addGroup(
            request.form.get("name"),
            request.form.get("description"),
            session.get("login_user")["id"],
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

        # 处理圈子图标
        if "group_icon" in request.files:
            group_icon = request.files["group_icon"]
            target_path = file_manager.generateGroupIconPath(group_id, abs_path=True)
            group_icon.save(target_path)
            Img.cropImageSquare(target_path)

        return jsonify({
            "status": "success",
            "data": {
                "group_id": group_id,
                "message": "Group created successfully"
            }
        })

    @app.route("/api/groups/<int:group_id>", methods=["PUT"])
    def update_group(group_id: int):
        """更新圈子信息"""
        _loginCheck()
        
        # 检查圈子是否存在
        group_ = db.getGroup(id=group_id)
        if not group_:
            return make_response(jsonify({
                "status": "error",
                "message": "Group not found"
            }), 404)

        # 检查权限
        if session.get("login_user").get("id") != group_["founder_id"]:
            return make_response(jsonify({
                "status": "error",
                "message": "Permission denied"
            }), 403)

        # 更新圈子信息
        data = request.form.to_dict()
        success = db.modifyGroup(
            group_id,
            name=data.get("name"),
            description=data.get("description")
        )

        if not success:
            return make_response(jsonify({
                "status": "error",
                "message": "Failed to update group"
            }), 500)

        # 处理新的图标
        if "group_icon" in request.files:
            icon = request.files["group_icon"]
            target_path = file_manager.generateGroupIconPath(group_id, abs_path=True)
            file_manager.deleteGroupIcon(group_id)
            icon.save(target_path)
            Img.cropImageSquare(target_path)

        return jsonify({
            "status": "success",
            "data": {
                "message": "Group updated successfully"
            }
        })

    @app.route("/api/groups/<int:group_id>/discussions", methods=["GET"])
    def get_group_discussions(group_id: int):
        """获取圈子的讨论列表"""
        _loginCheck()
        
        discussions = db.getGroupDiscussion(limit=0, group_id=group_id)
        for discussion_ in discussions:
            discussion_["account"] = db.getUser(id=discussion_.get("poster_id")).get("account")
            discussion_["reply_num"] = db.getGroupDiscussionReplyNum(discussion_id=discussion_["id"])
        
        return jsonify({
            "status": "success",
            "data": discussions
        })

    @app.route("/api/discussions/<int:discussion_id>", methods=["GET"])
    def get_discussion(discussion_id: int):
        """获取讨论详情"""
        _loginCheck()
        
        discussion_ = db.getGroupDiscussion(id=discussion_id)
        if not discussion_:
            return make_response(jsonify({
                "status": "error",
                "message": "Discussion not found"
            }), 404)

        # 获取作者信息
        author = db.getUser(id=discussion_.get("poster_id"))
        author["profile_photo"] = file_manager.getProfilePhotoPath(author.get("id"))

        # 获取回复列表
        replies = db.getGroupDiscussionReplies(limit=0, discussion_id=discussion_id)
        for reply in replies:
            reply["account"] = db.getUser(id=reply.get("author_id")).get("account")
            reply["profile_photo"] = file_manager.getProfilePhotoPath(reply.get("author_id"))

        # 标记已读（如果是作者查看）
        if session.get("login_user")["id"] == discussion_["poster_id"]:
            db.markDiscussionRepliesAsRead(discussion_id)

        return jsonify({
            "status": "success",
            "data": {
                "discussion": discussion_,
                "author": author,
                "replies": replies
            }
        })

    @app.route("/api/groups/<int:group_id>/discussions", methods=["POST"])
    def create_discussion(group_id: int):
        """创建新讨论"""
        _loginCheck()
        
        data = request.get_json()
        if not data or not data.get("title") or not data.get("content"):
            return make_response(jsonify({
                "status": "error",
                "message": "Missing title or content"
            }), 400)

        discussion_id = db.addGroupDiscussion(
            poster_id=session.get("login_user")["id"],
            group_id=group_id,
            post_time=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            title=data["title"],
            content=data["content"]
        )

        return jsonify({
            "status": "success",
            "data": {
                "discussion_id": discussion_id,
                "message": "Discussion created successfully"
            }
        })

    @app.route("/api/discussions/<int:discussion_id>/replies", methods=["POST"])
    def add_reply(discussion_id: int):
        """添加回复"""
        _loginCheck()
        
        data = request.get_json()
        if not data or not data.get("content"):
            return make_response(jsonify({
                "status": "error",
                "message": "Missing reply content"
            }), 400)

        # 添加回复
        reply_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        user_id = session.get("login_user")["id"]
        db.addGroupDiscussionReply(user_id, discussion_id, data["content"], reply_time)

        return jsonify({
            "status": "success",
            "data": {
                "account": session.get("login_user")["account"],
                "author_id": user_id,
                "author_profile_photo": file_manager.getProfilePhotoPath(user_id),
                "reply_time": reply_time,
                "content": data["content"]
            }
        })

    @app.route("/api/groups/<int:group_id>/members/<int:user_id>", methods=["DELETE"])
    def remove_member(group_id: int, user_id: int):
        """移除圈子成员"""
        _loginCheck()
        
        # 检查权限
        group_ = db.getGroup(id=group_id)
        if not group_ or session.get("login_user").get("id") != group_["founder_id"]:
            return make_response(jsonify({
                "status": "error",
                "message": "Permission denied"
            }), 403)

        if db.deleteGroupUser(group_id, user_id):
            return jsonify({
                "status": "success",
                "data": {
                    "message": "Member removed successfully"
                }
            })
        else:
            return make_response(jsonify({
                "status": "error",
                "message": "Failed to remove member"
            }), 500)

    @app.route("/api/discussions/<int:discussion_id>", methods=["DELETE"])
    def delete_discussion(discussion_id: int):
        """删除讨论"""
        _loginCheck()
        
        # 检查权限（应该在删除前检查是否是圈子创建者）
        discussion_ = db.getGroupDiscussion(id=discussion_id)
        if not discussion_:
            return make_response(jsonify({
                "status": "error",
                "message": "Discussion not found"
            }), 404)

        group_ = db.getGroup(id=discussion_["group_id"])
        if session.get("login_user").get("id") != group_["founder_id"]:
            return make_response(jsonify({
                "status": "error",
                "message": "Permission denied"
            }), 403)

        if db.deleteGroupDiscussion(discussion_id):
            return jsonify({
                "status": "success",
                "data": {
                    "message": "Discussion deleted successfully"
                }
            })
        else:
            return make_response(jsonify({
                "status": "error",
                "message": "Failed to delete discussion"
            }), 500)
