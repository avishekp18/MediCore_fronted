// src/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import "./App.css"; // Spinner CSS
import HomeSkeleton from "./Skeleton/HomeSkeleton";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Load cached user from localStorage if available
        const cached = localStorage.getItem("user");
        return cached ? JSON.parse(cached) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"));
    const [loading, setLoading] = useState(!user); // Only show spinner if no cached user

    const backendURL = "https://medicore-backend-sv2c.onrender.com";

    // Fetch current user from backend
    // const fetchMe = useCallback(async () => {
    //     try {
    //         const res = await axios.get(`${backendURL}/api/v1/user/patient/me`, {
    //             withCredentials: true, // Send JWT cookie
    //         });
    //         setUser(res.data.user);
    //         setIsAuthenticated(true);
    //         localStorage.setItem("user", JSON.stringify(res.data.user)); // Cache
    //     } catch (err) {
    //         setUser(null);
    //         setIsAuthenticated(false);
    //         localStorage.removeItem("user");
    //     } finally {
    //         setLoading(false);
    //     }
    // }, []);
    const fetchMe = useCallback(async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000); // 8s max wait

        try {
            const res = await axios.get(`${backendURL}/api/v1/user/patient/me`, {
                withCredentials: true,
                signal: controller.signal,
            });
            setUser(res.data.user);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (err) {
            console.log("FetchMe timeout or error:", err.message);
        } finally {
            clearTimeout(timeout);
            setLoading(false);
        }
    }, []);


    // Run fetchMe on mount
    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    // Login function
    const login = async (credentials) => {
        await axios.post(`${backendURL}/api/v1/user/login`, credentials, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        await fetchMe(); // Update user after login
        window.dispatchEvent(new Event("authChanged"));
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.get(`${backendURL}/api/v1/user/patient/logout`, { withCredentials: true });
            toast.success("Logged out successfully"); // Only here
        } catch (err) {
            console.error("Logout failed", err);
            toast.error("Logout failed");
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("authChanged"));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {loading ? <HomeSkeleton /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
