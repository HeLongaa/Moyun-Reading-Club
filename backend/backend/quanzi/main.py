from django.http import *

def main(request):
    return JsonResponse({'message': '/api/quanzi/{q_id}/* 是圈子对应的接口'})

