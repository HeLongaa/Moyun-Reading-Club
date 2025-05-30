"""搜索相关API的响应处理"""
from datetime import datetime
from flask import Flask, request, jsonify, make_response
from service.File import FileManager
from service.database.DAO import Database
from service.response._Utils import _loginCheck


def searchResponse(app: Flask, file_manager: FileManager, db: Database):
    """
    搜索相关的API路由
    :param app: Flask应用
    :param file_manager: 文件管理器
    :param db: 数据库
    """

    @app.route("/api/search", methods=["GET"])
    def search():
        """
        全局搜索接口
        参数：
        - type: 搜索类型（journal/book/group/user/all）
        - keyword: 搜索关键词
        - page: 页码（可选，默认1）
        - per_page: 每页数量（可选，默认20）
        """
        _loginCheck()
        search_start_time = datetime.now()

        # 获取参数
        search_type = request.args.get("type")
        keyword = request.args.get("keyword")
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 20))

        if not search_type or not keyword:
            return make_response(jsonify({
                "status": "error",
                "message": "Missing search type or keyword"
            }), 400)

        try:
            # 根据不同类型进行搜索
            if search_type == "journal":
                results = search_journals(db, file_manager, keyword)
            elif search_type == "book":
                results = search_books(db, file_manager, keyword)
            elif search_type == "group":
                results = search_groups(db, file_manager, keyword)
            elif search_type == "user":
                results = search_users(db, file_manager, keyword)
            elif search_type == "all":
                results = search_all(db, file_manager, keyword)
            else:
                return make_response(jsonify({
                    "status": "error",
                    "message": "Invalid search type"
                }), 400)

            # 计算分页
            total = len(results)
            start = (page - 1) * per_page
            end = start + per_page
            paginated_results = results[start:end]

            # 计算搜索耗时
            cost_time = (datetime.now() - search_start_time).total_seconds()

            return jsonify({
                "status": "success",
                "data": {
                    "results": paginated_results,
                    "pagination": {
                        "total": total,
                        "page": page,
                        "per_page": per_page,
                        "total_pages": (total + per_page - 1) // per_page
                    },
                    "cost_time": cost_time
                }
            })

        except Exception as e:
            return make_response(jsonify({
                "status": "error",
                "message": f"Search failed: {str(e)}"
            }), 500)


def search_journals(db: Database, file_manager: FileManager, keyword: str) -> list:
    """搜索书评"""
    results = db.getJournal(limit=0, keyword=keyword)
    for result in results:
        result["header"] = file_manager.getJournalHeaderPath(result.get("id"))
        result["search_type"] = "journal"
    return results


def search_books(db: Database, file_manager: FileManager, keyword: str) -> list:
    """搜索书籍"""
    results = db.getBook(limit=0, keyword=keyword)
    for result in results:
        result["book_cover"] = file_manager.getBookCoverPath(result.get("id"))
        result["search_type"] = "book"
    return results


def search_groups(db: Database, file_manager: FileManager, keyword: str) -> list:
    """搜索圈子"""
    results = db.getGroup(limit=0, keyword=keyword)
    for result in results:
        result["group_icon"] = file_manager.getGroupIconPath(result.get("id"))
        result["founder"] = db.getUser(id=result["founderID"]).get("account")
        result["search_type"] = "group"
    return results


def search_users(db: Database, file_manager: FileManager, keyword: str) -> list:
    """搜索用户"""
    results = db.getUser(limit=0, keyword=keyword)
    for result in results:
        result["profile_photo"] = file_manager.getProfilePhotoPath(result.get("id"))
        result["search_type"] = "user"
    return results


def search_all(db: Database, file_manager: FileManager, keyword: str) -> list:
    """搜索所有类型"""
    # 搜索用户
    users = search_users(db, file_manager, keyword)
    
    # 搜索圈子
    groups = search_groups(db, file_manager, keyword)
    
    # 搜索书籍
    books = search_books(db, file_manager, keyword)
    
    # 搜索书评
    journals = search_journals(db, file_manager, keyword)
    
    # 合并所有结果
    return users + groups + books + journals
