"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// This is a simulated backend API for the purpose of this demo.
// In a real Next.js application, this would be a separate API route.
let _newsData = [
  { id: 1, title: "Career Fair Announcement", description: "The annual KCSO career fair will be held on December 15th. Mark your calendars!", read: false },
  { id: 2, title: "New Mentorship Program", description: "Our new mentorship program is now live. Sign up to connect with industry professionals.", read: false },
  { id: 3, title: "Tech Workshop Series", description: "Join our free workshop series on data science and machine learning, starting next week.", read: false },
  { id: 4, title: "Volunteer Opportunity", description: "We are seeking volunteers for our upcoming community outreach event. Your help makes a difference!", read: false },
  { id: 5, title: "Scholarship Application Window", description: "The application period for the 2024 KCSO scholarship is now open. Apply by Nov 30th.", read: false }
];

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

const FiBell = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);

// Modern Navbar component with a sleek, responsive design and dynamic dropdowns.
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Directly initialize news items, removing the loading state
  const [newsItems, setNewsItems] = useState(_newsData);
  
  // Refs for closing dropdowns and sidebar when clicking outside
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);
  
  // Computed value for unread news count
  const unreadCount = newsItems.filter(item => !item.read).length;

  // Function to toggle the sidebar and mark all notifications as read
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
    if (!isSidebarOpen) {
      // Mark all news as read and "persist" the change to our mock database.
      const updatedNews = _newsData.map(item => ({ ...item, read: true }));
      _newsData = updatedNews;
      setNewsItems(updatedNews);
    }
  };

  // Close dropdown and mobile menu if a click occurs outside of the dropdown menu.
  useEffect(() => {
    function handleClickOutside(event) {
      // Close the main mobile menu and any open dropdowns if a click is outside the menu container
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
        setMenuOpen(false); // Added to close the mobile menu
      }
      // Close the sidebar if a click is outside the sidebar container and not on the notification button
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest("#notification-button")
      ) {
        setIsSidebarOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

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
        <a href="/" className="flex items-center space-x-2">
          <img
            src="https://placehold.co/40x40/1d4ed8/ffffff?text=Logo"
            alt="Logo"
            width={40}
            height={40}
            className="rounded-full ring-2 ring-blue-500"
          />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Community</span>
        </a>

        {/* Hamburger and Notifications for mobile */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* Notifications button for mobile */}
          <div className="relative">
            <button
              id="notification-button"
              onClick={toggleSidebar}
              className="relative p-2 rounded-full text-white hover:text-blue-400 transition-colors duration-300"
              aria-label="Notifications"
            >
              <FiBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
          <button
            className="flex items-center p-2 border rounded-xl text-white border-white transition-all duration-300 hover:bg-white hover:text-slate-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>


        {/* Desktop Menu */}
        <motion.div
          // Use Framer Motion for a smooth dropdown animation on mobile
          initial={false}
          animate={{ height: menuOpen ? "60vh" : "0" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`overflow-hidden md:flex md:flex-row md:h-auto md:overflow-visible md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#1e2a3b] md:bg-transparent`}
          ref={dropdownRef}
        >
          {/* The flexbox properties below center the content vertically and horizontally */}
          <div className="flex flex-col md:flex-row md:space-x-6 py-4 md:py-0 w-full justify-center items-center h-full">
              {/* Main Navigation Links */}
              <a href="/" className="block px-4 py-2 hover:text-blue-400 transition-colors duration-300" onClick={handleLinkClick}>
                Home
              </a>

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
                    <a href="/studentRegister" className="block px-4 py-2 hover:bg-slate-700 rounded-t-xl transition-colors duration-300" onClick={handleLinkClick}>
                      Student Register
                    </a>
                    <a href="/EmployerRegister" className="block px-4 py-2 hover:bg-slate-700 rounded-b-xl transition-colors duration-300" onClick={handleLinkClick}>
                      Employer Register
                    </a>
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
                    <a href="/studentlogin" className="block px-4 py-2 hover:bg-slate-700 rounded-t-xl transition-colors duration-300" onClick={handleLinkClick}>
                      Student Login
                    </a>
                    <a href="/Employerlogin" className="block px-4 py-2 hover:bg-slate-700 rounded-b-xl transition-colors duration-300" onClick={handleLinkClick}>
                      Employer Login
                    </a>
                  </div>
                )}
              </div>
              
              {/* Notifications button for desktop */}
              <div className="relative hidden md:block">
                <button
                  id="notification-button"
                  onClick={toggleSidebar}
                  className="relative px-4 py-2 hover:text-blue-400 transition-colors duration-300"
                  aria-label="Notifications"
                >
                  <FiBell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Contact Us Button */}
              <a href="/contact">
                <button 
                  className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                  onClick={handleLinkClick}
                >
                  Contact Us
                </button>
              </a>
          </div>
        </motion.div>
      </div>

      {/* Sidebar and Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-full md:w-80 bg-slate-900 shadow-2xl z-40 overflow-y-auto p-6"
            ref={sidebarRef}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Notifications</h2>
              <button onClick={toggleSidebar} aria-label="Close notifications" className="text-white hover:text-blue-400 transition-colors duration-300">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <ul className="space-y-4">
              {newsItems.length > 0 ? (
                newsItems.map((item) => (
                  <li key={item.id} className="bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-500 mt-10">You're all caught up! No new notifications.</li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
