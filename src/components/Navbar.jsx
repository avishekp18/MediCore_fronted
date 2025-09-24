import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext.jsx";
import { FaUserCircle } from "react-icons/fa"; // import user icon
import { FiExternalLink } from "react-icons/fi";
import { FiLogIn } from "react-icons/fi";
const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  // local "version" to force rerender in rare cases where context consumers don't update
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
    { name: "Home", to: "/" },
    { name: "Appointment", to: "/appointment" },
    { name: "About Us", to: "/about" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-700">
                Medi<span className="text-blue-500">Core</span>
              </Link>
            </div>

            {/* Desktop */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="text-gray-700 hover:text-blue-600">
                  {link.name}
                </Link>
              ))}
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
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-4 py-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 shadow-sm transition-all duration-200 hover:shadow-md font-medium"
                  >
                    <div className="p-1 bg-blue-200 rounded-full text-blue-700">
                      <FaUserCircle className="text-xl" />
                    </div>
                    <span>{user?.firstName || user?.name}</span>
                  </Link>
                </>
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

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-700">
                <GiHamburgerMenu />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
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
              key={link.to}
              to={link.to}
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
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium"
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

      {/* Sidebar Overlay */}
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
