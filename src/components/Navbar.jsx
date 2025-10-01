import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext.jsx";
import { FaUserCircle } from "react-icons/fa";
import { FiExternalLink, FiLogIn } from "react-icons/fi";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Get current route

  const [, setAuthVersion] = useState(0);
  useEffect(() => {
    const onAuthChanged = () => setAuthVersion((v) => v + 1);
    window.addEventListener("authChanged", onAuthChanged);
    return () => window.removeEventListener("authChanged", onAuthChanged);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    } finally {
      setSidebarOpen(false);
    }
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Appointment", path: "/appointment" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">

            {/* Left Hamburger */}
            <div className="flex items-center px-2">
              {/* Hamburger */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-2xl text-gray-700 mr-3 md:hidden"
              >
                <GiHamburgerMenu />
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center text-2xl font-bold text-blue-700">
                {/* <span className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white mr-2">
                  A
                </span> */}
                Medi<span className="text-indigo-500">Core</span>
                <svg
                  className="w-6 h-6 -mb-1 animate-bounce"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32 2C34 8 40 12 48 14C46 10 50 6 56 6C52 10 54 16 50 20C46 24 42 22 38 18C34 14 32 10 32 2Z"
                    fill="url(#birdGradient)"
                  />
                  <defs>
                    <linearGradient id="birdGradient" x1="32" y1="2" x2="56" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4F46E5" />
                      <stop offset="1" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {links.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-medium px-2 py-1 rounded-sm transition-colors duration-150 ${active
                      ? "text-blue-600 border-b-2 border-blue-400"
                      : "text-gray-700 hover:text-blue-600"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <a
                href="https://medicore-admin.netlify.app/login"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 gap-2 px-4 py-2 rounded-lg shadow hover:text-blue-600 transition"
              >
                Admin
                <FiExternalLink className="w-4 h-4" />
              </a>

              {!loading && isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 shadow-sm transition-all duration-200 hover:shadow-md font-medium"
                >
                  <div className="p-1 bg-blue-200 rounded-full text-blue-700">
                    <FaUserCircle className="text-xl md:text-xl" />
                  </div>
                  {/* Hide text on small/medium screens, show on large screens */}
                  <span className="hidden lg:inline">{user?.firstName || user?.name}</span>
                </Link>

              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow transition cursor-pointer"
                >
                  Login
                  <FiLogIn className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Hamburger on Right if needed */}
            <div className="md:hidden flex items-center"></div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Sidebar content same as before */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-bold text-blue-700">
            Medi<span className="text-blue-500">Core</span>
          </h2>
          <button onClick={() => setSidebarOpen(false)} className="text-2xl">
            <IoMdClose />
          </button>
        </div>
        <div className="flex flex-col mt-4 space-y-3 px-4 gap-2">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-700 hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://medicore-admin.netlify.app/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700  gap-2 px-4 py-2 rounded-lg shadow hover:text-blue-600 transition"
          >
            Admin
            <FiExternalLink className="w-4 h-4" />
          </a>

          {!loading &&
            (isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium"
                >
                  <FaUserCircle className="text-xl" />
                  <span>{user?.firstName || user?.name || "Dashboard"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition mt-10"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setSidebarOpen(false);
                }}
                className="bottom-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg transition"
              >
                Login
              </button>
            ))}
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
