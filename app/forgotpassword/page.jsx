"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Mail, ShieldQuestion, LoaderCircle, CheckCircle } from 'lucide-react';

// Mock `next/router` and `react-toastify` for this environment.
const useRouter = () => ({
  push: (path) => console.log(`Navigating to ${path}`)
});

// A mock toast notification system to replace the original.
const toast = {
  success: (message) => console.log(`SUCCESS: ${message}`),
  error: (message) => console.log(`ERROR: ${message}`),
};
const ToastContainer = () => null;

const router = useRouter();

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [gmailEnabled, setGmailEnabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call since we are not running a live server.
    console.log("Submitting forgot password request for email:", email);
    const mockResponse = { ok: true, message: "A password reset link has been sent to your email." };

    try {
      // In a real application, you would make a fetch call here.
      // const response = await fetch('/api/forgot', { ... });
      // const result = await response.json();
      const result = mockResponse;

      if (result.ok) {
        toast.success(result.message);
        setGmailEnabled(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to send reset link');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailClick = () => {
    // Opens a mail client with a pre-filled recipient.
    window.location.href = `mailto:${email}`;
  };

  // Framer-motion variants for animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white flex items-center justify-center p-4">
      <motion.div
        className="max-w-xl w-full mx-auto p-10 backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl relative overflow-hidden transform-gpu"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Dynamic decorative elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        <motion.div className="relative z-10 text-center" variants={itemVariants}>
          <div className="flex items-center justify-center mb-4">
            <ShieldQuestion className="text-white text-4xl mr-3" />
            <h1 className="text-4xl font-extrabold tracking-tight">Password Recovery</h1>
          </div>
          <p className="text-base text-gray-300 mb-6">
            Enter your email address below and we'll send you a link to reset your password.
          </p>
          <div className="flex justify-center flex-wrap gap-2 text-sm font-medium mb-8">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">#Security</span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">#AccountRecovery</span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full">#Authentication</span>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <motion.div variants={itemVariants}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full h-14 pl-12 pr-4 bg-white/20 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                required
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl text-white font-semibold transition-all duration-300 transform ${
                loading ? 'bg-indigo-400 cursor-not-allowed' :
                'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:scale-105'
              }`}
            >
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" size={24} />
                  <span>Sending Link...</span>
                </>
              ) : (
                <span>Send Link</span>
              )}
            </button>

            <button
              type="button"
              disabled={!gmailEnabled}
              onClick={handleGmailClick}
              className={`flex-1 flex items-center justify-center gap-2 h-14 rounded-xl font-semibold transition-all duration-300 transform ${
                !gmailEnabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                'bg-white/30 text-white hover:bg-white/40 hover:scale-105'
              }`}
            >
              <Mail size={20} />
              <span>{gmailEnabled ? 'Open Gmail' : 'Get the Link'}</span>
            </button>
          </motion.div>
        </form>

       <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-gray-400">
      <p>
        Remembered your password?{' '}
        <span
          onClick={() => router.back()}
          className="text-indigo-400 font-medium hover:underline cursor-pointer transition-colors duration-200"
        >
          Log in
        </span>
      </p>
    </motion.div>
      </motion.div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ForgotPasswordPage />
  )
}
