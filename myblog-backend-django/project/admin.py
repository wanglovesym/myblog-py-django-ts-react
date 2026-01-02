# ============================================================
# 项目展示模块 - Admin 后台配置
# ============================================================
# 定义 TechStack 和 Project 在 Django 后台管理界面中的显示方式
# ============================================================

from django.contrib import admin
from django.utils.html import format_html
from . import models


@admin.register(models.TechStack)
class TechStackAdmin(admin.ModelAdmin):
    """
    技术栈 Admin 配置
    """
    # 列表页显示的字段
    list_display = (
        'name',
        'icon_preview',
        'color_preview',
        'official_url'
    )
    
    # 搜索字段
    search_fields = ('name',)
    
    # 每页显示数量
    list_per_page = 20
    
    def icon_preview(self, obj):
        """显示图标预览"""
        if obj.icon_url:
            return format_html(
                '<img src="{}" style="width: 24px; height: 24px; object-fit: contain;" />',
                obj.icon_url
            )
        return '-'
    icon_preview.short_description = '图标'
    
    def color_preview(self, obj):
        """显示颜色预览"""
        if obj.color:
            return format_html(
                '<span style="display: inline-block; width: 20px; height: 20px; '
                'background-color: {}; border-radius: 4px; border: 1px solid #ccc;"></span> {}',
                obj.color, obj.color
            )
        return '-'
    color_preview.short_description = '颜色'


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
    """
    项目 Admin 配置
    """
    # 列表页显示的字段
    list_display = (
        'title',
        'status',
        'is_featured',
        'is_published',
        'sort_order',
        'cover_preview',
        'created_at'
    )
    
    # 右侧过滤器
    list_filter = (
        'status',
        'is_featured',
        'is_published',
        'tech_stack'
    )
    
    # 搜索字段
    search_fields = (
        'title',
        'description',
        'content'
    )
    
    # 自动生成 slug
    prepopulated_fields = {
        'slug': ('title',)
    }
    
    # 多对多字段使用水平选择器
    filter_horizontal = ('tech_stack',)
    
    # 可直接在列表页编辑的字段
    list_editable = (
        'is_featured',
        'is_published',
        'sort_order'
    )
    
    # 每页显示数量
    list_per_page = 20
    
    # 按创建时间倒序排列
    ordering = ('-created_at',)
    
    # 编辑页字段分组
    fieldsets = (
        ('基本信息', {
            'fields': ('title', 'slug', 'description', 'content')
        }),
        ('媒体', {
            'fields': ('cover_image',)
        }),
        ('链接', {
            'fields': ('github_url', 'demo_url')
        }),
        ('技术栈', {
            'fields': ('tech_stack',)
        }),
        ('状态与展示', {
            'fields': ('status', 'is_featured', 'is_published', 'sort_order')
        }),
    )
    
    # 只读字段（时间戳自动生成）
    readonly_fields = ('created_at', 'updated_at')
    
    def cover_preview(self, obj):
        """显示封面图片预览"""
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;" />',
                obj.cover_image.url
            )
        return '-'
    cover_preview.short_description = '封面'
