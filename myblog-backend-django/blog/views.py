# 为什么不用render：
# render() 是 Django 用于返回 HTML 页面的快捷函数
# 此项目是 DRF（前后端分离），视图返回的是 JSON 数据，不是 HTML，所以确实用不到 render。
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
import os
# generics 是什么？
#   它是 DRF 提供的一组通用视图类（Generic Views）
#   这些类封装了常见的 API 视图逻辑（如列表、详情、创建、更新、删除）
# 为什么用 generics 而不用普通 View？
#   使用 generics 可以大幅减少重复代码
#   只需指定 queryset 和 serializer_class，DRF 会自动处理请求和响应，包括序列化、分页、响应格式等
#   内置功能：分页、过滤、权限控制等
from rest_framework import (
    generics,
    filters
)
from django_filters.rest_framework import DjangoFilterBackend
from . import (
    models,
    serializers
)

# ======== 类型 ========
# 返回完整类型列表
class CategoryListView(generics.ListAPIView):
    serializer_class = serializers.CategorySerializer
    # 读取的json数据格式用的是什么model
    queryset = models.Category.objects.all()

# 返回单独类型详情
class CategoryDetailView(generics.RetrieveAPIView):
    serializer_class = serializers.CategorySerializer
    queryset = models.Category.objects.all()

# ======== 标签 ========
# 返回完整标签列表
class TagListView(generics.ListAPIView):
    serializer_class = serializers.TagSerializer
    queryset = models.Tag.objects.all()

# 返回单独标签详情
class TagDetailView(generics.RetrieveAPIView):
    serializer_class = serializers.TagSerializer
    queryset = models.Tag.objects.all()

# ======= 文章 ========
# 定义一个用于文章列表的 API 视图类。
# 继承关系：
#   generics.ListAPIView 是 DRF 提供的只读列表视图
#   多用于搜索结果，文章列表等场景
#   它自动实现了 GET /api/posts/ 的逻辑
# 特点：
#   返回对象列表
#   自动处理分页、排序等功能
#   只响应 GET 请求，其他方法（POST/PUT）返回 405 Method Not Allowed
class PostListView(generics.ListAPIView):
    # 告诉视图 “用哪个 Serializer 来序列化数据”。
    # 机制：当 DRF 处理请求时，会调用 serializer_class 对 queryset 中的每个对象进行序列化
    serializer_class = serializers.PostListSerializer
    # 告诉视图 “从哪里获取数据”。
    # Post.objects： Django ORM 的模型管理器，用于查询数据库
    # select_related: 用于一对一/多对一关系筛选(ForeignKey)
    # prefetch_related: 用于多对多(ManyToManyField)
    # .filter(is_draft=False)： 只获取已发布的文章，过滤掉草稿
    # 如果没有这一行，API 会返回所有文章（包括草稿）
    # .order_by('-created_at')：规定排序规则，按发布时间排序。-表示降序（从新到旧）
    queryset = models.Post.objects.select_related(
        'author', 
        'category'
        ).prefetch_related('tags').filter(is_draft=False).order_by('-created_at')
    # 过滤搜索结果
    # 指定所用过滤器,其他常用的过滤器有：
    # ExactFilter：使用精确匹配过滤，可以用于过滤整数，boolean，字符串等类型的字段
    # CharFilter：使用模糊匹配过滤，可以用于过滤字符串类型的字段；
    # ChoiceFilter：使用选项过滤，可以用于过滤多选字段；
    # DateFilter：使用日期过滤，可以用于过滤日期类型的字段；
    # NumberFilter：使用数字过滤，可以用于过滤数字类型的字段；
    # RangeFilter：使用范围过滤，可以用于过滤数字、日期等类型的字段。
    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    # 指定 filters.SearchFilter 过滤条件
    search_fields = [
        'title', 
        'summary',
        'content',
        'author__username'
    ]
    # 指定 DjangoFilterBackend 过滤条件
    filterset_fields = [
        'category',
        'tags'
    ]

# 定义一个用于单篇文章详情的API 视图类。
# 继承关系：
#   generics.RetrieveAPIView 是 DRF 提供的只读详情视图
#   多用于显示单个对象的详细信息
#   它自动实现了 GET /api/posts/<id>/ 的逻辑
# 特点：
#   返回单个对象（不是列表）
#   只响应 GET 请求，其他方法（POST/PUT）返回 405 Method Not Allowed
#   如果对象不存在，返回 404 Not Found
class PostDetailView(generics.RetrieveAPIView):
    # 指定用于序列化单篇文章详情的 Serializer 类
    serializer_class = serializers.PostDetailSerializer
    # query: 查询
    # 只获取已发布的文章，过滤掉草稿
    queryset = models.Post.objects.select_related(
        'author',
        'category'
        ).prefetch_related('tags').filter(is_draft=False)
    # DRF 默认根据主键（id）查找对象，例如：/api/posts/1/
    # 这里改为根据 slug 字段查找文章，例如：/api/posts/my-first-post/
    lookup_field = 'slug'  # 根据 slug 字段查找文章，而不是默认的 id

# 完整数据流示例
# 当访问 GET /api/posts/learn-django/：

# Django 路由匹配到 path('posts/<slug:slug>/', PostDetailView.as_view())
# DRF 提取 URL 中的 slug = "learn-django"
# 执行 queryset.get(slug="learn-django")
# 找到文章后，用 PostDetailSerializer 序列化
# 返回 JSON 响应（含 content, updated_at 等）

# 健康检查视图：用于容器健康探测与运维监控
BUILD_TIMESTAMP = timezone.now().isoformat()
APP_VERSION = os.environ.get("APP_VERSION", "unknown")

def health(request):
    """健康检查端点:
    返回基础运行状态 + 构建时间 + 版本标识。
    数据库只做一次 exists() 快速探测避免高负载。
    """
    try:
        db_ok = models.Post.objects.exists() or True
        return JsonResponse({
            "status": "ok",
            "db": "up" if db_ok else "down",
            "version": APP_VERSION,
            "build_timestamp": BUILD_TIMESTAMP
        }, status=200)
    except Exception as e:
        return JsonResponse({
            "status": "error",
            "detail": str(e),
            "version": APP_VERSION,
            "build_timestamp": BUILD_TIMESTAMP
        }, status=500)