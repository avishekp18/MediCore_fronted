// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import "../App.css"; // Spinner styles

const AuthContext = createContext();

const backendURL = "https://medicore-backend-sv2c.onrender.com";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const cached = localStorage.getItem("user");
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("user"));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Configure axios defaults once
    useEffect(() => {
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = backendURL;
        axios.defaults.headers.common["Content-Type"] = "application/json";
    }, []);

    /**
     * Fetch the authenticated user's profile.
     * Runs silently on mount and after login.
     */
    const fetchMe = useCallback(async () => {
        try {
            const res = await axios.get("/api/v1/user/patient/me");
            setUser(res.data.user);
            setIsAuthenticated(true);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            setError(null);
        } catch (err) {
            console.warn("User session not valid:", err?.response?.status);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user");
        }
    }, []);

    /**
     * Silent background refresh every 15 minutes (optional)
     * Helps keep session alive without re-login.
     */
    useEffect(() => {
        fetchMe(); // Run on mount
        const interval = setInterval(fetchMe, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchMe]);

    /**
     * Login
     */
    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            await axios.post("/api/v1/user/login", credentials);
            await fetchMe();
            window.dispatchEvent(new Event("authChanged"));
        } catch (err) {
            console.error("Login failed:", err);
            setError(err?.response?.data?.message || "Login failed. Please try again.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logout
     */
    const logout = async () => {
        try {
            await axios.get("/api/v1/user/patient/logout");
        } catch (err) {
            console.warn("Logout error:", err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("user");
            window.dispatchEvent(new Event("authChanged"));
        }
    };

    /**
     * Global Axios interceptor for 401 auto-logout
     */
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => axios.interceptors.response.eject(interceptor);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                error,
                login,
                logout,
                refetch: fetchMe,
            }}
        >
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
