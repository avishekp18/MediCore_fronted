import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, toastMessage }) => {
    const { isAuthenticated } = useAuth();
    const hasToastShown = useRef(false);

    useEffect(() => {
        if (!isAuthenticated && toastMessage && !hasToastShown.current) {
            toast.info(toastMessage); // Show custom toast
            hasToastShown.current = true;
        }
    }, [isAuthenticated, toastMessage]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
