from django.db import models


class ProductCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Product Category"
        verbose_name_plural = "Product Categories"


class Product(models.Model):
    """
    Общая модель продукта. Может быть связана с ипотекой или страховкой.
    """
    name = models.CharField("Product Name", max_length=255)
    description = models.TextField(blank=True)
    provider = models.CharField("Provider", max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    category = models.ForeignKey(
        ProductCategory, related_name="products", on_delete=models.PROTECT
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
