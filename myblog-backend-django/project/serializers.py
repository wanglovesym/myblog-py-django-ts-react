# ============================================================
# 项目展示模块 - 序列化器
# ============================================================
# 负责将 Django 模型对象转换为 JSON 格式的 API 响应
# ============================================================

from rest_framework import serializers
from . import models


class TechStackSerializer(serializers.ModelSerializer):
    """
    技术栈序列化器
    用于项目列表和详情中的技术栈展示
    """
    class Meta:
        model = models.TechStack
        fields = [
            'id',
            'name',
            'icon_url',
            'official_url',
            'color'
        ]


class ProjectListSerializer(serializers.ModelSerializer):
    """
    项目列表序列化器
    用于项目列表页，不包含详细内容（content）
    """
    # 嵌套序列化技术栈
    tech_stack = TechStackSerializer(many=True, read_only=True)
    
    # 自定义字段：封面图片的完整 URL
    cover_image_url = serializers.SerializerMethodField()
    
    # 状态的显示文本
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = models.Project
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'cover_image_url',
            'github_url',
            'demo_url',
            'tech_stack',
            'status',
            'status_display',
            'is_featured',
            'created_at',
            'updated_at'
        ]
    
    def get_cover_image_url(self, obj):
        """
        返回封面图片的完整 URL
        如果没有封面图片，返回 None
        """
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class ProjectDetailSerializer(serializers.ModelSerializer):
    """
    项目详情序列化器
    用于项目详情页，包含完整内容（content）
    """
    tech_stack = TechStackSerializer(many=True, read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = models.Project
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'content',  # 详情页包含完整内容
            'cover_image_url',
            'github_url',
            'demo_url',
            'tech_stack',
            'status',
            'status_display',
            'is_featured',
            'created_at',
            'updated_at'
        ]
    
    def get_cover_image_url(self, obj):
        """
        返回封面图片的完整 URL
        如果没有封面图片，返回 None
        """
        if obj.cover_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None
