import React from 'react';


const Newsletter = () => (
    <div className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
            <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Want product news and updates?
                </h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
                    Sign up for our newsletter to stay up to date.
                </p>
            </div>
            <div className="mt-10 w-full max-w-md lg:mt-0 lg:w-full lg:max-w-sm">
                <form className="sm:flex">
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full rounded-md border-0 bg-white px-4 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                        placeholder="Enter your email"
                    />
                    <button
                        type="submit"
                        className="mt-3 w-full flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                    >
                        Notify me
                    </button>
                </form>
                 <p className="mt-4 text-sm leading-6 text-gray-500">
                    We care about your data. Read our{' '}
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                        privacy&nbsp;policy
                    </a>.
                </p>
            </div>
        </div>
    </div>
);

export default Newsletter;