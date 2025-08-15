"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ShieldQuestion, LoaderCircle, CheckCircle, X } from 'lucide-react';

const useRouter = () => ({
  push: (path) => console.log(`Navigating to ${path}`),
  back: () => console.log(`Going back`)
});

const router = useRouter();

const MessageBox = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? (
    <CheckCircle size={24} />
  ) : (
    <X size={24} />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-xl text-white shadow-lg flex items-center gap-3 ${bgColor}`}
    >
      {icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-white opacity-70 hover:opacity-100">
        <X size={20} />
      </button>
    </motion.div>
  );
};


const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [gmailEnabled, setGmailEnabled] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/forgot", {
        // 👈 Make sure this matches your API folder name
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
        setGmailEnabled(true);
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to send reset link" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleGmailClick = () => {
    window.location.href = `mailto:${email}`;
  };

  const handleCloseMessage = () => {
    setMessage(null);
  };

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
      <AnimatePresence>
        {message && <MessageBox message={message.text} type={message.type} onClose={handleCloseMessage} />}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <ForgotPasswordPage />
  )
}
