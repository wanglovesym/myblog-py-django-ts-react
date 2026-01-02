# ============================================================
# 项目展示模块 - URL 路由
# ============================================================

from django.urls import path, register_converter
from . import views
from blog.converters import UnicodeSlugConverter

# 注册 Unicode slug 转换器，支持中文等非 ASCII 字符
register_converter(UnicodeSlugConverter, 'unicode_slug')

urlpatterns = [
    # 项目列表
    # GET /api/projects/ - 获取所有已发布项目
    # GET /api/projects/?featured=true - 获取精选项目
    path('projects/', views.ProjectListView.as_view(), name='project-list'),
    
    # 项目详情
    # GET /api/projects/<slug>/ - 获取单个项目详情
    path('projects/<unicode_slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
    
    # 技术栈列表
    # GET /api/tech-stacks/ - 获取所有技术栈
    path('tech-stacks/', views.TechStackListView.as_view(), name='techstack-list'),
]
