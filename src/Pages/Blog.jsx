// src/pages/Blog.jsx
import React from "react";
import { blogPosts } from "../data/blogPosts.js"; // make sure to export your array

const Blog = () => {
    return (
        <div className="bg-gray-50 min-h-screen py-24">
            {/* Page Header */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                    Our Health Articles
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Stay informed with expert insights, health tips, and patient stories
                    from MediCore Medical Institute.
                </p>
            </section>

            {/* Blog Cards */}
            <section className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <a
                            key={post.id}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden group"
                        >
                            <div className="overflow-hidden rounded-t-2xl">
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 mb-4">{post.snippet}</p>
                                <span className="inline-block px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
                                    Read More
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Blog;
