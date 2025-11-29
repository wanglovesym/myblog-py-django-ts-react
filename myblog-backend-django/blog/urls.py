# path() 是定义 URL 路由的核心工具（Django 2.0+ 推荐方式）
# 替代方案：旧版用 url()（正则），但 path() 更简洁安全
from django.urls import path, register_converter
from . import views
from .converters import UnicodeSlugConverter

register_converter(UnicodeSlugConverter, 'unicode_slug')

# 作用：定义一个路由列表，Django 会按顺序匹配请求的 URL
# 命名规范：必须叫 urlpatterns（Django 约定）
urlpatterns = [
    # 路径为posts时说明需要文章列表，调用之前创建的 PostListView 类。
    # 'posts/':
    #   URL 路径（相对路径，不包含域名）
    #   最终完整路径：/api/posts/（因为主路由会加 /api/ 前缀）
    # views.PostListView.as_view():
    #   指定处理该路径请求的视图类
    #   DRF 的视图类（如 PostListView）必须调用 .as_view() 才能变成可调用的函数
    #   Django 路由只接受可调用对象（函数或 .as_view() 返回的函数）
    # name='post-list':
    #   用于 Django 内部反向解析，如 {% url 'post-list' %}
    path('posts/', views.PostListView.as_view(), name='post-list'),
    # 路径为posts/<slug:slug>/时显说明需要单篇文章详情，调用 PostDetailView 类。
    # 'posts/<slug:slug>/':
    #   URL 路径，包含一个动态路径参数 <slug:slug>：
    #       第一个 slug：路径转换器（path converter），只匹配符合 slug 格式的字符串（字母、数字、-、_）
    #       第二个 slug：参数名，会作为关键字参数传给视图（即 slug="my-first-blog"）
    #   例如： /api/posts/my-first-blog/ 会匹配成功，slug='my-first-blog'
    #   为什么使用 slug 转换器？
    #       自动验证参数合法性（避免 posts/../../../etc/passwd/ 这类攻击）
    #       比通用 <str:slug> 更安全
    path('posts/<unicode_slug:slug>/', views.PostDetailView.as_view(), name='post-detail'),
    
    # ======== 类型 ========
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
    path('categories/<int:pk>', views.CategoryDetailView.as_view(), name='category-detail'),

    # ======== 标签 ========
    path('tags/', views.TagListView.as_view(), name='tag-list'),
    path('tags/<int:pk>', views.TagDetailView.as_view(), name="tag-detail"),
    # 健康检查端点：返回 {status: ok} 或错误信息，供 Docker healthcheck 使用
    path('health/', views.health, name='health'),
]