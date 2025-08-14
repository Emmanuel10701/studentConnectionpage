'use client';

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import paterlogo from "../../../public/images/logo-main.png";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaSpinner } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, processing, success, error
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("processing");
    setMessage("");

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      // simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setMessage("Thank you for subscribing! You'll receive the latest updates shortly.");
      setEmail("");
    } catch (error) {
      console.error("Subscription failed:", error);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  const socialLinks = [
    { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/kcutsakirinyaga?igsh=MTdoMW53N3EzajVvbw==", color: "text-pink-500" },
    { name: "Facebook", icon: FaFacebookF, url: "https://www.facebook.com/profile.php?id=100089864157692&mibextid=rS40aB7S9Ucbxw6v", color: "text-blue-600" },
    { name: "Twitter", icon: FaTwitter, url: "#", color: "text-sky-400" },
    { name: "LinkedIn", icon: FaLinkedinIn, url: "#", color: "text-blue-700" },
  ];

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <footer className="bg-slate-900 text-gray-300 pt-12 pb-6">
      <motion.div
        className="container mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.2 }}
      >
        {/* Community Info */}
        <motion.div className="lg:col-span-2 text-center sm:text-left" variants={fadeUp}>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 tracking-tight">KCUTSA</h2>
          <p className="text-sm sm:text-base leading-relaxed">
            We connect students and employers for better opportunities, networking, and career growth. Together, we build the future.
          </p>
          <div className="flex justify-center sm:justify-start space-x-5 mt-6">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.url}
                  aria-label={link.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transform transition-transform duration-300 hover:scale-125 ${link.color}`}
                >
                  <Icon size={28} />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeUp} className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 sm:space-y-3">
            <li><a href="/" className="hover:text-white transition-colors duration-300">Home</a></li>
            <li><a href="/about" className="hover:text-white transition-colors duration-300">About</a></li>
            <li><a href="/register" className="hover:text-white transition-colors duration-300">Register</a></li>
            <li><a href="/login" className="hover:text-white transition-colors duration-300">Login</a></li>
          </ul>
        </motion.div>

        {/* Contact Info */}
        <motion.div variants={fadeUp} className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
            <li className="flex items-center justify-center sm:justify-start space-x-2">
              <MdEmail className="text-blue-400" size={20} />
              <span>kirinyagacountystudentskcutsa@gmail.com</span>
            </li>
            <li className="flex items-center justify-center sm:justify-start space-x-2">
              <MdPhone className="text-green-400" size={20} />
              <span>+254 700 123 456</span>
            </li>
            <li className="flex items-center justify-center sm:justify-start space-x-2">
              <MdLocationOn className="text-red-400" size={20} />
              <span>Nairobi, Kenya</span>
            </li>
          </ul>
        </motion.div>

        {/* Our Partner */}
        <motion.div variants={fadeUp} className="text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Our Partner</h3>
          <a href="https://www.kiit.ac.ke/" target="_blank" rel="noopener noreferrer">
            <Image
              src={paterlogo}
              alt="Kenya Institute of Information and Technology"
              width={180}
              height={80}
              className="rounded-lg shadow-lg hover:scale-105 transition-transform max-w-full h-auto mx-auto sm:mx-0"
              priority
            />
          </a>
        </motion.div>
      </motion.div>

      {/* Newsletter Subscription */}
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 mt-16">
        <motion.div
          className="bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">Stay Updated</h3>
          <p className="text-xs sm:text-sm leading-relaxed mb-6 text-center text-gray-400 max-w-xl mx-auto">
            Subscribe to our newsletter to receive the latest updates on careers, community development, and events.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-4 sm:px-5 py-2 sm:py-3 rounded-xl bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base"
              required
            />
            <button
              type="submit"
              disabled={status === "processing"}
              className="px-6 sm:px-8 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-4 text-sm font-medium text-center ${status === "success" ? "text-green-400" : "text-red-400"}`}
            >
              {message}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-xs sm:text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} KCUTSA. All rights reserved. | Designed with ❤️ in Kenya
        </p>
      </div>
    </footer>
  );
}
