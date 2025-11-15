# admin模块：定义模型（如 Post）在 Django 后台管理界面中的显示方式、行为和交互逻辑。
# 所有与 Admin 相关的功能（如 ModelAdmin、装饰器 @admin.register）都定义在这里。
# 核心功能：
# list_display: 列表页显示哪些字段
# list_filter: 支持哪些过滤条件
# search_fields: 搜索哪些字段
# prepopulated_fields: 编辑页如何布局（自动填slug）
# filter_horizontal: 如何吃力多对多字段

from django.contrib import admin
# 当前 app（blog）的 models.py 中导入 Post 模型。
from . import models

@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'description'
    )
    search_fields = ('name',)

@admin.register(models.Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# 这是一个装饰器（decorator），用于将 PostAdmin 类注册到 Django Admin。
# 等价写法（旧式）：
# admin.site.register(Post, PostAdmin)
# 效果：告诉 Django：“在 Admin 后台为 Post 模型使用 PostAdmin 这个配置类”。
@admin.register(models.Post)
# 作用：定义 Post 模型在 Django Admin 后台的显示，行为和理方式。
# 继承关系：
#   admin.ModelAdmin 是 Django 提供的基类
#   所有 Admin 配置类都必须继承它
# 命名规范：通常以模型名 + Admin 结尾，如 PostAdmin。
# Django 会自动识别这种命名（但必须通过 @register 显式注册）
class PostAdmin(admin.ModelAdmin):
    # 作用：定义在 Admin 列表页中显示哪些字段（列）。
    # 效果：在 Admin 后台的文章列表页，会显示标题、作者、创建时间和是否为草稿这四列。
    # 默认行为： 如果不设置，Admin 列表页只显示 __str__ 方法返回的字符串。（即文章标题）
    list_display = (
        'title',
        'author',
        'created_at',
        'is_draft'
        )
    # 作用：添加过滤器，允许管理员按“是否为草稿”筛选文章。
    # 效果：在 Admin 列表页右侧，会出现一个过滤栏，管理员可以点击“是”或“否”来筛选文章。
    # 各字段效果：
    #   'is_draft' → 生成 “All / Yes / No” 三个选项，快速筛选草稿或已发布文章
    #   'created_at' → 生成按“今天 / 昨天 / 本周 / 本月…” 的时间过滤器
    list_filter = (
        'is_draft',
        'created_at'
    )
    # 作用：添加搜索框
    # 效果：在 Admin 列表页顶部，会出现一个搜索框，管理员可以输入关键词来搜索文章。
    # search_fields 指定哪些字段参与搜索。
    # 支持跨关系搜索：如 author__username 表示搜索关联的 User 模型的 username 字段。
    # 为什么不能直接写 'author'？
    # author 是一个 ForeignKey，指向 User 模型（表单）。
    # Django 不知道你到底想搜索 User 的哪个字段（用户名？邮箱？全名？）。
    search_fields = (
        'title',
        'content',
        'author__username', 
        'author__email'
    )
    # 作用：在 Admin 编辑页，根据其他字段自动生成 slug。
    # 效果：
    #   当你在 Admin 编辑文章时，输入标题后，slug 字段会自动填充
    #   例如：输入标题 “My First Blog Post!” → slug 自动变成 “my-first-blog-post”
    # {'slug': ('title',)}是一个字典:
    #    key：目标字段（要自动生成的字段，这里是 'slug'）
    #    value：元组，表示“根据哪些字段生成 slug”（这里是 ('title',)）
    # 注意：('title',) 是单元素元组，末尾的逗号不能省！后面要加逗号，否否则 Python 会当成字符串。
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)

# 技术实现原理：
# Admin 是一个完整的 Django app：它有自己的 models、views、templates。
# ModelAdmin 类的作用：将你的模型“翻译”成 Admin 能理解的配置。
# 当注册 PostAdmin 后，Django Admin 会根据 PostAdmin 的配置，自动生成对应的视图和表单。
# 例如：
# - list_display 会生成一个包含指定字段的 HTML 表格
# - list_filter 会生成过滤选项的侧边栏
# - search_fields 会生成一个搜索表单，并在后台处理搜索逻辑
# 所有配置都是声明式的：不用写 HTML/JS，Django 自动渲染。

