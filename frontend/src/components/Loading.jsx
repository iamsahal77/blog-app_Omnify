import React from 'react';

const Loading = ({ message = "Loading..." }) => {
    return (
        <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-gray-600">{message}</p>
            </div>
        </div>
    );
};

export default Loading; 