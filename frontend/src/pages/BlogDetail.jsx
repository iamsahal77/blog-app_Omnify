// Blog detail page showing full blog content
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await blogAPI.getPost(id);
                const fetchedPost = response.data;
                setPost(fetchedPost);
                
                // Check if current user is the author
                if (user && fetchedPost.author) {
                    setIsAuthor(user.id === fetchedPost.author.id || user.username === fetchedPost.author.username);
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                if (err.response?.status === 404) {
                    setError('Blog post not found');
                } else {
                    setError('Failed to load blog post. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id, user]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await blogAPI.deletePost(id);
                navigate('/blog');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete blog post. Please try again.');
            }
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600">Loading blog post...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to="/blog" className="text-indigo-600 hover:text-indigo-800">
                        ← Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back to Blog Link */}
                <div className="mb-6">
                    <Link 
                        to="/blog" 
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Blog
                    </Link>
                </div>

                {/* Blog Post Header */}
                <article className="bg-white rounded-lg shadow-md overflow-hidden">
                    {post.image && (
                        <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-64 md:h-80 object-cover"
                        />
                    )}
                    
                    <div className="p-6 md:p-8">
                        {/* Post Meta */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                {post.category}
                            </span>
                            <span className="text-sm text-gray-500">{post.read_time}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {post.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
                            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                            <div>
                                <p className="font-medium text-gray-900">
                                    {post.author?.username || post.author?.first_name || 'Anonymous'}
                                </p>
                                <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                            </div>
                            
                            {/* Author Actions */}
                            {isAuthor && (
                                <div className="ml-auto flex space-x-2">
                                    <Link
                                        to={`/edit/${post.id}`}
                                        className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                                {post.content}
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default BlogDetail; 