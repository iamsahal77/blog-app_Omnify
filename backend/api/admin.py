from django.contrib import admin
from .models import BlogPost, UserProfile


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'created_at', 'published']
    list_filter = ['category', 'published', 'created_at', 'author']
    search_fields = ['title', 'content', 'author__username']
    list_editable = ['published']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'content', 'excerpt', 'category')
        }),
        ('Author & Status', {
            'fields': ('author', 'published')
        }),
        ('Media', {
            'fields': ('image',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'get_full_name', 'created_at']
    search_fields = ['user__username', 'user__email', 'bio']
    list_filter = ['created_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()
    get_full_name.short_description = 'Full Name'
