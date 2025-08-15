"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link"; // Import the Link component

// Inline SVG icons to replace react-icons/fi
const FiMenu = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const FiX = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const FiChevronDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

// Modern Navbar component with a sleek, responsive design and dynamic dropdowns.
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown if a click occurs outside of the dropdown menu.
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };
  
  // Close the mobile menu and dropdowns when a link is clicked.
  const handleLinkClick = useCallback(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1e2a3b] bg-opacity-80 backdrop-filter backdrop-blur-lg text-white shadow-xl">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="https://placehold.co/40x40/1d4ed8/ffffff?text=Logo"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full ring-2 ring-blue-500"
          />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Community</span>
        </Link>

        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden flex items-center px-3 py-2 border rounded-xl text-white border-white transition-all duration-300 hover:bg-white hover:text-slate-900"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        {/* Desktop Menu and Mobile Menu Overlay */}
        <div
          className={`flex-col md:flex-row md:flex md:space-y-0 md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#1e2a3b] md:bg-transparent transition-all duration-300 ease-in-out ${
            menuOpen ? "flex py-4" : "hidden"
          } md:flex items-center`}
          ref={dropdownRef}
        >
          {/* Main Navigation Links */}
          <Link href="/" className="block px-4 py-2 hover:text-blue-400 transition-colors duration-300" onClick={handleLinkClick}>
            Home
          </Link>

          {/* Register Dropdown */}
          <div className="relative group">
            <button
              onClick={() => toggleDropdown("register")}
              className="flex items-center px-4 py-2 hover:text-blue-400 transition-colors duration-300"
            >
              Register <FiChevronDown className="ml-1" />
            </button>
            {openDropdown === "register" && (
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 text-white rounded-xl shadow-lg z-50">
                <Link href="/studentRegister" className="block px-4 py-2 hover:bg-slate-700 rounded-t-xl transition-colors duration-300" onClick={handleLinkClick}>
                  Student Register
                </Link>
                <Link href="/EmployerRegister" className="block px-4 py-2 hover:bg-slate-700 rounded-b-xl transition-colors duration-300" onClick={handleLinkClick}>
                  Employer Register
                </Link>
              </div>
            )}
          </div>

          {/* Login Dropdown */}
          <div className="relative group">
            <button
              onClick={() => toggleDropdown("login")}
              className="flex items-center px-4 py-2 hover:text-blue-400 transition-colors duration-300"
            >
              Login <FiChevronDown className="ml-1" />
            </button>
            {openDropdown === "login" && (
              <div className="absolute left-0 mt-2 w-48 bg-slate-800 text-white rounded-xl shadow-lg z-50">
                <Link href="/studentlogin" className="block px-4 py-2 hover:bg-slate-700 rounded-t-xl transition-colors duration-300" onClick={handleLinkClick}>
                  Student Login
                </Link>
                <Link href="/Employerlogin" className="block px-4 py-2 hover:bg-slate-700 rounded-b-xl transition-colors duration-300" onClick={handleLinkClick}>
                  Employer Login
                </Link>
              </div>
            )}
          </div>

          {/* Contact Us Button */}
          <Link href="/contact" passHref>
            <button 
              className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              onClick={handleLinkClick}
            >
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
