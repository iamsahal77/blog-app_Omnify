from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

app_name = 'api'

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoints
    path('profile/', views.UserProfileView.as_view(), name='profile'),
    
    # Blog post endpoints
    path('posts/', views.BlogPostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', views.BlogPostDetailView.as_view(), name='post-detail'),
    path('posts/user/<str:username>/', views.UserBlogPostsView.as_view(), name='user-posts'),
    path('posts/my/', views.my_posts, name='my-posts'),
    
    # Search and utility endpoints
    path('search/', views.search_posts, name='search-posts'),
    path('categories/', views.get_categories, name='categories'),
] 