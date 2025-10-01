import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-200 pt-20 pb-10 overflow-hidden">
      {/* Decorative shapes */}
      {/* <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-500 rounded-full opacity-10 blur-3xl animate-pulse"></div> */}

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Brand Info */}
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-white">MediCore</h3>
          <p className="text-gray-400">Trusted healthcare for your whole family.</p>
          <div className="flex items-center gap-4 mt-2">
            {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-3 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 text-white hover:scale-110 transition-transform shadow-lg"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white border-b border-green-500 pb-2">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:text-green-400 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/appointment"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:text-green-400 transition-colors">Appointment</Link>
            </li>
            <li>
              <Link to="/about"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:text-green-400 transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/blog"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="hover:text-green-400 transition-colors">Blogs</Link>
            </li>
          </ul>
        </div>

        {/* Services / Info */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white border-b border-green-500 pb-2">Services</h4>
          <ul className="space-y-2">
            <li className="hover:text-green-400 transition-colors">General Checkup</li>
            <li className="hover:text-green-400 transition-colors">Emergency Care</li>
            <li className="hover:text-green-400 transition-colors">Pediatrics</li>
            <li className="hover:text-green-400 transition-colors">Cardiology</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold text-white border-b border-green-500 pb-2">Contact Us</h4>
          <div className="flex items-center gap-3 hover:text-green-400 transition-colors">
            <FaPhone className="text-green-400" /> <span>+91 999-999-9999</span>
          </div>
          <div className="flex items-center gap-3 hover:text-green-400 transition-colors">
            <MdEmail className="text-green-400" /> <span>contact@medicore.com</span>
          </div>
          <div className="flex items-center gap-3 hover:text-green-400 transition-colors">
            <FaLocationArrow className="text-green-400" /> <span>123 Main Street, India</span>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-16 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm flex flex-col sm:flex-row justify-center items-center gap-2">
        <p>© {new Date().getFullYear()} MediCore. All rights reserved.</p>
        <p className="text-green-400">Designed By Avishek ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
