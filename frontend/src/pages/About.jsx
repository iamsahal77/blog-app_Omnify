import React from 'react';

const About = () => {
    const teamMembers = [
        {
            name: "John Doe",
            role: "Founder & CEO",
            bio: "Passionate about technology and creating meaningful content that helps developers grow.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
        },
        {
            name: "Jane Smith",
            role: "Lead Developer",
            bio: "Full-stack developer with expertise in React, Node.js, and modern web technologies.",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
        },
        {
            name: "Mike Johnson",
            role: "Content Strategist",
            bio: "Creating engaging content that bridges the gap between complex technology and everyday users.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        We're passionate about sharing knowledge, insights, and stories that inspire and educate the developer community.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                At Blogify, we believe that knowledge should be accessible to everyone. Our mission is to create a platform where developers, designers, and tech enthusiasts can share their experiences, learn from each other, and stay updated with the latest trends in technology.
                            </p>
                            <p className="text-lg text-gray-600">
                                Whether you're a seasoned professional or just starting your journey in tech, our blog provides valuable insights, tutorials, and real-world experiences to help you grow and succeed.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white">
                            <h3 className="text-2xl font-bold mb-4">What We Do</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Share expert insights and tutorials
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Cover latest tech trends
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Build a supportive community
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Provide practical solutions
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                                <img 
                                    src={member.image} 
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                                />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
                            <p className="text-gray-600">Articles Published</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
                            <p className="text-gray-600">Monthly Readers</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                            <p className="text-gray-600">Expert Contributors</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 