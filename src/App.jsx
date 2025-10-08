import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./AuthContext.jsx";
import "./App.css";

// Lazy load pages
const Home = lazy(() => import("./Pages/Home"));
const AboutUs = lazy(() => import("./Pages/AboutUs"));
const Blog = lazy(() => import("./Pages/Blog.jsx"));
const Register = lazy(() => import("./Pages/Register"));
const Login = lazy(() => import("./Pages/Login"));
const Appointment = lazy(() => import("./Pages/Appointment"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));

const App = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <ScrollToTop />

      {/* Suspense fallback while pages load */}
      <Suspense fallback={<div className="spinner-container">
        <div className="spinner"></div>
      </div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

          {/* Protected Routes */}
          <Route
            path="/appointment"
            element={
              <ProtectedRoute>
                <Appointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>

      <Footer />

      {/* ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: "3rem" }}
      />
    </>
  );
};

export default App;
