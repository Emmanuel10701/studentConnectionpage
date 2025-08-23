"use client";

import React, { useState, useEffect } from "react"; // ✅ Import React and hooks
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Providers({ children, session }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SessionProvider session={session}>
      <div
        className={`antialiased ${
          isClient ? `${geistSans.variable} ${geistMono.variable}` : ""
        }`}
      >
        {children}
      </div>
    </SessionProvider>
  );
}
