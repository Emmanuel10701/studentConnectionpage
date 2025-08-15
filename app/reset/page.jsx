"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ShieldQuestion, LoaderCircle, CheckCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';

// Mock `next/navigation` and `react-toastify` for this environment.
const useRouter = () => ({
  push: (path) => console.log(`Navigating to ${path}`)
});

const toast = {
  success: (message) => console.log(`SUCCESS: ${message}`),
  error: (message) => console.log(`ERROR: ${message}`),
};
const ToastContainer = () => null;

// Zod schema for password validation
const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters long').regex(/[0-9]/, 'Password must contain a number').regex(/[a-zA-Z]/, 'Password must contain a letter'),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters long'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPasswordPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState('');

  // Safely access token from URL
  useEffect(() => {

    const mockToken = "12345-mock-token-abcde";
    setToken(mockToken);
  }, []);

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Validate passwords
    const validationResult = passwordSchema.safeParse({ newPassword, confirmPassword });

    if (!validationResult.success) {
      const firstError = validationResult.error?.errors?.[0]?.message || "Invalid input";
      toast.error(firstError);
      setLoading(false);
      return;
    }

    // API call to reset password
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        newPassword
      }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message || "Password reset successfully!");
      router.push("/login");
    } else {
      toast.error(data.message || "Failed to reset password. Token may be invalid.");
    }
  } catch (error) {
    toast.error("Failed to reset password");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // Framer-motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-4 font-sans">
      <motion.div
        className="max-w-xl w-full mx-auto p-8 sm:p-10 backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl relative overflow-hidden transform-gpu"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Dynamic decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <motion.div className="relative z-10 text-center" variants={itemVariants}>
          <div className="flex items-center justify-center mb-4">
            <KeyRound className="text-white text-4xl mr-3" />
            <h1 className="text-4xl font-extrabold tracking-tight">Reset Password</h1>
          </div>
          <p className="text-base text-gray-300 mb-6">
            Enter your new password below. It must be at least 8 characters long and contain a letter and a number.
          </p>
          <div className="flex justify-center flex-wrap gap-2 text-sm font-medium mb-8">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">#Security</span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">#AccountRecovery</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <motion.div variants={itemVariants}>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
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
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-xl text-white font-semibold transition-all duration-300 transform ${
                loading ? 'bg-indigo-400 cursor-not-allowed' :
                'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:scale-105'
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
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ResetPasswordPage />
  )
}
