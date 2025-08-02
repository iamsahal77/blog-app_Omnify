import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-8.994l11.494 5.996M17.747 6.253L6.253 12.249" />
                        </svg>
                        <span className="text-lg font-semibold text-gray-900">Blogify</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">&copy; 2025 All rights reserved.</span>
                    </div>

                </div>
            </div>
        </footer>
    );
};

export default Footer;