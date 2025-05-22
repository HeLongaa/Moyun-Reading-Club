# -*- coding: utf-8 -*-
# @Time    : 2025/5/22 11:33
# @FileName: auth
# @Software: PyCharm

from fastapi import APIRouter

router = APIRouter()

@router.post("/register")
def register():
    # 注册接口
    pass

# Content-Type: application/json
#
# {
#     "username": "your_username",
#     "password": "your_password"
# }
@router.post("/login")
def login():
    # 登录接口
    pass

@router.post("/logout")
def logout():
    # 登出接口
    pass

@router.post("/refresh")
def refresh():
    # 刷新token接口
    pass

@router.post("/reset_password")
def reset_password():
    # 重置密码接口
    pass

