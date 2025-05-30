"""消息中心相关API的响应处理"""
from flask import Flask, session, request, jsonify, make_response
from service.database.DAO import Database
from service.database.Utils import UnreadMessagesDict
from service.File import FileManager
from service.response._Utils import _loginCheck


def messageResponse(app: Flask, file_manager: FileManager, db: Database):
    """
    消息中心相关的API路由
    :param app: Flask应用
    :param file_manager: 文件管理器
    :param db: 数据库
    """

    @app.route("/api/messages", methods=["GET"])
    def get_all_messages():
        """获取所有类型的未读消息"""
        _loginCheck()
        user_id = session.get("login_user").get("id")

        try:
            # 获取全部未读消息
            messages: UnreadMessagesDict = db.getAllUnreadMessage(user_id=user_id)
            
            # 处理书评评论消息
            journals = process_journal_messages(db, file_manager, messages.get('journal_comments', []))
            
            # 处理圈子讨论消息
            groups = process_group_messages(db, file_manager, messages.get('group_discussions', []))
            
            # 处理讨论回复消息
            discussions = process_discussion_messages(db, file_manager, messages.get('discussion_replies', []))
            
            # 处理私信消息
            senders = process_chat_messages(db, file_manager, messages.get('chats', []), user_id)

            return jsonify({
                "status": "success",
                "data": {
                    "journal_messages": {
                        "journals": journals,
                        "comments": messages.get('journal_comments', [])
                    },
                    "group_messages": {
                        "groups": groups,
                        "discussions": messages.get('group_discussions', [])
                    },
                    "discussion_messages": {
                        "discussions": discussions,
                        "replies": messages.get('discussion_replies', [])
                    },
                    "chat_messages": {
                        "senders": senders,
                        "chats": messages.get('chats', [])
                    }
                }
            })

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"Failed to fetch messages: {str(e)}"
            }), 500)

    @app.route("/api/messages/mark-read", methods=["POST"])
    def mark_messages_read():
        """标记消息为已读"""
        _loginCheck()
        user_id = session.get("login_user").get("id")

        data = request.get_json()
        if not data or "type" not in data or "id" not in data:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing message type or ID"
            }), 400)

        try:
            msg_type = data["type"]
            msg_id = data["id"]
            status = False

            # 验证权限并标记已读
            if msg_type == "journal":
                journal = db.getJournal(id=msg_id)
                if user_id == journal.get("author_id"):
                    status = db.markJournalCommentsAsRead(msg_id)
            
            elif msg_type == "group":
                group = db.getGroup(id=msg_id)
                if user_id == group.get("founder_id"):
                    status = db.markGroupDiscussionsAsRead(msg_id)
            
            elif msg_type == "discussion":
                discussion = db.getGroupDiscussion(id=msg_id)
                if user_id == discussion.get("poster_id"):
                    status = db.markDiscussionRepliesAsRead(msg_id)
            
            elif msg_type == "chat":
                status = db.markChatsAsRead(user_id, msg_id)
            
            else:
                return make_response(jsonify({
                    "status": "error",
                    "message": "Invalid message type"
                }), 400)

            if status:
                return jsonify({
                    "status": "success",
                    "data": {
                        "message": "Messages marked as read"
                    }
                })
            else:
                return make_response(jsonify({
                    "status": "error",
                    "message": "Failed to mark messages as read"
                }), 500)

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"Error marking messages as read: {str(e)}"
            }), 500)


def process_journal_messages(db: Database, file_manager: FileManager, comments: list) -> list:
    """处理书评相关的消息"""
    journal_ids = list(set(comment.get('journal_id') for comment in comments))
    journals = [db.getJournal(id=journal_id) for journal_id in journal_ids]
    
    for journal in journals:
        journal['header_path'] = file_manager.getJournalHeaderPath(journal.get('id'))
        journal['author_profile_photo'] = file_manager.getProfilePhotoPath(journal.get('author_id'))
    
    return journals


def process_group_messages(db: Database, file_manager: FileManager, discussions: list) -> list:
    """处理圈子相关的消息"""
    group_ids = list(set(discussion.get('group_id') for discussion in discussions))
    groups = [db.getGroup(id=group_id) for group_id in group_ids]
    
    for group in groups:
        group['icon'] = file_manager.getGroupIconPath(group.get('id'))
        group['founder_account'] = db.getUser(id=group.get('founder_id')).get('account')
        group['discussion_num'] = db.getGroupDiscussionNum(group_id=group.get('id'))
    
    return groups


def process_discussion_messages(db: Database, file_manager: FileManager, replies: list) -> list:
    """处理讨论回复相关的消息"""
    discussion_ids = list(set(reply.get('discussion_id') for reply in replies))
    discussions = [db.getGroupDiscussion(id=discussion_id) for discussion_id in discussion_ids]
    
    for discussion in discussions:
        discussion['author_profile_photo'] = file_manager.getProfilePhotoPath(discussion.get('author_id'))
        discussion['author_account'] = db.getUser(id=discussion.get('poster_id')).get('account')
        discussion['reply_num'] = db.getGroupDiscussionReplyNum(discussion_id=discussion.get('id'))
    
    return discussions


def process_chat_messages(db: Database, file_manager: FileManager, chats: list, current_user_id: int) -> list:
    """处理私信相关的消息"""
    sender_ids = list(set(chat.get('sender_id') for chat in chats))
    senders = [db.getUser(id=sender_id) for sender_id in sender_ids]
    
    for sender in senders:
        sender['chat_num'] = db.getChatNum(
            sender_id=sender.get('id'),
            receiver_id=current_user_id,
            each=True
        )
        sender['last_chat_time'] = db.getChatLastTime(
            sender_id=sender.get('id'),
            receiver_id=current_user_id
        )
        sender['profile_photo'] = file_manager.getProfilePhotoPath(sender.get('id'))
    
    return senders
