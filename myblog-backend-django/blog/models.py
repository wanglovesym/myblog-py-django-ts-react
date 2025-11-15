from django.db import models
from django.contrib.auth.models import User

# Category类，文章可以属于一个类型
# 一篇文章只能属于一个分类（一对多）
class Category(models.Model):
    #
    name = models.CharField(
        max_length=100, 
        unique=True,  
        verbose_name="分类名"
    )
    # 每个分类可以对其编写一个相应的解释
    description = models.TextField(
        blank=True,
        verbose_name="描述"
    )
    
    def __str__(self) -> str:
        # 在 Admin中显示分类名称
        return self.name
    
    class Meta:
        verbose_name = "分类"
        verbose_name_plural = "分类" # 复数形式，中文仍需进行定义

# Tag类
# 一篇文章可以有多个标签（多对多）
class Tag(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="标签名"
    )
    def __str__(self) -> str:
        return self.name
    
    class Meta:
        verbose_name = "标签"
        verbose_name_plural = "标签"

# Post类：博客文章。继承自models.Model
# 在 Django 中，每一个继承 models.Model 的类，对应数据库当中的一张表
# 表名默认是 blog_post (<app name>_<model name lowercase>)
class Post(models.Model):
    # 作用：储存文章标题（短文本200）
    # # 字段类型：CharField
    # 在数据库中会被映射为 VARCHAR(200)
    # 为什么不用 TextField？因为标题短且长度有限，用 CharField 更高效。
    title = models.CharField(max_length = 200)
    # 存储 URL 友好的标识符，如 my-first-blog。
    # 字段类型：SlugField
    # slug: URL 安全版本-去掉特殊字符、空格变短横线、全小写。
    # unique：确保每篇文章的 slug 全局唯一。如果重复，保存时会报错。
    #        数据库会自动加 唯一索引（UNIQUE constraint）。
    # allow_unicode=True：允许 Unicode 字符（如中文、日文）。
    #        这样就能够对中文标题也自动生成 slug。
    slug = models.SlugField(
        unique=True, 
        allow_unicode=True,
        max_length=200
    )
    # 作用：文章摘要（简介）。
    # 字段类型：CharField
    # blank=True: 允许在表单中留空
    #       注意：blank 是 Django 表单验证层面的，不影响数据库。
    #       可选：如需数据库字段也允许 NULL，添加 null=True
    # 为什么 blank=True？因为简介可选，不是每篇文章都必须写。
    summary = models.CharField(
        blank=True,
        max_length=300
    )
    # 作用: 存储文章正文（长文本，支持 Markdown）。
    # 不需要 max_length，可存非常大的文本（数据库用 TEXT 类型）。
    content = models.TextField()
    # 作用：标记文章是否为草稿
    # default=True：新建文章时，默认是草稿。
    # 如果不设 default，Django 会要求必须提供值（否则迁移会失败）。
    # 数据库存储：SQLite 用 INTEGER（0/1），PostgreSQL 用 BOOLEAN。
    is_draft = models.BooleanField(default=True)
    # 作用：记录文章创建时间
    # auto_now_add=True：仅在第一次保存（创建）对象时自动设为当前时间。
    created_at = models.DateTimeField(auto_now_add=True)
    # 作用：记录文章最后修改时间
    # auto_now=True：每次保存对象时自动更新为当前时间。
    #       包括创建和修改。
    # 注意：如果用 save() 方法，这个字段会自动更新；但用 QuerySet.update() 则不会触发。
    updated_at = models.DateTimeField(auto_now=True)
    # 作用：建立多对一关系 —— 多篇文章可以属于同一个用户。
    # 字段类型：ForeignKey （外键）
    # User: Django 内置的用户模型，储存在 auth_user 表中。
    # on_delete=models.CASCADE: 如果用户被删除，相关的文章也会被删除
    #      其他选项： 
    #      PROTECT： 禁止删除用户（如果有文章）
    #      SET_NULL：用户删除后，文章作者设为 NULL（需加 null=True）
    # 数据库表现：在 blog_post 表中加一列 author_id（整数，指向 auth_user.id）
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    # 作用：一篇文章属于一个分类（可选）
    # - ForeignKey: 一对多关系
    # - null=True, blank=True: 允许文章没有分类
    # - on_delete=models.SET_NULL: 删除分类时，文章分类置空（不删除文章）
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="分类"
    )

    # 作用：一篇文章可以有多个标签
    # - ManyToManyField: 多对多关系
    # - blank=True: 允许文章没有标签
    tags = models.ManyToManyField(
        Tag,
        blank=True,
        verbose_name="标签"
    )

    # 作用：定义对象的字符串表示
    # 效果：在 Admin 的文章列表里，会看到文章标题，而不是“Post object”。
    # 为什么需要？
    # 方便调试和管理后台查看对象。
    # 在 Django Admin、日志、调试时，Django 需要知道如何显示这个对象。
    # 如果不写，会显示 <Post object (1)>，不直观。
    def __str__(self) -> str:
        # 返回文章标题作为字符串表示
        return self.title