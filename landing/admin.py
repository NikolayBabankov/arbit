from django.contrib import admin
from landing.models import Article, Comment, Photo, Lead

class RelationshipInlineChara(admin.TabularInline):
    model = Photo
    extra = 1


# Register your models here.
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    pass

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    inlines = [RelationshipInlineChara,]

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    pass