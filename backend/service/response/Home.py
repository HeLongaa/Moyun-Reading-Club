"""首页相关API的响应处理"""
from flask import Flask, session, request, jsonify, make_response
from service.database.DAO import Database
from service.File import FileManager
from service.Network import API
from service.response._Utils import _loginCheck


def homepageResponse(app: Flask, file_manager: FileManager, db: Database, api: API):
    """
    首页相关的API路由
    :param app: Flask app
    :param file_manager: 文件管理器对象，用于获取图片路径
    :param db: 数据库对象，用于获取数据
    :param api: API对象，用于获取天气和诗词信息
    """

    @app.route("/api/home/dashboard", methods=["GET"])
    def get_dashboard():
        """
        获取首页仪表盘数据，包括推荐书评、天气信息和未读消息数
        """
        _loginCheck()
        user_id = session.get("login_user")["id"]

        try:
            # 获取推荐书评
            journals = get_recommended_journals(db, file_manager)

            # 获取天气信息
            weather = get_weather_info(api, request.remote_addr)

            # 获取未读消息数
            unread_count = db.getAllUnreadMessageNum(user_id)

            return jsonify({
                "status": "success",
                "data": {
                    "journals": journals,
                    "weather": weather,
                    "unread_message_count": unread_count
                }
            })

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": "Failed to fetch dashboard data: " + str(e)
            }), 500)

    @app.route("/api/home/journals", methods=["GET"])
    def get_home_journals():
        """
        获取首页推荐书评列表
        参数：
        - limit: 返回数量限制（可选，默认5）
        - offset: 偏移量（可选，默认0）
        """
        _loginCheck()
        
        try:
            limit = int(request.args.get("limit", 5))
            offset = int(request.args.get("offset", 0))
            
            journals = get_recommended_journals(db, file_manager, limit, offset)
            
            return jsonify({
                "status": "success",
                "data": journals
            })

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"Failed to fetch journals: {str(e)}"
            }), 500)

    @app.route("/api/home/weather", methods=["GET"])
    def get_weather():
        """获取当前位置的天气信息"""
        _loginCheck()
        
        try:
            weather = get_weather_info(api, request.remote_addr)
            
            return jsonify({
                "status": "success",
                "data": weather
            })

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"Failed to fetch weather data: {str(e)}"
            }), 500)

    @app.route("/api/home/unread-messages", methods=["GET"])
    def get_unread_count():
        """获取未读消息数量"""
        _loginCheck()
        user_id = session.get("login_user")["id"]
        
        try:
            unread_count = db.getAllUnreadMessageNum(user_id)
            
            return jsonify({
                "status": "success",
                "data": {
                    "unread_count": unread_count
                }
            })

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"Failed to fetch unread message count: {str(e)}"
            }), 500)


def get_recommended_journals(db: Database, file_manager: FileManager, limit: int = 5, offset: int = 0) -> list:
    """
    获取推荐书评列表
    :param db: 数据库对象
    :param file_manager: 文件管理器对象
    :param limit: 返回数量限制
    :param offset: 偏移量
    :return: 书评列表
    """
    journals = db.getJournal(limit=limit, offset=offset)
    for journal in journals:
        journal["header_path"] = file_manager.getJournalHeaderPath(journal["id"])
        journal["author_profile_photo"] = file_manager.getProfilePhotoPath(journal["author_id"])
    return journals


def get_weather_info(api: API, ip_address: str) -> dict:
    """
    获取天气信息
    :param api: API对象
    :param ip_address: 用户IP地址
    :return: 天气信息
    """
    try:
        return api.getWeather_YiKeTianQi(ip_address)
    except Exception as e:
        return {
            "error": str(e),
            "status": "Weather service unavailable"
        }
