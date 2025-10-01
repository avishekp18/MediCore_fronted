// src/components/Register.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext.jsx";

const Register = () => {
  // We do NOT auto-login after register; we redirect user to /login
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (loading) return; // guard against double submit
    setLoading(true);

    const SUCCESS_TOAST_ID = "register-success";
    const ERROR_TOAST_ID = "register-error";

    try {
      const response = await axios.post(
        "https://medicore-backend-sv2c.onrender.com/api/v1/user/patient/register",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const { data, status } = response;

      // treat success only when backend indicates success
      if (status >= 200 && status < 300 && data?.success) {
        if (!toast.isActive(SUCCESS_TOAST_ID)) {
          toast.success(data.message || "Registration successful", {
            toastId: SUCCESS_TOAST_ID,
          });
        }

        // Redirect user to login page (no auto-login)
        navigate("/login", { replace: true });
        return;
      }

      // Defensive: 2xx but success false
      if (!data?.success) {
        if (!toast.isActive(ERROR_TOAST_ID)) {
          toast.error(data?.message || "Registration failed", {
            toastId: ERROR_TOAST_ID,
          });
        }
      }
    } catch (err) {
      // Axios throws for non-2xx responses — show single error toast
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed (network or server error)";

      if (!toast.isActive(ERROR_TOAST_ID)) {
        toast.error(message, { toastId: ERROR_TOAST_ID });
      }

      // optional: console.error(err) for dev debugging
      // console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  // If already authenticated, don't show register page
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="py-20 pt-25">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
        <p className="text-gray-600 text-center mb-6">
          Please sign up to continue
        </p>

        <form onSubmit={handleRegistration} className="space-y-4">
          {/* First + Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                autoComplete="family-name"
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                autoComplete="tel"
              />
            </div>
          </div>

          {/* NIC + DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIC
              </label>
              <input
                type="text"
                name="nic"
                placeholder="Enter your NIC"
                value={formData.nic}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                max={new Date().toISOString().split("T")[0]} // prevent future dates
              />
            </div>
          </div>

          {/* Gender + Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                autoComplete="new-password"
              />
            </div>
          </div>

          {/* Already Registered */}
          <div className="flex justify-end items-center gap-2 text-sm">
            <p className="m-0 text-gray-600">Already Registered?</p>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login Now
            </Link>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md cursor-pointer transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
