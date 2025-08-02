// Blog page component with search functionality and post listing
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

const Blog = () => {
    // Search state for filtering blog posts
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    // Sample blog posts data - TODO: Replace with API call
    const blogPosts = [
        {
            id: 1,
            title: "Getting Started with React and Tailwind CSS",
            excerpt: "Learn how to build modern web applications using React and Tailwind CSS. This comprehensive guide covers everything from setup to deployment.",
            author: "John Doe",
            date: "January 15, 2025",
            category: "Technology",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"
        },
        {
            id: 2,
            title: "The Future of Web Development in 2025",
            excerpt: "Explore the latest trends and technologies that are shaping the future of web development, from AI integration to new frameworks.",
            author: "Jane Smith",
            date: "January 12, 2025",
            category: "Technology",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop"
        },
        {
            id: 3,
            title: "10 Productivity Tips for Developers",
            excerpt: "Boost your productivity with these proven techniques and tools that every developer should know about.",
            author: "Mike Johnson",
            date: "January 10, 2025",
            category: "Lifestyle",
            readTime: "6 min read",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"
        },
        {
            id: 4,
            title: "Building Responsive Websites with CSS Grid",
            excerpt: "Master CSS Grid layout and create beautiful, responsive websites that work perfectly on all devices.",
            author: "Sarah Wilson",
            date: "January 8, 2025",
            category: "Technology",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
        },
        {
            id: 5,
            title: "JavaScript Best Practices for 2025",
            excerpt: "Discover the latest JavaScript best practices and patterns that will make your code more maintainable and efficient.",
            author: "Alex Brown",
            date: "January 6, 2025",
            category: "Programming",
            readTime: "9 min read",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop"
        },
        {
            id: 6,
            title: "The Art of Code Review",
            excerpt: "Learn how to conduct effective code reviews that improve code quality and team collaboration.",
            author: "Emily Davis",
            date: "January 4, 2025",
            category: "Programming",
            readTime: "4 min read",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop"
        },
        {
            id: 7,
            title: "Design Systems for Modern Web Apps",
            excerpt: "Build scalable design systems that ensure consistency and improve development efficiency.",
            author: "Chris Wilson",
            date: "January 2, 2025",
            category: "Design",
            readTime: "7 min read",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop"
        },
        {
            id: 8,
            title: "Microservices Architecture Patterns",
            excerpt: "Explore different microservices patterns and learn when to use each one for optimal system design.",
            author: "David Lee",
            date: "December 30, 2024",
            category: "Technology",
            readTime: "10 min read",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop"
        }
    ];

    // Filter posts based on search term
    const filteredPosts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = filteredPosts.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Reset to first page when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Results count */}
                <div className="text-center mb-6">
                    <p className="text-gray-600">
                        Showing {currentPosts.length} of {filteredPosts.length} articles
                        {searchTerm && ` for "${searchTerm}"`}
                    </p>
                </div>

                {/* Responsive grid layout for blog posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentPosts.map((post) => (
                        <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <img 
                                src={post.image} 
                                alt={post.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-blue-600">{post.category}</span>
                                    <span className="text-sm text-gray-500">{post.readTime}</span>
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
                                            <p className="text-sm font-medium text-gray-900">{post.author}</p>
                                            <p className="text-xs text-gray-500">{post.date}</p>
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

                {/* No results message */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No articles found matching your search.</p>
                    </div>
                )}

                {/* Pagination */}
                {filteredPosts.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Blog; 