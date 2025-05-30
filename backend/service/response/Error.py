"""API错误处理"""
from flask import Flask, abort, jsonify, make_response
from service.database.DAO import Database
from service.File import FileManager
from service.Utils import Config


def getErrorResources(db: Database, file_manager: FileManager, error_code: int) -> dict:
    """
    获取错误相关的资源
    :param db: 数据库对象，用于获取错误信息
    :param file_manager: 文件管理器对象，用于获取图片路径
    :param error_code: 错误码
    """
    content = db.getError(error_code)
    author = db.getUser(id=1)
    if Config["Path"]["ErrorImageSource"] == "local":
        error_image = file_manager.getErrorImagePath(error_code)
    else:
        error_image = f"https://http.cat/{error_code}"
    return {
        "code": error_code,
        "content": content,
        "author": author.get("account"),
        "image_url": error_image
    }


def errorResponse(app: Flask, file_manager: FileManager, db: Database):
    """
    API错误处理器
    :param app: Flask app
    :param file_manager: 文件管理器对象，用于获取图片路径
    :param db: 数据库对象，用于获取错误信息
    """

    @app.errorhandler(400)
    def bad_request(error):
        """400 Bad Request - 请求参数错误"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 400,
                "type": "BadRequest",
                "message": "The request parameters are invalid",
                "details": error_info
            }
        }), 400)

    @app.errorhandler(401)
    def unauthorized(error):
        """401 Unauthorized - 未认证"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 401,
                "type": "Unauthorized",
                "message": "Authentication is required",
                "details": error_info
            }
        }), 401)

    @app.errorhandler(403)
    def forbidden(error):
        """403 Forbidden - 无权限"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 403,
                "type": "Forbidden",
                "message": "You don't have permission to access this resource",
                "details": error_info
            }
        }), 403)

    @app.errorhandler(404)
    def not_found(error):
        """404 Not Found - 资源不存在"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 404,
                "type": "NotFound",
                "message": "The requested resource was not found",
                "details": error_info
            }
        }), 404)

    @app.errorhandler(405)
    def method_not_allowed(error):
        """405 Method Not Allowed - 方法不允许"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 405,
                "type": "MethodNotAllowed",
                "message": "The HTTP method is not allowed for this endpoint",
                "details": error_info
            }
        }), 405)

    @app.errorhandler(418)
    def im_a_teapot(error):
        """418 I'm a teapot - 彩蛋"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 418,
                "type": "Teapot",
                "message": "I'm a teapot, not a coffee maker",
                "details": error_info
            }
        }), 418)

    @app.errorhandler(429)
    def too_many_requests(error):
        """429 Too Many Requests - 请求过多"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 429,
                "type": "TooManyRequests",
                "message": "Too many requests in a given amount of time",
                "details": error_info
            }
        }), 429)

    @app.errorhandler(500)
    def internal_server_error(error):
        """500 Internal Server Error - 服务器内部错误"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 500,
                "type": "InternalServerError",
                "message": "An internal server error occurred",
                "details": error_info
            }
        }), 500)

    @app.errorhandler(503)
    def service_unavailable(error):
        """503 Service Unavailable - 服务不可用"""
        error_info = getErrorResources(db, file_manager, error.code)
        return make_response(jsonify({
            "status": "error",
            "error": {
                "code": 503,
                "type": "ServiceUnavailable",
                "message": "The service is temporarily unavailable",
                "details": error_info
            }
        }), 503)
