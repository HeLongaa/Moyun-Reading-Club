from django.http import JsonResponse


def main(request):
    return JsonResponse({'message': '/api/book/{id}/*是书籍信息的api'})