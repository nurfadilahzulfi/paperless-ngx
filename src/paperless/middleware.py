from django.conf import settings

from paperless import version


class ApiVersionMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.user.is_authenticated:
            versions = settings.REST_FRAMEWORK["ALLOWED_VERSIONS"]
            response["X-Api-Version"] = versions[len(versions) - 1]
            response["X-Version"] = version.__full_version_str__

        return response
# middleware.py
class SuperUserOnlyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/api/documents/') and request.method in ['GET']:
            if 'download' in request.path or 'view' in request.path:
                if not request.user.is_superuser:
                    return JsonResponse({'error': 'Permission denied'}, status=403)
        
        response = self.get_response(request)
        return response