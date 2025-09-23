import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create context
const AuthContext = createContext();

// Global Axios settings
axios.defaults.withCredentials = true; // always send cookies

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const res = await axios.get(
                    "https://medicore-backend-sv2c.onrender.com/api/v1/user/patient/me",
                    { withCredentials: true }
                );

                if (res.data.user) {
                    setUser(res.data.user);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (err) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const res = await axios.post(
                "https://medicore-backend-sv2c.onrender.com/api/v1/user/login",
                { email, password },
                { withCredentials: true }
            );

            setUser(res.data.user);
            setIsAuthenticated(true);
            return { success: true };
        } catch (err) {
            return { success: false, message: err?.response?.data?.message || "Login failed" };
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await axios.get(
                "https://medicore-backend-sv2c.onrender.com/api/v1/user/patient/logout",
                { withCredentials: true }
            );
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
