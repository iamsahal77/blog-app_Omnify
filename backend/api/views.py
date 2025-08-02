from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import BlogPost, UserProfile
from .serializers import (
    UserSerializer, UserProfileSerializer, RegisterSerializer,
    BlogPostSerializer, BlogPostListSerializer
)


class RegisterView(generics.CreateAPIView):
    """User registration view"""
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """User profile view"""
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_object(self):
        return self.request.user.profile


class BlogPostListCreateView(generics.ListCreateAPIView):
    """List and create blog posts"""
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'excerpt', 'category']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = BlogPost.objects.filter(published=True)
        
        # Filter by category if provided
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by author if provided
        author = self.request.query_params.get('author', None)
        if author:
            queryset = queryset.filter(author__username=author)
        
        return queryset
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BlogPostListSerializer
        return BlogPostSerializer
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class BlogPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, and delete blog posts"""
    queryset = BlogPost.objects.filter(published=True)
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_object(self):
        obj = get_object_or_404(BlogPost, pk=self.kwargs['pk'], published=True)
        
        # Check if user can edit/delete this post
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj.author != self.request.user:
                raise permissions.PermissionDenied("You can only edit your own posts.")
        
        return obj


class UserBlogPostsView(generics.ListAPIView):
    """Get blog posts by specific user"""
    serializer_class = BlogPostListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        username = self.kwargs['username']
        return BlogPost.objects.filter(
            author__username=username, 
            published=True
        ).order_by('-created_at')


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def search_posts(request):
    """Search blog posts"""
    query = request.query_params.get('q', '')
    if not query:
        return Response({'results': []})
    
    posts = BlogPost.objects.filter(
        Q(title__icontains=query) |
        Q(content__icontains=query) |
        Q(excerpt__icontains=query) |
        Q(category__icontains=query),
        published=True
    ).order_by('-created_at')
    
    serializer = BlogPostListSerializer(posts, many=True)
    return Response({'results': serializer.data})


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_categories(request):
    """Get all available categories"""
    categories = BlogPost.objects.filter(published=True).values_list('category', flat=True).distinct()
    return Response({'categories': list(categories)})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_posts(request):
    """Get current user's posts"""
    posts = BlogPost.objects.filter(author=request.user).order_by('-created_at')
    serializer = BlogPostSerializer(posts, many=True)
    return Response(serializer.data)
