import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Hero = () => (
    <div className="bg-white">
        <div className="max-w-7xl mx-auto pt-24 sm:pt-32 lg:pt-40 px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Insights and Ideas for the Modern Developer</h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">Your daily dose of programming tutorials, web development trends, and software engineering best practices.</p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to="/blog" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 mb-6">Start Reading</Link>
            </div>
        </div>
    </div>
);

const FeaturedPosts = () => (
    <div className="bg-gray-100 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">All Blog Posts</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">Explore articles on React, Django, and more.</p>
            </div>
            {/* Blog post listing will go here */}
            <div className="mt-16 text-center text-gray-500">
                 <p>Posts</p>
                 {/* We will add pagination controls here */}
            </div>
        </div>
    </div>
);

const HomePage = () => (
    <>
        <Hero />
        <FeaturedPosts />
    </>
);

export default HomePage;

