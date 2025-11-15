from django.apps import AppConfig
from django.urls import register_converter
from .converters import UnicodeSlugConverter


class BlogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blog'

    def ready(self):
        register_converter(UnicodeSlugConverter, 'unicode_slug')
