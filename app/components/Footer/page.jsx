"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaSpinner } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

// Your partner logo import
import kiitLogo from "../../../public/images/logo-main.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("processing");
    setMessage("");

    // Simple email validation
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      // Structure for a real backend API call using the Gemini API
      const prompt = `A user has subscribed to a newsletter with the email: ${email}. Please confirm the subscription.`;
      const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
      
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              success: { type: "BOOLEAN" },
              message: { type: "STRING" }
            },
            propertyOrdering: ["success", "message"]
          }
        }
      };
      
      const apiKey = ""; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (jsonText) {
        const parsedJson = JSON.parse(jsonText);
        if (parsedJson.success) {
          setStatus("success");
          setMessage(parsedJson.message || "Thank you for subscribing! You'll receive the latest updates shortly.");
          setEmail("");
        } else {
          setStatus("error");
          setMessage(parsedJson.message || "Something went wrong. Please try again later.");
        }
      } else {
        throw new Error("Invalid response format from API.");
      }
      
    } catch (error) {
      console.error("Subscription failed:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 rounded-t-lg shadow-lg">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Community Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Community</h2>
          <p className="text-sm leading-6">
            We connect students and employers for better opportunities,
            networking, and career growth. Together, we build the future.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500 transition-colors duration-300"><FaFacebook size={24} /></a>
            <a href="#" aria-label="Twitter" className="hover:text-sky-400 transition-colors duration-300"><FaTwitter size={24} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition-colors duration-300"><FaInstagram size={24} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-600 transition-colors duration-300"><FaLinkedin size={24} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white transition-colors duration-300">Home</a></li>
            <li><a href="/about" className="hover:text-white transition-colors duration-300">About</a></li>
            <li><a href="/register" className="hover:text-white transition-colors duration-300">Register</a></li>
            <li><a href="/login" className="hover:text-white transition-colors duration-300">Login</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center space-x-2">
              <MdEmail className="text-blue-400" />
              <span>kirinyagacountystudentskcutsa@gmail.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <MdPhone className="text-green-400" />
              <span>+254 700 123 456</span>
            </li>
            <li className="flex items-center space-x-2">
              <MdLocationOn className="text-red-400" />
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </div>
        
        {/* Our Partner - Interchanged position */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Our Partner</h3>
          <a href="https://www.kiit.ac.ke/" target="_blank" rel="noopener noreferrer">
            <Image
              src={kiitLogo}
              alt="Kenya Institute of Information and Technology"
              width={180}
              height={80}
              className="rounded shadow-lg hover:scale-105 transition-transform"
            />
          </a>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="https://www.kiit.ac.ke/" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Courses</a></li>
            <li><a href="#" className="hover:text-white">Professional Seminars</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Project Management</a></li>
          </ul>
        </div>
        
      </div>
      
      {/* Newsletter Subscription - Interchanged position */}
      <div className="container mx-auto px-6 mt-12 md:grid md:grid-cols-2 md:gap-10 lg:grid-cols-4">
        <div className="col-span-full md:col-span-2 lg:col-span-4">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Stay Updated</h3>
          <p className="text-sm leading-6 mb-4 text-center max-w-xl mx-auto">
            Subscribe to the latest news to stay updated on careers, community development, and events.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={status === "processing"}
              className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {status === "processing" ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Subscribe"
              )}
            </button>
          </form>
          {message && (
            <div className={`mt-4 text-sm font-medium text-center ${status === "success" ? "text-green-400" : "text-red-400"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Community. All rights reserved. | Designed with ❤️ in Kenya
        </p>
      </div>
    </footer>
  );
}
