# -*- coding: utf-8 -*-
# @Time    : 2025/5/22 11:24
# @FileName: test
# @Software: PyCharm
# app/api/v1/test.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
def test():
    test_re = {
        "code": 200,
        "data": {
            "id": 1,
            "name": "test",
        }
    }
    return test_re