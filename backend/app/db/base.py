# -*- coding: utf-8 -*-
# @Time    : 2025/5/22 11:07
# @FileName: base
# @Software: PyCharm

import pymysql
from env_read import sql_env

db_config = sql_env()
# print(db_config[0])
db = pymysql.connect(host=db_config[0],
                     port=db_config[1],
                     user=db_config[2],
                     password=db_config[3],
                     database=db_config[4])
# 数据库操作