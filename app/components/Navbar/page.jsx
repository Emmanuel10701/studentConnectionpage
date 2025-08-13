"use client";

import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import logo from "../../../public/images/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
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
  
  // Close the mobile menu and dropdowns when a link is clicked
  const handleLinkClick = useCallback(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-blue-700 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={logo}
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold">Community</span>
        </Link>

        {/* Hamburger */}
        <button
          className="md:hidden flex items-center px-2 py-1 border rounded text-white border-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>

        {/* Menu */}
        <div
          className={`flex-col md:flex-row md:flex space-y-4 md:space-y-0 md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-blue-700 md:bg-transparent z-50 transition-all duration-200 ease-in ${
            menuOpen ? "flex" : "hidden"
          } md:flex`}
          ref={dropdownRef}
        >
          <Link href="/" className="block px-4 py-2 hover:text-orange-400" onClick={handleLinkClick}>
            Home
          </Link>
          <Link href="#about" className="block px-4 py-2 hover:text-orange-400" onClick={handleLinkClick}>
            About
          </Link>
          <Link href="#leadership" className="block px-4 py-2 hover:text-orange-400" onClick={handleLinkClick}>
            Leadership
          </Link>

          {/* Register Dropdown */}
          <div className="relative group">
            <button
              onClick={() => toggleDropdown("register")}
              className="flex items-center px-4 py-2 hover:text-orange-400"
            >
              Register <FiChevronDown className="ml-1" />
            </button>
            {openDropdown === "register" && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                <Link
                  href="/studentRegister"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={handleLinkClick}
                >
                  Student Register
                </Link>
                <Link
                  href="/EmployerRegister"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={handleLinkClick}
                >
                  Employer Register
                </Link>
              </div>
            )}
          </div>

          {/* Login Dropdown */}
          <div className="relative group">
            <button
              onClick={() => toggleDropdown("login")}
              className="flex items-center px-4 py-2 hover:text-orange-400"
            >
              Login <FiChevronDown className="ml-1" />
            </button>
            {openDropdown === "login" && (
              <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                <Link
                  href="/studentlogin"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={handleLinkClick}
                >
                  Student Login
                </Link>
                <Link
                  href="/Employerlogin"
                  className="block px-4 py-2 hover:bg-blue-100"
                  onClick={handleLinkClick}
                >
                  Employer Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
