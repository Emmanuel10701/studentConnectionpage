"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaBriefcase, FaBuilding, FaPhone, FaGlobe, FaLinkedin } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const EmployerRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companySize: "",
    industry: "",
    phone: "",
    website: "", // This is now optional
    position: ""
  });
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { name, email, password, confirmPassword, companyName, companySize, industry, phone, position } = data;
    setIsValid(
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      password === confirmPassword &&
      companyName.trim() !== "" &&
      companySize.trim() !== "" &&
      industry.trim() !== "" &&
      phone.trim() !== "" &&
      position.trim() !== "" &&
      agree
    );
  }, [data, agree]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);

    const res = await fetch("/api/employer/route.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        companySize: data.companySize,
        industry: data.industry,
        phone: data.phone,
        website: data.website,
        position: data.position,
      }),
    });

    if (res.ok) {
      router.push("/Employerlogin");
    } else {
      setIsSubmitting(false);
      const error = await res.json();
      alert(error.error || "Registration failed");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <FaBriefcase className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">KCUTSA</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Employer Registration</h2>
          <p className="text-gray-600">Connect with talented students and alumni</p>
        </motion.div>

        <motion.form className="bg-white rounded-2xl shadow-xl p-8" variants={containerVariants}
          initial="hidden" animate="visible" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-green-600" />Personal Information
              </h3>
            </div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" placeholder="Enter your full name" value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-green-600" />Email Address
              </label>
              <input type="email" placeholder="Enter your email" value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Position</label>
              <input type="text" placeholder="e.g., HR Manager, Recruiter" value={data.position}
                onChange={(e) => setData({ ...data, position: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2 text-green-600" />Phone Number
              </label>
              <input type="tel" placeholder="Enter your phone number" value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaBuilding className="mr-2 text-green-600" />Company Information
              </h3>
            </div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input type="text" placeholder="Enter company name" value={data.companyName}
                onChange={(e) => setData({ ...data, companyName: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
              <select value={data.companySize} onChange={(e) => setData({ ...data, companySize: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required>
                <option value="">Select company size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <select value={data.industry} onChange={(e) => setData({ ...data, industry: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required>
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Consulting">Consulting</option>
                <option value="Government">Government</option>
                <option value="Non-profit">Non-profit</option>
                <option value="Other">Other</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              {/* Changed label text to reflect it's optional */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaGlobe className="inline mr-2 text-green-600" />
                Company Website or LinkedIn Profile
                <span className="text-gray-500 text-xs ml-1">(Optional)</span>
              </label>
              {/* Changed input type to "text" for flexibility */}
              <input type="text" placeholder="https://company.com or LinkedIn URL" value={data.website}
                onChange={(e) => setData({ ...data, website: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" />
            </motion.div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaLock className="mr-2 text-green-600" />Security
              </h3>
            </div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Create a password" value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={data.confirmPassword}
                  onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200" required />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <motion.div variants={itemVariants} className="mt-4 flex items-center">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="mr-2"
              required
            />
            <label htmlFor="agree" className="text-sm text-gray-700">
              I agree to all the <a href="/terms" className="text-green-600 underline" target="_blank">terms and conditions</a>
            </label>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <button type="submit" disabled={isSubmitting || !isValid}
              className={`w-full h-12 rounded-lg font-semibold text-white transition-all duration-300 ${
                isSubmitting || !isValid ? 'bg-gray-400 cursor-not-allowed' :
                'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105'
              }`}>
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : 'Create Employer Account'}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/Employerlogin" className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-200">
                Sign In
              </a>
            </p>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default EmployerRegister;
