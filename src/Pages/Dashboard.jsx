// src/components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Guard UI while auth provider boots
    if (loading)
        return (
            <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-700">
                Loading...
            </div>
        );
    if (!isAuthenticated)
        return (
            <div className="flex items-center justify-center h-screen text-lg text-red-600">
                Please log in
            </div>
        );

    // fetch appointments for the current user
    const fetchAppointments = useCallback(async () => {
        if (!user) return;
        setRefreshing(true);
        try {
            const { data } = await axios.get(
                `https://medicore-backend-sv2c.onrender.com/api/v1/appointment/user/${user._id}`,
                { withCredentials: true }
            );
            setAppointments(data.appointments || []);
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
            toast.error("Failed to fetch appointments");
        } finally {
            setRefreshing(false);
            setLoadingAppointments(false);
        }
    }, [user]);

    // initial fetch when user becomes available
    useEffect(() => {
        if (!user) return;
        setLoadingAppointments(true);
        fetchAppointments();
    }, [user, fetchAppointments]);

    // Listen for global appointmentCreated events and re-fetch
    useEffect(() => {
        const handler = () => {
            // re-fetch canonical data (safe)
            fetchAppointments();
        };
        window.addEventListener("appointmentCreated", handler);
        return () => window.removeEventListener("appointmentCreated", handler);
    }, [fetchAppointments]);

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-8c py-25">
            {/* User Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-2xl p-6 border border-blue-100 transition hover:shadow-xl">
                <h1 className="text-3xl font-bold mb-4 text-blue-800">Welcome, {user.firstName}!</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                    <p>
                        <span className="font-semibold">Role:</span> {user.role}
                    </p>
                    <p>
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p>
                        <span className="font-semibold">Phone:</span> {user.phone}
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow transition transform hover:-translate-y-1"
                >
                    Logout
                </button>
            </div>

            {/* Appointments Card */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100 transition hover:shadow-xl mt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Your Appointments</h2>
                    <button
                        onClick={fetchAppointments}
                        disabled={refreshing}
                        className={`px-4 py-2 rounded-full border border-gray-300 font-medium text-gray-700 transition ${refreshing ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                            }`}
                    >
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </div>

                {loadingAppointments ? (
                    <p className="text-gray-500">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                    <p className="text-gray-500">No appointments found.</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-sm tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 border-b">Date</th>
                                    <th className="px-4 py-3 border-b">Department</th>
                                    <th className="px-4 py-3 border-b">Doctor</th>
                                    <th className="px-4 py-3 border-b">Status</th>
                                    <th className="px-4 py-3 border-b">Visited</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((appt) => (
                                    <tr
                                        key={appt._id}
                                        className="hover:bg-blue-50 transition-colors even:bg-gray-50"
                                    >
                                        <td className="px-4 py-2 border-b">
                                            {appt.appointment_date
                                                ? new Date(appt.appointment_date).toLocaleDateString()
                                                : appt.appointmentDate
                                                    ? new Date(appt.appointmentDate).toLocaleDateString()
                                                    : "—"}
                                        </td>
                                        <td className="px-4 py-2 border-b">{appt.department}</td>
                                        <td className="px-4 py-2 border-b">
                                            {appt.doctor?.firstName} {appt.doctor?.lastName}
                                        </td>
                                        <td className="px-4 py-2 border-b">{appt.status ?? "Pending"}</td>
                                        <td className="px-4 py-2 border-b">{appt.hasVisited ? "Yes" : "No"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
