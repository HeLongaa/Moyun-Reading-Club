# -*- coding: utf-8 -*-
# @Time    : 2025/5/22 11:48
# @FileName: me
# @Software: PyCharm

from fastapi import APIRouter

router = APIRouter()

@router.get("/me")
def me():
    # 获取用户信息
    pass

@router.get("/me/permission")
def permission():
    # 获取用户权限
    pass

