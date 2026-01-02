# ============================================================
# 项目展示模块 - 数据模型
# ============================================================
# 包含：
# - TechStack: 技术栈（用于项目的技术标签）
# - Project: 项目（展示的开源项目/作品集）
# ============================================================

from django.db import models


class TechStack(models.Model):
    """
    技术栈模型
    用于标记项目所使用的技术，与 blog 的 Tag 模型分离
    可扩展字段：图标、官网链接、颜色等
    """
    # 技术名称，如 "Python", "React", "Django"
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="技术名称"
    )
    
    # 技术图标 URL（可选），如技术的 logo
    icon_url = models.URLField(
        blank=True,
        verbose_name="图标URL"
    )
    
    # 技术官网链接（可选）
    official_url = models.URLField(
        blank=True,
        verbose_name="官网链接"
    )
    
    # 标签颜色（可选），用于前端展示
    # 格式：十六进制颜色码，如 "#61DAFB"（React 蓝）
    color = models.CharField(
        max_length=7,
        blank=True,
        verbose_name="标签颜色"
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = "技术栈"
        verbose_name_plural = "技术栈"
        ordering = ['name']  # 按名称排序


class Project(models.Model):
    """
    项目模型
    用于展示开源项目和作品集
    """
    
    # 项目状态选项
    class Status(models.TextChoices):
        DEVELOPING = 'developing', '开发中'
        COMPLETED = 'completed', '已完成'
        ONLINE = 'online', '已上线'
        OFFLINE = 'offline', '暂时下线'

    # 项目名称
    title = models.CharField(
        max_length=200,
        verbose_name="项目名称"
    )
    
    # URL 友好标识符
    slug = models.SlugField(
        unique=True,
        allow_unicode=True,
        max_length=200,
        verbose_name="URL标识"
    )
    
    # 项目简介（列表页展示）
    description = models.TextField(
        verbose_name="项目简介"
    )
    
    # 项目详细介绍（详情页展示，支持 Markdown）
    content = models.TextField(
        blank=True,
        verbose_name="详细介绍"
    )
    
    # 项目封面图（本地上传）
    # 图片将上传到 MEDIA_ROOT/projects/ 目录
    cover_image = models.ImageField(
        upload_to='projects/covers/',
        blank=True,
        null=True,
        verbose_name="封面图片"
    )
    
    # GitHub 仓库链接（可选）
    github_url = models.URLField(
        blank=True,
        verbose_name="GitHub链接"
    )
    
    # 演示地址（可选）
    demo_url = models.URLField(
        blank=True,
        verbose_name="演示地址"
    )
    
    # 技术栈（多对多关系）
    tech_stack = models.ManyToManyField(
        TechStack,
        blank=True,
        related_name='projects',
        verbose_name="技术栈"
    )
    
    # 项目状态
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DEVELOPING,
        verbose_name="项目状态"
    )
    
    # 是否为精选项目
    is_featured = models.BooleanField(
        default=False,
        verbose_name="精选项目"
    )
    
    # 是否发布（控制是否在前端展示）
    is_published = models.BooleanField(
        default=False,
        verbose_name="是否发布"
    )
    
    # 排序权重（数值越大越靠前）
    sort_order = models.IntegerField(
        default=0,
        verbose_name="排序权重"
    )
    
    # 创建时间
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="创建时间"
    )
    
    # 更新时间
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="更新时间"
    )

    def __str__(self) -> str:
        return self.title

    class Meta:
        verbose_name = "项目"
        verbose_name_plural = "项目"
        # 默认排序：精选优先，然后按排序权重降序，最后按创建时间降序
        ordering = ['-is_featured', '-sort_order', '-created_at']
