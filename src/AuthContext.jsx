// src/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const backendURL = "https://medicore-backend-sv2c.onrender.com";

    // ✅ Fetch current user (used on mount + after login)
    const fetchMe = useCallback(async () => {
        try {
            const res = await axios.get(`${backendURL}/api/v1/user/patient/me`, {
                withCredentials: true,
            });
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    // Restore session on mount
    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    // ✅ Login: only sets cookie, then fetches canonical user
    const login = async (credentials) => {
        await axios.post(`${backendURL}/api/v1/user/login`, credentials, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });

        // After successful login → fetch canonical user
        await fetchMe();

        // Dispatch event (if you want non-React listeners to know)
        window.dispatchEvent(new Event("authChanged"));
    };

    // ✅ Logout: clear cookie + state
    const logout = async () => {
        try {
            await axios.get(`${backendURL}/api/v1/user/patient/logout`, {
                withCredentials: true,
            });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            window.dispatchEvent(new Event("authChanged"));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
