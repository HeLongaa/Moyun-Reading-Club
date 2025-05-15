from django.http import *

def main(request):
    return JsonResponse({'message': '/api/comments/{a_id}/* 是页面对应的评论'})

def book_comments(request):
    return JsonResponse({'message': '/api/comments/book/{b_id}/* 是书籍对应的评论接口'})