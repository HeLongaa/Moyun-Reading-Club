# -*- coding: utf-8 -*-
# @Time    : 2025/5/22 11:13
# @FileName: env_read
# @Software: PyCharm

import os
from dotenv import load_dotenv

load_dotenv()

# 读取环境变量

def sql_env():
    sql_host = os.environ.get("sql_host")
    sql_port = os.environ.get("sql_port")
    sql_user = os.environ.get("sql_user")
    sql_password = os.environ.get("sql_password")
    sql_db = os.environ.get("sql_db")

    return [sql_host, sql_port, sql_user, sql_password, sql_db]