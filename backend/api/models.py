from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.urls import reverse


class BlogPost(models.Model):
    """Blog post model with title, content, and author"""
    
    CATEGORY_CHOICES = [
        ('Technology', 'Technology'),
        ('Lifestyle', 'Lifestyle'),
        ('Programming', 'Programming'),
        ('Design', 'Design'),
        ('Business', 'Business'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    excerpt = models.TextField(max_length=500, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Technology')
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Blog Post'
        verbose_name_plural = 'Blog Posts'
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        # Auto-generate excerpt if not provided
        if not self.excerpt and self.content:
            self.excerpt = self.content[:200] + '...' if len(self.content) > 200 else self.content
        super().save(*args, **kwargs)
    
    def get_absolute_url(self):
        return reverse('blog-detail', kwargs={'pk': self.pk})
    
    @property
    def read_time(self):
        """Calculate estimated read time (words per minute = 200)"""
        word_count = len(self.content.split())
        minutes = max(1, round(word_count / 200))
        return f"{minutes} min read"
    
    @property
    def formatted_date(self):
        """Return formatted date"""
        return self.created_at.strftime("%B %d, %Y")


class UserProfile(models.Model):
    """Extended user profile model"""
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def get_full_name(self):
        return self.user.get_full_name() or self.user.username
