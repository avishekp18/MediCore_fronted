import React, { useEffect } from "react";
import { motion } from "framer-motion";

const SmallLoader = () => {
    useEffect(() => {
        // Optionally animate the top bar width
    }, []);

    return (
        <>
            {/* Overlay spinner */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50"
            >
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </motion.div>

            {/* Top progress bar */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                exit={{ width: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="fixed top-0 left-0 h-1 bg-indigo-600 z-50"
            />
        </>
    );
};

export default SmallLoader;
