import React from "react";

const HomeSkeleton = () => {
    return (
        <div className="animate-pulse">
            {/* Navbar placeholder */}
            <div className="w-full h-16 bg-gray-200"></div>

            {/* Hero section */}
            <section className="bg-gray-50 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-16 gap-10">
                <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-6 bg-gray-200 rounded w-4/5"></div>
                    <div className="mt-6 h-12 w-40 bg-gray-300 rounded-xl"></div>
                </div>
                <div className="flex-1 h-64 bg-gray-200 rounded-3xl"></div>
            </section>

            {/* Departments section */}
            <section className="px-6 md:px-20 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="h-48 bg-gray-200 rounded-2xl shadow-sm"
                    ></div>
                ))}
            </section>

            {/* Message form section */}
            <section className="px-6 md:px-20 py-10">
                <div className="max-w-2xl mx-auto space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-40 bg-gray-100 rounded-2xl"></div>
                    <div className="h-10 bg-gray-300 rounded-xl w-32 mx-auto"></div>
                </div>
            </section>

            {/* Footer placeholder */}
            <footer className="w-full h-16 bg-gray-200"></footer>
        </div>
    );
};

export default HomeSkeleton;
