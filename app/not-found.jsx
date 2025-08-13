"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiHome } from "react-icons/fi";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.back();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center">
      <div className="p-8 md:p-12 mt-[20%] sm:mt-6">
        <h1
          className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text 
                     text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent"
        >
          Oops!
        </h1>

        <h2 className="mt-6 text-3xl sm:text-2xl font-bold text-gray-900">
          404 - Page Not Found
        </h2>

        <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-row gap-3 mt-6 justify-center flex-nowrap">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 
              px-2.5 py-1 sm:px-4 sm:py-2 
              text-xs sm:text-base 
              bg-gradient-to-br from-blue-500 to-indigo-500 
              text-white font-semibold rounded-lg 
              hover:bg-blue-600 hover:to-indigo-600 
              transition-colors duration-200"
          >
            <FiHome className="hidden sm:inline w-5 h-5" />
            <span className="sm:hidden">Home</span>
            <span className="hidden sm:inline">Go To Homepage</span>
          </Link>

          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 
              px-2.5 py-1 sm:px-4 sm:py-2 
              text-xs sm:text-base 
              border border-indigo-500 text-indigo-500 
              font-semibold rounded-lg 
              hover:bg-indigo-50 
              transition-colors duration-200"
          >
            <FiArrowLeft className="hidden sm:inline w-5 h-5" />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Go Back</span>
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Redirecting back in {countdown} second{countdown !== 1 ? "s" : ""}...
        </p>
      </div>
    </div>
  );
}
