from django.contrib import admin
from .models import Product, MortgageProduct, InsuranceProduct

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'product_type', 'price', 'is_active')
    list_filter = ('is_active', 'product_type')
    search_fields = ('name',)

@admin.register(MortgageProduct)
class MortgageProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'interest_rate', 'loan_term_years', 'is_active')
    search_fields = ('name',)

@admin.register(InsuranceProduct)
class InsuranceProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'policy_type', 'coverage_amount', 'is_active')
    list_filter = ('policy_type',)
    search_fields = ('name',)
