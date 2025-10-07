// src/AuthContext.jsx
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import "./App.css"; // We'll create this CSS file for the spinner animation

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const backendURL = "https://medicore-backend-sv2c.onrender.com";

    const fetchMe = useCallback(async () => {
        setLoading(true);
        try {
            // Try fetching patient info
            let res = await axios.get(`${backendURL}/api/v1/user/patient/me`, {
                withCredentials: true,
            });
            setUser(res.data.user);
            setIsAuthenticated(true);
        } catch (errPatient) {
            try {
                // If patient fetch fails, try admin
                let res = await axios.get(`${backendURL}/api/v1/user/admin/me`, {
                    withCredentials: true,
                });
                setUser(res.data.user);
                setIsAuthenticated(true);
            } catch (errAdmin) {
                setUser(null);
                setIsAuthenticated(false);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    const login = async (credentials) => {
        await axios.post(`${backendURL}/api/v1/user/login`, credentials, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        await fetchMe();
        window.dispatchEvent(new Event("authChanged"));
    };

    const logout = async () => {
        try {
            if (user?.role === "Patient") {
                await axios.get(`${backendURL}/api/v1/user/patient/logout`, { withCredentials: true });
            } else if (user?.role === "Admin") {
                await axios.get(`${backendURL}/api/v1/user/admin/logout`, { withCredentials: true });
            }
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
