"use client";

import React, { useEffect, useState } from "react";

export default function App() {
  const [countdown, setCountdown] = useState(10);

  // Custom hook for the countdown logic.
  const useCountdown = (seconds) => {
    const [countdownValue, setCountdownValue] = useState(seconds);

    useEffect(() => {
      const timer = setInterval(() => {
        setCountdownValue((prev) => {
          if (prev <= 1) {
            // Redirect back or to the homepage if history is empty.
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = "/";
            }
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, []);

    return countdownValue;
  };

  const currentCountdown = useCountdown(10);
  const [isCopied, setIsCopied] = useState(false);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleCopy = () => {
    const url = window.location.href;
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = url;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center">
      <div className="p-8 md:p-12 mt-[20%] sm:mt-6">
        <h1
          className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text
                     text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent
                     animate-pop-in"
        >
          Oops!
        </h1>

        <h2 className="mt-6 text-3xl sm:text-2xl font-bold text-gray-900 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          404 - Page Not Found
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-row gap-3 mt-6 justify-center flex-nowrap animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {/* Using a standard <a> tag to fix the compilation error in this environment */}
          <a
            href="/"
            className="flex items-center justify-center gap-2
                       px-2.5 py-1 sm:px-4 sm:py-2
                       text-xs sm:text-base
                       bg-gradient-to-br from-blue-500 to-indigo-500
                       text-white font-semibold rounded-lg
                       hover:bg-blue-600 hover:to-indigo-600
                       transition-colors duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 hidden sm:inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="sm:hidden">Home</span>
            <span className="hidden sm:inline">Go To Homepage</span>
          </a>

          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2
                       px-2.5 py-1 sm:px-4 sm:py-2
                       text-xs sm:text-base
                       border border-indigo-500 text-indigo-500
                       font-semibold rounded-lg
                       hover:bg-indigo-50
                       transition-colors duration-200 hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 hidden sm:inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Go Back</span>
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Redirecting back in {currentCountdown} second{currentCountdown !== 1 ? "s" : ""}...
        </p>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes popIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in { animation: popIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
