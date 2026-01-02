"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.contrib import admin
# include：用于包含其他 app 的路由模块（必须导入！）
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # 包含 blog 应用的路由模块，前端 API 路径统一以 /api/ 开头，清晰易维护
    # 作用：将所有以 /api/ 开头的请求，交给 blog 应用的路由处理
    # 'api/'：
    #   所有 blog app 的路由都会加上这个前缀
    #   blog/urls.py 中的 'posts/' → 最终 URL: /api/posts/
    # include('blog.urls'):
    #   告诉 Django："去 blog app 的 urls.py 文件里找路由定义"
    #   这样做的好处是模块化管理路由，blog 应用可以独立维护自己的路由
    #   字符串格式：'<app_name>.urls'
    path('api/', include('blog.urls')),
    # 项目展示模块路由
    path('api/', include('project.urls')),
]

# 开发环境下提供媒体文件服务
# 生产环境应由 Nginx 处理媒体文件
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
