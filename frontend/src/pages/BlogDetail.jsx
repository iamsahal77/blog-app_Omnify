// Blog detail page showing full blog content
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthor, setIsAuthor] = useState(false); // TODO: Get from auth context

    // Sample blog post data - TODO: Replace with API call
    const samplePosts = [
        {
            id: 1,
            title: "Getting Started with React and Tailwind CSS",
            content: `React and Tailwind CSS are two powerful tools that have revolutionized modern web development. In this comprehensive guide, we'll explore how to combine these technologies to create beautiful, responsive web applications.

## Why React and Tailwind CSS?

React provides a component-based architecture that makes building user interfaces efficient and maintainable. When combined with Tailwind CSS, you get a utility-first CSS framework that allows for rapid UI development without leaving your HTML.

## Setting Up Your Project

First, let's create a new React project using Vite:

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
\`\`\`

Next, install Tailwind CSS:

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

## Configuration

Update your \`tailwind.config.js\`:

\`\`\`javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
\`\`\`

## Building Your First Component

Here's a simple example of a React component using Tailwind CSS:

\`\`\`jsx
function Card({ title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
\`\`\`

## Best Practices

1. **Component Structure**: Keep your components small and focused
2. **Utility Classes**: Use Tailwind's utility classes for consistent styling
3. **Responsive Design**: Leverage Tailwind's responsive prefixes
4. **Custom Components**: Create reusable components for common patterns

## Conclusion

React and Tailwind CSS work together seamlessly to create modern, maintainable web applications. The combination of React's component system and Tailwind's utility-first approach provides developers with a powerful toolkit for building user interfaces.

Start experimenting with these technologies today and see how they can improve your development workflow!`,
            author: "John Doe",
            date: "January 15, 2025",
            category: "Technology",
            readTime: "5 min read",
            image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop"
        },
        {
            id: 2,
            title: "The Future of Web Development in 2025",
            content: `The web development landscape is constantly evolving, and 2025 promises to bring exciting new technologies and methodologies. Let's explore what the future holds for developers.

## Emerging Technologies

### AI-Powered Development
Artificial Intelligence is transforming how we write code. From intelligent code completion to automated testing, AI tools are becoming an integral part of the development workflow.

### WebAssembly (WASM)
WebAssembly continues to gain traction, enabling high-performance applications to run in the browser. This technology bridges the gap between web and native performance.

### Edge Computing
With the rise of edge computing, applications are moving closer to users, reducing latency and improving performance. This shift is changing how we architect web applications.

## Framework Evolution

Modern frameworks are focusing on:
- **Performance**: Faster rendering and smaller bundle sizes
- **Developer Experience**: Better tooling and debugging capabilities
- **Accessibility**: Built-in accessibility features
- **SEO**: Improved search engine optimization

## The Rise of JAMstack

JAMstack (JavaScript, APIs, and Markup) continues to grow in popularity due to its:
- **Performance**: Pre-built static assets
- **Security**: Reduced attack surface
- **Scalability**: CDN-based delivery
- **Developer Experience**: Modern development workflow

## Conclusion

The future of web development is bright, with new technologies making it easier to build fast, secure, and user-friendly applications. Stay curious and keep learning!`,
            author: "Jane Smith",
            date: "January 12, 2025",
            category: "Technology",
            readTime: "8 min read",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop"
        }
    ];

    useEffect(() => {
        // Simulate API call to fetch blog post
        const fetchPost = async () => {
            setLoading(true);
            try {
                // TODO: Replace with actual API call
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const foundPost = samplePosts.find(p => p.id === parseInt(id));
                if (foundPost) {
                    setPost(foundPost);
                    // TODO: Check if current user is the author
                    setIsAuthor(foundPost.author === "John Doe"); // Temporary check
                } else {
                    setError('Blog post not found');
                }
            } catch (err) {
                setError('Failed to load blog post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                // TODO: Replace with actual API call
                console.log('Deleting post:', id);
                await new Promise(resolve => setTimeout(resolve, 500));
                navigate('/blog');
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
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
                    <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-64 md:h-80 object-cover"
                    />
                    
                    <div className="p-6 md:p-8">
                        {/* Post Meta */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                {post.category}
                            </span>
                            <span className="text-sm text-gray-500">{post.readTime}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {post.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
                            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                            <div>
                                <p className="font-medium text-gray-900">{post.author}</p>
                                <p className="text-sm text-gray-500">{post.date}</p>
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