from django.http import *

def main(request):
    return JsonResponse({'message': '/api/log/{user_id}/* 是用户的日志相关接口'})