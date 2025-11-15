# Serializer (序列化器)
# 作用：将复杂数据类型（如查询集和模型实例）转换为Python数据类型，以便轻松地渲染为JSON、XML或其他内容类型。
#      还可以将解析后的数据反序列化为复杂数据类型，以便进行验证和保存。
#      简单来说：Serializer 负责在“Python 对象（Django 模型）”和“JSON 数据”之间双向转换： 
#      序列化（Serialize）：模型 → JSON（用于 API 响应）
#      反序列化（Deserialize）：JSON → 模型（用于 API 接收数据，如创建文章）

# 这里是导入 DRF 的“API 字段”。
# 这些字段定义了如何处理不同类型的数据。
# 为什么需要：DRF 提供了多种序列化器基类（如 ModelSerializer, Serializer），所有字段类型（CharField, SlugField 等）也来自这里。
from rest_framework import serializers
from django.contrib.auth.models import User
from . import models

# 当需要完整User信息的时候使用此序列化器
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User;
        fields = [
            'id',
            'username',
            'email',
            ];

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = [
            'id',
            'name',
            'description'
        ]

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Tag
        fields = [
            'id',
            'name'
        ]

# PostList 用户信息用序列化器
class AuthorPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User;
        fields = ['username'];

# 定义一个 PostListSerializer 类，继承自 serializers.ModelSerializer
# 继承关系：
#   serializers.ModelSerializer 是 DRF 提供的一个方便的序列化器基类，
#   它能自动根据模型字段生成对应的序列化字段（减少重复代码）
# 命名含义：
# PostList：表示这是用于“文章列表”的序列化器
# Serializer：表明它是序列化器
class PostListSerializer(serializers.ModelSerializer):
    # 定义一个序列化字段，名为 author（前端 JSON 中的键名）
    # serializers.CharField(...): 指定该字段在 JSON 中是string类型
    # source='author.username'
    #   author: Post 模型中的外键字段，关联 User 模型
    #   .username：通过外键访问关联的 User 模型的 username 字段
    # 效果：当 DRF 序列化一个 Post 对象时，会执行：
    #   post.author.username → 得到字符串（如 "jayden"）→ 放入 JSON 的 "author" 字段
    # 注意：如果不写 source，DRF 会尝试直接访问 post.author（这是一个 User 对象），无法直接转为 JSON。
    # read_only=True：表示这个字段只能输出（序列化），不能输入（反序列化）。防止前端伪造作者名
    # author = serializers.CharField(source='author.username', read_only=True)
    author = AuthorPostListSerializer(read_only=True)
    # 显式声明 slug 字段的类型。
    # 虽然 ModelSerializer 会自动推断 slug 为 SlugField，但显式写出更清晰、可控。
    # 未来如果要加验证（如 allow_unicode=True），也方便扩展
    # SlugField 特点：DRF 会自动验证它是否符合 slug 格式（字母、数字、连字符、下划线）
    slug = serializers.SlugField(allow_unicode=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    # 这是 ModelSerializer 的配置区域，告诉 DRF 如何从模型生成序列化器。
    class Meta:
        # 指定这个序列化器对应的 Django 模型是 Post
        # 这样 DRF 会自动读取 Post 的所有字段，并生成默认序列化字段
        model = models.Post
        # 指定要包含哪些字段在序列化输出中
        # 为什么不用 __all__？
        #   安全：避免意外暴露敏感字段（如 is_draft, updated_at）
        #   精简：列表页不需要 content，节省带宽
        fields = [
            'id',
            'title',
            'slug',
            'summary',
            'created_at',
            'author',
            'category',
            'tags'
        ]

# 文章详情页作者信息用序列化器
class AuthorPostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User;
        fields = ['username'];

# 文章详情序列化器
class PostDetailSerializer(serializers.ModelSerializer):
    author = AuthorPostDetailSerializer(read_only=True)
    # 显式声明 slug 字段的类型。
    slug = serializers.SlugField(allow_unicode=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    class Meta:
        model = models.Post
        fields = [
            'id',
            'title',
            'author',
            'slug',
            'summary',
            'content',
            'created_at',
            'updated_at',
            'category',
            'tags'
        ]