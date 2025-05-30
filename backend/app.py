"""后端主要的功能文件"""
import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint

from service import Utils
from service.database.DAO import Database
from service.File import FileManager
from service.Network import API, Mail
from service.response import *

# 创建上传文件目录
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
for folder in ['bookCover', 'journalHeader', 'profilePhoto', 'groupIcon']:
    folder_path = os.path.join(UPLOAD_FOLDER, folder)
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

# 创建应用实例
app = Flask(__name__)
CORS(app)  # 启用CORS支持

# 配置
app.config.update(Utils.queryConfig('Flask'))  # 从配置文件中读取Flask配置
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 限制上传文件大小为16MB

# 配置服务
api = API()
mail = Mail()
db = Database(app)
file_manager = FileManager()

# Swagger配置
SWAGGER_URL = '/'  # URL for exposing Swagger UI
API_URL = '/static/swagger.json'  # Our API url

# 配置Swagger UI
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "MoYun API Documentation",
        'layout': 'BaseLayout',
        'deepLinking': True,
        'displayOperationId': True
    }
)
app.register_blueprint(swaggerui_blueprint)

# 用户上传文件的静态服务
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    """提供上传文件的访问"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# 注册所有API路由
accountResponse(app, file_manager, db, mail)  # 账号相关API
bookResponse(app, file_manager, db)  # 书籍相关API
chatResponse(app, file_manager, db)  # 聊天相关API
journalResponse(app, file_manager, db)  # 书评相关API
lLMResponse(app, api)  # AI助手相关API
profileResponse(app, file_manager, db)  # 个人信息相关API
groupResponse(app, file_manager, db)  # 圈子相关API
searchResponse(app, file_manager, db)  # 搜索相关API
messageResponse(app, file_manager, db)  # 消息相关API
errorResponse(app, file_manager, db)  # 错误处理API
securityCheck(app)  # 安全检查相关措施

# 全局错误处理
@app.errorhandler(400)
def bad_request(e):
    return jsonify({"status": "error", "message": "Bad Request"}), 400

@app.errorhandler(401)
def unauthorized(e):
    return jsonify({"status": "error", "message": "Unauthorized"}), 401

@app.errorhandler(403)
def forbidden(e):
    return jsonify({"status": "error", "message": "Forbidden"}), 403

@app.errorhandler(404)
def not_found(e):
    return jsonify({"status": "error", "message": "Resource not found"}), 404

@app.errorhandler(500)
def internal_server_error(e):
    return jsonify({"status": "error", "message": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(
        port=Utils.queryConfig("Flask", "Port"),
        host="0.0.0.0"
    )
