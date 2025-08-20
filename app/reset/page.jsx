"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LoaderCircle,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // States to track password conditions
  const [hasMinLength, setHasMinLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasLetter, setHasLetter] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // This useEffect hook updates the password conditions in real-time
  useEffect(() => {
    // Check for minimum length (at least 8 characters)
    setHasMinLength(newPassword.length >= 8);

    // Check for at least one number using a regular expression
    setHasNumber(/[0-9]/.test(newPassword));

    // Check for at least one letter (uppercase or lowercase)
    setHasLetter(/[a-zA-Z]/.test(newPassword));

    // Check if the two password fields match
    setPasswordsMatch(newPassword === confirmPassword && newPassword !== "");
  }, [newPassword, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check all conditions are met before attempting submission
    if (!hasMinLength || !hasNumber || !hasLetter || !passwordsMatch) {
      console.log("Password conditions not met. Please check the list.");
      setLoading(false);
      return;
    }

    // Simulate an API call for password reset
    console.log("Submitting password reset request...");
    try {
      // Simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Password reset successful!");

      // Retrieve the user's role from local storage
      const userRole = localStorage.getItem('userRole');

      // Check the role and redirect to the appropriate login page
      if (userRole === 'EMPLOYER') {
        localStorage.removeItem('userRole'); // Delete local storage key
        router.push("/employerlogin");
      } else if (userRole === 'STUDENT') {
        localStorage.removeItem('userRole'); // Delete local storage key
        router.push("/studentlogin");
      } else {
        // Fallback or a generic page if no role is found
        localStorage.removeItem('userRole'); // Just in case
        router.push("/");
      }

    } catch (error) {
      console.error("Failed to reset password:", error);
      // Handle login failure here
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  // Helper component for the list items to apply conditional styling
  const ConditionItem = ({ condition, text }) => {
    const iconClasses = condition ? "text-green-500" : "text-gray-400";
    const textClasses = condition ? "text-green-300" : "text-gray-400";

    return (
      <li className="flex items-center gap-2">
        {condition ? (
          <CheckCircle size={18} className={iconClasses} />
        ) : (
          <XCircle size={18} className={iconClasses} />
        )}
        <span className={textClasses}>{text}</span>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-4 font-sans">
      <motion.div
        className="max-w-xl w-full mx-auto p-8 sm:p-10 backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl relative overflow-hidden transform-gpu"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        {/* The rest of the UI (title, description) still animates in */}
        <motion.div className="relative z-10 text-center" variants={containerVariants}>
          <div className="flex items-center justify-center mb-4">
            <KeyRound className="text-white text-4xl mr-3" />
            <h1 className="text-4xl font-extrabold tracking-tight">Reset Password</h1>
          </div>
          <p className="text-base text-gray-300 mb-6">
            Enter your new password below.
          </p>
          <div className="flex justify-center flex-wrap gap-2 text-sm font-medium mb-8">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">#Security</span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">#AccountRecovery</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full h-14 pl-12 pr-12 bg-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <ul
            className="text-sm space-y-2 mt-4 p-4 rounded-xl backdrop-blur-sm bg-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-2">Password must:</h3>
            <ConditionItem condition={hasMinLength} text="Be at least 8 characters long" />
            <ConditionItem condition={hasNumber} text="Contain a number" />
            <ConditionItem condition={hasLetter} text="Contain a letter" />
            <div>
              <div className="relative mt-6">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full h-14 pl-12 pr-12 bg-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <ConditionItem condition={passwordsMatch} text="Passwords match" />
          </ul>

          <motion.div variants={containerVariants}>
            <button
              type="submit"
              disabled={loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch}
              className={`w-full h-14 rounded-xl text-white font-semibold transition-all duration-300 transform ${
                loading || !hasMinLength || !hasNumber || !hasLetter || !passwordsMatch
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:scale-105"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoaderCircle className="animate-spin" size={24} />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;