from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import BlogPost, UserProfile


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'avatar', 'website', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        # Set default values for first_name and last_name if not provided
        if not validated_data.get('first_name'):
            validated_data['first_name'] = ''
        if not validated_data.get('last_name'):
            validated_data['last_name'] = ''
        user = User.objects.create_user(**validated_data)
        # Create user profile
        UserProfile.objects.create(user=user)
        return user


class BlogPostSerializer(serializers.ModelSerializer):
    """Serializer for BlogPost model"""
    
    author = UserSerializer(read_only=True)
    read_time = serializers.ReadOnlyField()
    formatted_date = serializers.ReadOnlyField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'content', 'excerpt', 'author', 'category', 
            'image', 'created_at', 'updated_at', 'published', 
            'read_time', 'formatted_date'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at', 'read_time', 'formatted_date']
    
    def create(self, validated_data):
        # Set the author to the current user
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class BlogPostListSerializer(serializers.ModelSerializer):
    """Serializer for blog post listing (with limited fields)"""
    
    author = serializers.SerializerMethodField()
    read_time = serializers.ReadOnlyField()
    formatted_date = serializers.ReadOnlyField()
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'excerpt', 'author', 'category', 
            'image', 'created_at', 'read_time', 'formatted_date'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'read_time', 'formatted_date']
    
    def get_author(self, obj):
        return {
            'id': obj.author.id,
            'username': obj.author.username,
            'first_name': obj.author.first_name,
            'last_name': obj.author.last_name,
        } 