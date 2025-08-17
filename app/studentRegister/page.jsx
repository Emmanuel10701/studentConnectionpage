"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGraduationCap } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoLocationSharp } from 'react-icons/io5';

const StudentRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
    course: "",
    yearOfStudy: "",
    educationLevel: "", // New state for education level
    constituency: "",
    ward: ""
  });
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  // Data structure for constituencies and wards
  const constituenciesAndWards = {
    "Mwea": ["Mutithi", "Kangai", "Wamumu", "Nyangati", "Murinduko", "Gathigiriri", "Tebere", "Thiba"],
    "Gichugu": ["Kabare", "Baragwi", "Njukiini", "Ngariama", "Karumandi"],
    "Ndia": ["Mukure", "Kiine", "Kariti"],
    "Kirinyaga Central": ["Mutira", "Kanyekini", "Kerugoya", "Inoi"]
  };

  useEffect(() => {
    const { name, email, password, confirmPassword, institution, course, yearOfStudy, educationLevel, constituency, ward } = data;
    setIsValid(
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      password === confirmPassword &&
      institution.trim() !== "" &&
      course.trim() !== "" &&
      yearOfStudy.trim() !== "" &&
      educationLevel.trim() !== "" && // Validation for education level
      constituency.trim() !== "" &&
      ward.trim() !== "" &&
      agree
    );
  }, [data, agree]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);

    const res = await fetch("/api/register/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        institution: data.institution,
        course: data.course,
        yearOfStudy: data.yearOfStudy,
        educationLevel: data.educationLevel, // Sending education level
        constituency: data.constituency,
        ward: data.ward,
      }),
    });

    if (res.ok) {
      router.push("/login/student");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <motion.div className="text-center mb-10" variants={itemVariants}>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">KCUTSA</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Student Registration</h2>
          <p className="text-lg text-gray-600">Join our community of empowered students</p>
        </motion.div>

        <motion.form className="bg-white rounded-2xl shadow-xl p-10" variants={containerVariants}
          initial="hidden" animate="visible" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <label className="block text-base font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2 text-blue-600" />Full Name
              </label>
              <input type="text" placeholder="Enter your full name" value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-base font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-blue-600" />Email Address
              </label>
              <input type="email" placeholder="Enter your email" value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-base font-medium text-gray-700 mb-2">
                <FaGraduationCap className="inline mr-2 text-blue-600" />Institution
              </label>
              <input type="text" placeholder="Your university/college" value={data.institution}
                onChange={(e) => setData({ ...data, institution: e.target.value })}
                className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-base font-medium text-gray-700 mb-2">Course of Study</label>
              <input type="text" placeholder="e.g., Computer Science" value={data.course}
                onChange={(e) => setData({ ...data, course: e.target.value })}
                className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
            </motion.div>

            {/* New Education Level dropdown */}
            <motion.div variants={itemVariants}>
                <label className="block text-base font-medium text-gray-700 mb-2">
                    <FaGraduationCap className="inline mr-2 text-blue-600" />Education Level
                </label>
                <select 
                    value={data.educationLevel} 
                    onChange={(e) => setData({ ...data, educationLevel: e.target.value })}
                    className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                    required
                >
                    <option value="">Select level</option>
                    <option value="certificate">Certificate</option>
                    <option value="diploma">Diploma</option>
                    <option value="undergraduate">bachelor's degree</option>
                    <option value="undergraduate">Master's degree</option>
                    <option value="phd">PhD</option>
                </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-base font-medium text-gray-700 mb-2">Year of Study</label>
              <select value={data.yearOfStudy} onChange={(e) => setData({ ...data, yearOfStudy: e.target.value })}
                className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required>
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="6">6th Year</option>
                <option value="alumni">Alumni</option>
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-base font-medium text-gray-700 mb-2">
                <IoLocationSharp className="inline mr-2 text-blue-600" />Constituency
              </label>
              <select
                value={data.constituency}
                onChange={(e) => setData({ ...data, constituency: e.target.value, ward: "" })}
                className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              >
                <option value="" disabled>Select your constituency</option>
                {Object.keys(constituenciesAndWards).map((constituency) => (
                  <option key={constituency} value={constituency}>
                    {constituency}
                  </option>
                ))}
              </select>
            </motion.div>

            {data.constituency && (
              <motion.div variants={itemVariants}>
                <label className="block text-base font-medium text-gray-700 mb-2">
                  <IoLocationSharp className="inline mr-2 text-blue-600" />Ward
                </label>
                <select
                  value={data.ward}
                  onChange={(e) => setData({ ...data, ward: e.target.value })}
                  className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="" disabled>Select your ward</option>
                  {constituenciesAndWards[data.constituency]?.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <label className="block text-base font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-blue-600" />Password
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Create a password" value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                  className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-base font-medium text-gray-700 mb-2">
                <FaLock className="inline mr-2 text-blue-600" />Confirm Password
              </label>
              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={data.confirmPassword}
                  onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                  className="w-full h-14 text-base border border-gray-300 rounded-lg px-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" required />
                <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="mt-6 flex items-center">
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
              className="mr-2 w-5 h-5"
              required
            />
            <label htmlFor="agree" className="text-base text-gray-700">
              I agree to all the <a href="/terms" className="text-blue-600 hover:text-blue-700 underline" target="_blank">terms and conditions</a>
            </label>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8">
            <button type="submit" disabled={isSubmitting || !isValid}
              className={`w-full h-14 rounded-lg text-lg font-semibold text-white transition-all duration-300 ${
                isSubmitting || !isValid ? 'bg-gray-400 cursor-not-allowed' :
                'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105'
              }`}>
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : 'Create Account'}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-base text-gray-600">
              Already have an account?{' '}
              <a href="/login/student" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
                Sign In
              </a>
            </p>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
};

export default StudentRegister;
