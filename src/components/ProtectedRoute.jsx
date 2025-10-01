import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const hasToastShown = useRef(false);

    useEffect(() => {
        if (!isAuthenticated && !hasToastShown.current) {
            toast.info("Please log in first to access this page");
            hasToastShown.current = true;
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
