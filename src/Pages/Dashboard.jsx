// src/components/Dashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Dashboard = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();

    // --- STATE ---
    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // --- FETCH APPOINTMENTS ---
    const fetchAppointments = useCallback(async () => {
        if (!user?._id) return;
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

    // --- EFFECTS ---
    useEffect(() => {
        if (user?._id) {
            setLoadingAppointments(true);
            fetchAppointments();
        }
    }, [user, fetchAppointments]);

    useEffect(() => {
        const handler = () => fetchAppointments();
        window.addEventListener("appointmentCreated", handler);
        return () => window.removeEventListener("appointmentCreated", handler);
    }, [fetchAppointments]);

    // --- LOGOUT HANDLER ---
    const handleLogout = async () => {
        try {
            await logout(); // logout handles toast internally
            navigate("/login");
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    // --- DELETE APPOINTMENT ---
    const handleDelete = async (id) => {
        try {
            await axios.delete(
                `https://medicore-backend-sv2c.onrender.com/api/v1/appointment/user/${id}`,
                { withCredentials: true }
            );
            setAppointments((prev) => prev.filter((appt) => appt._id !== id));
            toast.success("Appointment deleted successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete appointment");
            console.error("Failed to delete appointment:", error);
        }
    };

    // --- STATUS COLOR HELPER ---
    const statusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "canceled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // --- CONDITIONAL RENDERING ---
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-700">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center h-screen text-lg text-red-600">
                Please log in
            </div>
        );
    }

    // --- MAIN DASHBOARD UI ---
    return (
        <div className="max-w-7xl mx-auto px-4 py-24 space-y-10">
            {/* User Info Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-lg rounded-2xl p-6 border border-indigo-100 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    {/* Avatar + Welcome */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-16 h-16 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-800 font-bold text-xl">
                            {user.firstName[0]}
                        </div>
                        <h1 className="text-3xl font-bold text-indigo-800">Welcome, {user.firstName}!</h1>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow cursor-pointer transition transform hover:-translate-y-1"
                    >
                        Logout
                    </button>
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 mt-6">
                    <p className="py-1">
                        <span className="font-semibold">Patient ID:</span>{" "}
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">{user._id}</span>
                    </p>
                    <p className="py-1">
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p className="py-1">
                        <span className="font-semibold">Phone:</span> {user.phone}
                    </p>
                </div>
            </div>

            {/* Appointments Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Your Appointments</h2>
                    <button
                        onClick={fetchAppointments}
                        disabled={refreshing}
                        className={`px-4 py-2 rounded-full border border-gray-300 font-medium text-gray-700 cursor-pointer transition ${refreshing ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appointments.map((appt) => (
                            <div
                                key={appt._id}
                                className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100 hover:shadow-xl"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-lg text-gray-800">{appt.department} Department</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(appt.status)}`}>
                                        {appt.status ?? "Pending"}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Doctor:</span> {appt.doctor?.firstName} {appt.doctor?.lastName}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-semibold">Date:</span>{" "}
                                    {appt.appointment_date
                                        ? new Date(appt.appointment_date).toLocaleDateString()
                                        : appt.appointmentDate
                                            ? new Date(appt.appointmentDate).toLocaleDateString()
                                            : "—"}
                                </p>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Before Visited:</span> {appt.hasVisited ? "Yes" : "No"}
                                    </p>
                                    <button
                                        className="bg-red-600 hover:bg-red-800 rounded-2xl border-none px-4 py-3 text-white text-sm cursor-pointer transition transform hover:-translate-y-1"
                                        onClick={() => handleDelete(appt._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
