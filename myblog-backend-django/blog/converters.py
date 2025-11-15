class UnicodeSlugConverter:
    """
    自定义路径转换器，将字符串转换为 Unicode 友好的 slug。
    允许中文、日文等非 ASCII 字符。
    """

    regex = r'[-\w]+'

    def to_python(self, value):
        return value

    def to_url(self, value):
        return value