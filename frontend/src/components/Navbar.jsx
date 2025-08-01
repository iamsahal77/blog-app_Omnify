import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Placeholder for auth state

    return (
        <nav className="bg-white shadow-md fixed w-full z-20 top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-8.994l11.494 5.996M17.747 6.253L6.253 12.249" />
                            </svg>
                            <span className="text-2xl font-bold text-gray-800">Blogify</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                            <Link to="/blog" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Blog</Link>
                            <Link to="/about" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">About</Link>
                            <Link to="/contact" className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Contact</Link> 

                        </div>
                    </div>
                    <div className="hidden md:block">
                        {isLoggedIn ? (
                             <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">Logout</button>
                        ) : (
                            <div className="flex items-center gap-x-2">
                                <Link to="/login" className="text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium">Log In</Link>
                                <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Sign Up</Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>}
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
                    </div>
                     <div className="pt-4 pb-3 border-t border-gray-200">
                        {isLoggedIn ? (
                             <div className="px-2">
                                <button className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300">Logout</button>
                             </div>
                        ) : (
                            <div className="px-2 space-y-2">
                                <Link to="/login" className="block w-full text-center bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200">Log In</Link>
                                <Link to="/signup" className="block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};
export default Navbar;