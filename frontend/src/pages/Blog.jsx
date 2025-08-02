// Blog page component with search functionality and post listing
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import { blogAPI } from '../services/api';

const Blog = () => {
    // Search state for filtering blog posts
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [totalPosts, setTotalPosts] = useState(0);
    const postsPerPage = 6;

    // Fetch blog posts from API
    const fetchPosts = async (page = 1, search = '') => {
        try {
            setLoading(true);
            setError('');
            
            const params = {
                page: page,
                page_size: postsPerPage,
            };
            
            if (search) {
                params.search = search;
            }
            
            const response = await blogAPI.getPosts(params);
            setPosts(response.data.results || response.data);
            setTotalPosts(response.data.count || response.data.length);
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError('Failed to load blog posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load posts on component mount and when search/page changes
    useEffect(() => {
        fetchPosts(currentPage, searchTerm);
    }, [currentPage, searchTerm]);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle search with debounce
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page header with title and description */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover insights, tutorials, and stories about technology, development, and everything in between.
                    </p>
                </div>

                {/* Search functionality for filtering posts */}
                <div className="max-w-md mx-auto mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-gray-600">Loading posts...</p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                        <button 
                            onClick={() => fetchPosts(currentPage, searchTerm)}
                            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Results count */}
                {!loading && !error && (
                    <div className="text-center mb-6">
                        <p className="text-gray-600">
                            Showing {posts.length} of {totalPosts} articles
                            {searchTerm && ` for "${searchTerm}"`}
                        </p>
                    </div>
                )}

                {/* Responsive grid layout for blog posts */}
                {!loading && !error && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {post.image && (
                                    <img 
                                        src={post.image} 
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-600">{post.category}</span>
                                        <span className="text-sm text-gray-500">{post.read_time}</span>
                                    </div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {post.author?.username || post.author?.first_name || 'Anonymous'}
                                                </p>
                                                <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                                            </div>
                                        </div>
                                        <Link 
                                            to={`/post/${post.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                        >
                                            Read more →
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* No results message */}
                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No articles found matching your search.</p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPosts > postsPerPage && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(totalPosts / postsPerPage)}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Blog; 