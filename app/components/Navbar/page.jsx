'use client'
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Inline SVG icons
const FiMenu = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);

const FiX = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const FiChevronDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
);

const FiNewspaper = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4M4 9h16M4 15h16M10 3v18"/></svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newsAndEvents, setNewsAndEvents] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);
  const readStatusRef = useRef(new Set());

  const toggleNewsSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
    if (!isSidebarOpen) {
      const newReadItems = new Set(readStatusRef.current);
      newsAndEvents.forEach(item => newReadItems.add(item.id));
      readStatusRef.current = newReadItems;
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    async function fetchNewsAndEvents() {
      try {
        const [newsResponse, eventsResponse] = await Promise.all([
          fetch("/api/new"),
          fetch("/api/events")
        ]);

        if (!newsResponse.ok || !eventsResponse.ok) {
          throw new Error("Failed to fetch news or events data");
        }

        const newsData = await newsResponse.json();
        const eventsData = await eventsResponse.json();
        
        // Ensure data is always an array for combining
        const combinedData = [...(Array.isArray(newsData) ? newsData : [newsData]), ...(Array.isArray(eventsData) ? eventsData : [eventsData])];
        
        combinedData.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

        // 🚀 FIX: Calculate unread count for items <= 24 hours old
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
        const newItems = combinedData.filter(item => {
          const itemDate = new Date(item.createdAt || item.date).getTime();
          return itemDate >= twentyFourHoursAgo && !readStatusRef.current.has(item.id);
        });

        setNewsAndEvents(combinedData);
        setUnreadCount(newItems.length);

      } catch (error) {
        console.error("Error fetching news and events:", error);
      }
    }

    fetchNewsAndEvents();
    const intervalId = setInterval(fetchNewsAndEvents, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setMenuOpen(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest("#news-button")) {
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
  
  const handleLinkClick = useCallback(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-blue-400 bg-opacity-80 backdrop-filter backdrop-blur-lg text-white shadow-xl">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <a href="/" className="flex items-center space-x-2">
          <Image
            src="/leaders/KCUTSA_LOGO.png"
            alt="Logo"
            width={60}
            height={50}
            className="rounded-md ring-2 ring-blue-500"
          />
        </a>

        <div className="flex items-center space-x-4 md:hidden">
          <div className="relative">
            <button
              id="news-button"
              onClick={toggleNewsSidebar}
              className="relative p-2 rounded-full text-white hover:text-blue-400 transition-colors duration-300"
              aria-label="News"
            >
              <FiNewspaper className="w-6 h-6" />
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


        <motion.div
          initial={false}
          animate={{ height: menuOpen ? "60vh" : "0" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`overflow-hidden md:flex md:flex-row md:h-auto md:overflow-visible md:space-x-6 absolute md:static top-full left-0 w-full md:w-auto bg-[#1e2a3b] md:bg-transparent`}
          ref={dropdownRef}
        >
          <div className="flex flex-col md:flex-row md:space-x-6 py-4 md:py-0 w-full justify-center items-center h-full">
              <a href="/" className="block px-4 py-2 hover:text-blue-400 transition-colors duration-300" onClick={handleLinkClick}>
                Home
              </a>

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
                    <a href="/Employerlogin" className="block px-4 py-2 hover:bg-slate-700 transition-colors duration-300" onClick={handleLinkClick}>
                      Employer Login
                    </a>
                    <a href="/adminlogin" className="block px-4 py-2 hover:bg-slate-700 rounded-b-xl transition-colors duration-300" onClick={handleLinkClick}>
                      Admin Login
                    </a>
                  </div>
                )}
              </div>
              
              <div className="relative hidden md:block">
                <button
                  id="news-button"
                  onClick={toggleNewsSidebar}
                  className="relative px-4 py-2 hover:text-blue-400 transition-colors duration-300"
                  aria-label="News"
                >
                  <FiNewspaper className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-600 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

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

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-full md:w-[40rem] bg-[#172234] shadow-2xl z-40 p-6"
            ref={sidebarRef}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Latest News & Events</h2>
              <button onClick={toggleNewsSidebar} aria-label="Close news" className="text-white hover:text-blue-400 transition-colors duration-300">
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="h-[calc(100%-4rem)] overflow-y-auto">
                <ul className="space-y-4">
                {newsAndEvents.length > 0 ? (
                    newsAndEvents.map((item) => (
                    <li key={item.id} className="bg-blue-900/50 p-4 rounded-xl shadow-md border border-blue-800">
                        <h3 className="text-lg font-semibold text-white">
                            {/* Display 'News' or 'Event' label */}
                            <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full mr-2 ${'description' in item ? 'bg-green-500' : 'bg-purple-500'}`}>
                                {'description' in item ? 'News' : 'Event'}
                            </span>
                            {item.title}
                        </h3>
                        {/* 🚀 IMPROVED: Display description or location based on the item type */}
                        <p className="text-sm text-gray-400 mt-1">{item.description || `Location: ${item.location}`}</p>
                        <p className="text-xs text-gray-500 mt-1">Posted: {new Date(item.createdAt || item.date).toLocaleString()}</p>
                    </li>
                    ))
                ) : (
                    <li className="text-center text-gray-500 mt-10">You're all caught up! No new news or events.</li>
                )}
                </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}