# ============================================================
# 项目展示模块 - 视图
# ============================================================
# 提供项目列表和详情的 API 接口
# ============================================================

from rest_framework import generics
from . import models, serializers


class ProjectListView(generics.ListAPIView):
    """
    项目列表视图
    GET /api/projects/ - 获取所有已发布的项目
    
    支持查询参数:
    - featured: 筛选精选项目（?featured=true）
    """
    serializer_class = serializers.ProjectListSerializer
    
    def get_queryset(self):
        """
        返回已发布的项目列表
        支持按精选筛选
        """
        queryset = models.Project.objects.prefetch_related(
            'tech_stack'
        ).filter(is_published=True)
        
        # 精选筛选
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)
        
        return queryset


class ProjectDetailView(generics.RetrieveAPIView):
    """
    项目详情视图
    GET /api/projects/<slug>/ - 获取单个项目详情
    """
    serializer_class = serializers.ProjectDetailSerializer
    # 使用 slug 作为查找字段（而非默认的 pk）
    lookup_field = 'slug'
    
    def get_queryset(self):
        """
        返回已发布的项目
        """
        return models.Project.objects.prefetch_related(
            'tech_stack'
        ).filter(is_published=True)


class TechStackListView(generics.ListAPIView):
    """
    技术栈列表视图
    GET /api/tech-stacks/ - 获取所有技术栈
    """
    serializer_class = serializers.TechStackSerializer
    queryset = models.TechStack.objects.all()
