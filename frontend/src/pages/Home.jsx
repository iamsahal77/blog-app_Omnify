// Home page component with hero section and featured posts
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import ApiTest from '../components/ApiTest';

// Hero section component with main call-to-action
const Hero = () => (
    <div className="bg-white">
        <div className="max-w-7xl mx-auto pt-24 sm:pt-32 lg:pt-40 px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Insights and Ideas for the Modern Developer </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">Your daily dose of programming tutorials, web development trends, and software engineering best practices.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to="/blog" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 mb-6">Start Reading</Link>
            </div>
        </div>
    </div>
);

// Featured posts section component
const FeaturedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeaturedPosts = async () => {
            try {
                setLoading(true);
                // Fetch latest 3 posts for featured section
                const response = await blogAPI.getPosts({ page_size: 3 });
                setPosts(response.data.results || response.data);
            } catch (error) {
                console.error('Error fetching featured posts:', error);
                setError('Failed to load featured posts');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedPosts();
    }, []);

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
        <div className="bg-gray-100 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Featured Blog Posts</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">Explore the latest articles on React, Django, and more.</p>
                </div>
                
                {loading && (
                    <div className="mt-16 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        <p className="mt-2 text-gray-600">Loading featured posts...</p>
                    </div>
                )}

                {error && (
                    <div className="mt-16 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                                        {post.title}
                                    </h3>
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

                {!loading && !error && posts.length === 0 && (
                    <div className="mt-16 text-center">
                        <p className="text-gray-500">No posts available yet.</p>
                        <Link 
                            to="/blog" 
                            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            View all posts →
                        </Link>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <div className="mt-12 text-center">
                        <Link 
                            to="/blog" 
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            View All Posts
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const Home = () => (
    <>
        <ApiTest />
        <Hero />
        <FeaturedPosts />
    </>
);

export default Home;

