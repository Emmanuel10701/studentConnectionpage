'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, LoaderCircle } from 'lucide-react';

const AdminLogin = () => {
  // State for form data, UI state, and messages
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!data.email || !data.password) {
      setMessage({ text: 'Please fill in both fields.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      // Simulate an API call with a 1.5-second delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simple hardcoded check for admin credentials
      if (data.email === "admin@example.com" && data.password === "password123") {
        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        // In a real application, you would handle redirection here
      } else {
        setMessage({ text: "Invalid email or password.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An unexpected error occurred. Please try again.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg mx-auto bg-gray-900 rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-gray-700 backdrop-blur-sm p-10"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-600/80 rounded-full flex items-center justify-center shadow-xl">
              <LogIn className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-extrabold text-white">Admin Portal</h1>
          </div>
          <p className="text-gray-400 text-lg">Sign in to your administrator account</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input Field */}
          <motion.div variants={itemVariants}>
            <label htmlFor="email" className="block text-base font-medium text-gray-300 mb-2">
              <Mail className="inline-block mr-2 text-blue-400" size={20} />Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              value={data.email}
              onChange={handleChange}
              className="w-full h-14 bg-gray-800 border border-gray-700 text-white rounded-xl px-5 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-500"
              required
            />
          </motion.div>

          {/* Password Input Field */}
          <motion.div variants={itemVariants}>
            <label htmlFor="password" className="block text-base font-medium text-gray-300 mb-2">
              <Lock className="inline-block mr-2 text-blue-400" size={20} />Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={data.password}
                onChange={handleChange}
                className="w-full h-14 bg-gray-800 border border-gray-700 text-white rounded-xl px-5 pr-14 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-500"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
              </button>
            </div>
          </motion.div>

          {/* Submission Message Box */}
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg text-center font-medium ${
                message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Sign In Button */}
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-14 rounded-xl font-bold text-xl text-white transition-all duration-300 shadow-md transform active:scale-95 ${
                isSubmitting ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <LoaderCircle className="animate-spin mr-3" size={24} />
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
