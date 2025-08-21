"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar/page";
import Image from "next/image";
import Footer from "../components/Footer/page";

// Inline SVG icons
const MdEmail = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);
const MdPhone = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.74 21 3 13.26 3 4c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.46.57 3.57.12.35.03.75-.25 1.02l-2.2 2.2z"/>
  </svg>
);
const MdLocationOn = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2c-4.2 0-8 3.22-8 8.2a8.77 8.77 0 001.07 4.08c1.13 2.11 4.56 5.67 6.47 7.74.22.24.49.36.76.36s.54-.12.76-.36c1.91-2.07 5.34-5.63 6.47-7.74A8.77 8.77 0 0020 10.2c0-4.98-3.8-8.2-8-8.2zm0 11a3 3 0 110-6 3 3 0 010 6z"/>
  </svg>
);
const FaSpinner = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

// KCUTSA Team Members
const teamMembers = [
  { name: "Bilha Wachira", title: "Chairperson / President", imageUrl: "/leaders/BILHA WACHIRA.png" },
  { name: "Samuel Gachago", title: "Secretary General", imageUrl: "/leaders/SAMUEL GACHAGO.png" },
  { name: "Kelvin Karua", title: "Vice Chairperson", imageUrl: "/leaders/KELVIN KARUA.png" },
];

// Animation variants
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };

export default function AboutUs() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("processing");
    setMessage("");

    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for your message! We will get back to you shortly.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="bg-slate-950 text-gray-300 min-h-screen flex flex-col">
      <Navbar />

      <motion.main className="flex-1 p-8 md:p-12 mt-[10%]" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}>
        {/* About Section */}
        <div className="max-w-6xl mx-auto text-center mb-20">
          <motion.h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight" variants={itemVariants}>
            About KCUTSA
          </motion.h1>
          <motion.p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed" variants={itemVariants}>
            We connect students and employers for better opportunities, networking, and career growth. Together, we build the future.
          </motion.p>
        </div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <motion.h2 className="text-3xl font-bold text-white mb-6 text-center" variants={itemVariants}>Meet Our Team</motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div key={idx} className="p-6 rounded-3xl bg-gray-900 shadow-2xl text-center" variants={itemVariants}>
                <Image
                  src={member.imageUrl}
                  alt={member.name}
                  width={128}      // corresponds to w-32
                  height={128}     // corresponds to h-32
                  className="mx-auto rounded-full object-cover mb-4"
                />
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-gray-400">{member.title}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <motion.div className="bg-gray-900 p-8 md:p-10 rounded-3xl shadow-2xl" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-white mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full px-5 py-3 rounded-xl bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" required />
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className="w-full px-5 py-3 rounded-xl bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" required />
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Your Message" className="w-full px-5 py-3 rounded-xl bg-slate-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none" required />
              <button type="submit" disabled={status==="processing"} className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:from-blue-700 hover:to-purple-700 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {status==="processing" ? <><FaSpinner className="animate-spin mr-2"/>Sending...</> : "Send Message"}
              </button>
            </form>
            {message && <motion.div initial={{opacity:0}} animate={{opacity:1}} className={`mt-6 text-sm font-medium text-center ${status==="success"?"text-green-400":"text-red-400"}`}>{message}</motion.div>}
          </motion.div>

          {/* Contact Info */}
          <motion.div className="lg:flex lg:flex-col lg:justify-center" variants={itemVariants}>
            <h2 className="text-3xl font-bold text-white mb-6 lg:text-left text-center">Contact Information</h2>
            <ul className="space-y-6">
              <motion.li className="flex items-center space-x-4 p-4 rounded-xl bg-gray-900 shadow-md" variants={itemVariants}>
                <MdEmail className="text-blue-400 flex-shrink-0" size={32} />
                <div>
                  <span className="block text-sm font-semibold text-gray-400">Email Address</span>
                  <a href="mailto:kirinyagacountystudentskcutsa@gmail.com" className="text-white hover:text-blue-400 transition-colors duration-300">kirinyagacountystudentskcutsa@gmail.com</a>
                </div>
              </motion.li>
              <motion.li className="flex items-center space-x-4 p-4 rounded-xl bg-gray-900 shadow-md" variants={itemVariants}>
                <MdPhone className="text-green-400 flex-shrink-0" size={32} />
                <div>
                  <span className="block text-sm font-semibold text-gray-400">Phone Number</span>
                  <a href="tel:+254700123456" className="text-white hover:text-green-400 transition-colors duration-300">+254 700 123 456</a>
                </div>
              </motion.li>
              <motion.li className="flex items-center space-x-4 p-4 rounded-xl bg-gray-900 shadow-md" variants={itemVariants}>
                <MdLocationOn className="text-red-400 flex-shrink-0" size={32} />
                <div>
                  <span className="block text-sm font-semibold text-gray-400">Our Office</span>
                  <address className="not-italic text-white">Nairobi, Kenya</address>
                </div>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}