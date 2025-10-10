import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./AuthContext";
import HomeSkeleton from "./Skeleton/HomeSkeleton";
import SmallLoader from "./Skeleton/ProgressLoader";
import { ErrorBoundary } from "react-error-boundary";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";

// Lazy load pages
const Home = lazy(() => import("./Pages/Home"));
const AboutUs = lazy(() => import("./Pages/AboutUs"));
const Blog = lazy(() => import("./Pages/Blog"));
const Register = lazy(() => import("./Pages/Register"));
const Login = lazy(() => import("./Pages/Login"));
const Appointment = lazy(() => import("./Pages/Appointment"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));

// Optional: Error fallback UI
const ErrorFallback = () => (
  <div className="text-center text-red-600 p-8">
    Something went wrong. Please refresh the page.
  </div>
);

const App = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const location = useLocation(); // For AnimatePresence keyed transitions

  // Show full skeleton **only on first app load**
  if (authLoading) return <HomeSkeleton />;

  return (
    <>
      <Navbar />
      <ScrollToTop />

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<SmallLoader />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/blog" element={<Blog />} />
                <Route
                  path="/register"
                  element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Register />
                  }
                />
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? <Navigate to="/" replace /> : <Login />
                  }
                />
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
                {/* Optional 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
            <Footer />
          </AnimatePresence>
        </Suspense>
      </ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={2000}
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
