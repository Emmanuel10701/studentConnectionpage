"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBriefcase, FaSignInAlt, FaBuilding } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signIn, useSession } from "next-auth/react";

const EmployerLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const { email, password } = data;
    setIsValid(email.trim() !== "" && password.trim() !== "");
  }, [data]);

  useEffect(() => {
    // If already logged in and role is EMPLOYER, redirect to dashboard
    if (status === "authenticated" && session?.user?.role === "EMPLOYER") {
      router.push("/employerdashboard");
    }
  }, [session, status, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (res.ok) {
      // NextAuth will update session, useEffect will redirect
    } else {
      alert("Invalid credentials or not an employer account.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <FaBriefcase className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">KCUTSA</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Employer Portal</h2>
          <p className="text-gray-600">Access your employer dashboard</p>
        </motion.div>

        <motion.form className="bg-white rounded-2xl shadow-xl p-8" variants={containerVariants}
                    initial="hidden" animate="visible" onSubmit={handleSubmit}>
          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaEnvelope className="inline mr-2 text-green-600" />Email Address
            </label>
            <input type="email" placeholder="Enter your email" value={data.email}
                   onChange={(e) => setData({ ...data, email: e.target.value })}
                   className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaLock className="inline mr-2 text-green-600" />Password
            </label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={data.password}
                     onChange={(e) => setData({ ...data, password: e.target.value })}
                     className="w-full h-12 border border-gray-300 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
              <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6 text-right">
            <a href="/forgotpassword" className="text-sm text-green-600 hover:text-green-700 hover:underline transition-colors duration-200">
              Forgot your password?
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <button type="submit" disabled={isSubmitting || !isValid}
                    className={`w-full h-12 rounded-lg font-semibold text-white transition-all duration-300 ${
                      isSubmitting || !isValid ? 'bg-gray-400 cursor-not-allowed' :
                      'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105'
                    }`}>
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaSignInAlt className="mr-2" />Access Dashboard
                </div>
              )}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <button
              type="button"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 cursor-pointer flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => signIn("google")}
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Continue with Google
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="/EmployerRegister" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-200">
                Register as Employer
              </a>
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center">
              <FaBuilding className="mr-2" />Employer Benefits
            </h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Access to qualified student profiles</li>
              <li>• Post internships and job opportunities</li>
              <li>• Connect with future talent</li>
              <li>• Participate in career fairs</li>
            </ul>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default EmployerLogin;