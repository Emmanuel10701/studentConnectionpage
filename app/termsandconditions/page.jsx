"use client";

import React from "react";
import { motion } from "framer-motion";

// Inline SVG icon for a consistent, charming look
const IoMdCheckmarkCircleOutline = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M416 128L192 384 96 288"/><circle cx="256" cy="256" r="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg>
);

// Animation variants for staggered fade-in effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Mock useRouter for standalone functionality within this environment
const useRouter = () => ({
  back: () => {
    // In a real Next.js app, this would perform a client-side navigation.
    // For this demonstration, we'll just log a message.
    console.log("Navigating back...");
    window.history.back();
  }
});

export default function TermsAndConditions() {
  const router = useRouter();
  
  const handleAgree = () => {
    // This now pushes the user back to the previous page.
    router.back();
  };

  return (
    <motion.div
      className="bg-slate-950 text-gray-300 min-h-screen p-8 md:p-12 font-sans"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2"
          variants={itemVariants}
        >
          Terms and Conditions of Membership
        </motion.h1>
        
        <motion.h3 className="text-sm text-gray-500 mb-10" variants={itemVariants}>
          Last Updated: October 26, 2023
        </motion.h3>

        {/* Introduction */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <p className="text-lg text-gray-400 leading-relaxed">
            Welcome to the Kirinyaga County Student Organization (KCSO)! These Terms and Conditions of Membership ("Terms") govern your use of and participation in our services and community. By becoming a member, you agree to be bound by these Terms.
          </p>
        </motion.div>
        
        {/* Section 1: Membership and Eligibility */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">1. Membership and Eligibility</h2>
          <ul className="list-inside space-y-3 text-gray-400">
            <li><span className="font-bold text-blue-400 mr-2">1.1. Eligibility:</span> Membership is open to all students and recent graduates who reside in or have a strong connection to Kirinyaga County.</li>
            <li><span className="font-bold text-blue-400 mr-2">1.2. Registration:</span> To become a member, you must complete the official registration process, providing accurate and up-to-date information.</li>
            <li><span className="font-bold text-blue-400 mr-2">1.3. Account Security:</span> You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</li>
          </ul>
        </motion.div>

        {/* Section 2: Our Mission and Purpose */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">2. Our Mission and Purpose</h2>
          <p className="text-gray-400 mb-4">
            The primary purpose of the KCSO is to foster a strong, supportive network among students and to bridge the gap between education and employment.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>**Unite Students:** Create a unified platform for students from all constituencies of Kirinyaga County to connect, collaborate, and share resources.</li>
            <li>**Connect with Employers:** Facilitate opportunities for members to engage directly with potential employers, internships, and job opportunities.</li>
            <li>**Reduce Unemployment:** Equip our members with the skills, connections, and support needed to reduce the challenges of unemployment and job hunting.</li>
            <li>**Professional Growth:** Provide resources for personal and professional development, including workshops, mentorship programs, and networking events.</li>
          </ul>
        </motion.div>

        {/* Section 3: Member Obligations */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">3. Member Obligations</h2>
          <ul className="list-inside space-y-3 text-gray-400">
            <li><span className="font-bold text-blue-400 mr-2">3.1. Ethical Conduct:</span> Members must use the platform for its intended purpose and refrain from any malicious or deceptive activities.</li>
            <li><span className="font-bold text-blue-400 mr-2">3.2. Profile Accuracy:</span> You agree to keep your personal and professional profile information accurate, complete, and up-to-date.</li>
            <li><span className="font-bold text-blue-400 mr-2">3.3. Communication:</span> All communication on the platform should be respectful and professional.</li>
          </ul>
        </motion.div>

        {/* Section 4: Code of Conduct */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">4. Code of Conduct</h2>
          <ul className="list-inside space-y-3 text-gray-400">
            <li><span className="font-bold text-blue-400 mr-2">4.1. Respectful Communication:</span> All members must interact with fellow members, employers, and administrators in a professional and respectful manner. Harassment, discrimination, or any form of harmful behavior will not be tolerated.</li>
            <li><span className="font-bold text-blue-400 mr-2">4.2. Responsible Use:</span> You agree not to use the organization’s platform to post content that is illegal, defamatory, obscene, or violates the intellectual property rights of others.</li>
            <li><span className="font-bold text-blue-400 mr-2">4.3. Accuracy of Information:</span> You are responsible for ensuring that all personal and professional information you share on our platform, particularly with potential employers, is truthful and accurate.</li>
          </ul>
        </motion.div>

        {/* Section 5: Intellectual Property */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
          <ul className="list-inside space-y-3 text-gray-400">
            <li><span className="font-bold text-blue-400 mr-2">5.1. User Content:</span> You retain all ownership rights to the content you post on the platform. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute it in connection with our services.</li>
            <li><span className="font-bold text-blue-400 mr-2">5.2. KCSO Content:</span> All materials on the platform, including logos, text, and graphics, are the property of KCSO and are protected by copyright and other intellectual property laws.</li>
          </ul>
        </motion.div>

        {/* Section 6: Third-Party Links */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Links</h2>
          <p className="text-gray-400">
            The platform may contain links to third-party websites or services. We do not endorse and are not responsible for the content, privacy policies, or practices of these websites. You access them at your own risk.
          </p>
        </motion.div>
        
        {/* Section 7: Privacy Policy */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">7. Privacy Policy</h2>
          <p className="text-gray-400">
            Our Privacy Policy outlines how we collect, use, and protect your personal data. By agreeing to these Terms, you also agree to our Privacy Policy.
          </p>
        </motion.div>

        {/* Section 8: Disclaimers and Limitation of Liability */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimers and Limitation of Liability</h2>
          <p className="text-gray-400">
            The services are provided on an "as-is" and "as-available" basis. We do not guarantee job placement and our role is solely to facilitate connections and opportunities. The KCSO is not liable for any direct, indirect, incidental, or consequential damages resulting from your membership or use of our services.
          </p>
        </motion.div>

        {/* Section 9: Termination of Membership */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">9. Termination of Membership</h2>
          <p className="text-gray-400">
            We reserve the right to suspend or terminate your membership at our discretion if you violate any of these Terms.
          </p>
        </motion.div>

        {/* Section 10: Governing Law */}
        <motion.div className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
          <p className="text-gray-400">
            These Terms shall be governed by the laws of the Republic of Kenya.
          </p>
        </motion.div>

        {/* Final Acknowledgment and Action Button */}
        <motion.div className="mt-10 p-6 rounded-3xl bg-slate-900 shadow-xl border-2 border-blue-600/50 flex flex-col items-center" variants={itemVariants}>
          <p className="text-center text-lg font-semibold text-blue-400 mb-6">
            By clicking "I Agree and Continue," you acknowledge that you have read, understood, and agree to these Terms and Conditions.
          </p>
          <button
            onClick={handleAgree}
            className="flex items-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
          >
            <IoMdCheckmarkCircleOutline />
            <span>I Agree and Continue</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
