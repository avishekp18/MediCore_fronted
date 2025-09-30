// src/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Run once on app load
    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await axios.get("/api/v1/user/patient/me", {
                    withCredentials: true,
                });
                setUser(res.data.user);
                setIsAuthenticated(true);
            } catch {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Call this after successful login
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await axios.get("/api/v1/user/patient/logout", {
                withCredentials: true,
            });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
            {loading ? (
                <div className="flex items-center justify-center h-screen">
                    <p className="text-lg font-semibold">Loading...</p>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
