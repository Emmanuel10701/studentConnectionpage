"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const pageTransition = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Data for all terms and conditions with detailed descriptions
const allTerms = [
  { 
    id: 1,
    title: "1. Membership and Eligibility",
    intro: "The KCSO community is built on a foundation of trust and shared purpose. To ensure a productive and safe environment for all members, we have established clear guidelines for joining and maintaining your membership.",
    subSections: [
      { subTitle: "1.1. Eligibility:", content: "Membership is open to all students and recent graduates who reside in or have a strong connection to Kirinyaga County. This includes both current university students and those who have recently completed their studies." },
      { subTitle: "1.2. Registration:", content: "To become a member, you must complete the official registration process on our platform, providing accurate and up-to-date information. Inaccurate data may lead to suspension or termination of your account." },
      { subTitle: "1.3. Account Security:", content: "You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please notify us immediately of any unauthorized use." }
    ]
  },
  { 
    id: 2,
    title: "2. Our Mission and Purpose",
    intro: "Our organization's core mission is to empower students and recent graduates from Kirinyaga County. We are dedicated to creating a supportive ecosystem that addresses the challenges of professional development and employment.",
    subSections: [
      { subTitle: "2.1. Unite Students:", content: "We aim to create a unified and accessible platform for students from all constituencies of Kirinyaga County to connect, collaborate on projects, and share valuable academic and career resources." },
      { subTitle: "2.2. Connect with Employers:", content: "Our services are designed to facilitate opportunities for members to engage directly with potential employers, discover internships, and explore exclusive job opportunities." },
      { subTitle: "2.3. Reduce Unemployment:", content: "We are committed to equipping our members with the essential skills, professional connections, and robust support needed to overcome the challenges of unemployment and the competitive job market." },
      { subTitle: "2.4. Professional Growth:", content: "We provide resources for personal and professional development, including tailored workshops, mentorship programs from industry experts, and engaging networking events." }
    ]
  },
  { 
    id: 3,
    title: "3. Member Obligations",
    intro: "As a member of KCSO, you have a role in maintaining the integrity and quality of our community. Your compliance with these obligations ensures a positive experience for all participants.",
    subSections: [
      { subTitle: "3.1. Ethical Conduct:", content: "Members must use the platform for its intended purpose and are strictly prohibited from engaging in any malicious, deceptive, or harmful activities that could disrupt the community or compromise security." },
      { subTitle: "3.2. Profile Accuracy:", content: "You agree to keep your personal and professional profile information accurate, complete, and current at all times. This is crucial for effective networking and for connecting you with relevant opportunities." },
      { subTitle: "3.3. Communication:", content: "All communication on the platform, whether public or private, should be professional, respectful, and constructive. We have a zero-tolerance policy for harassment or bullying." }
    ]
  },
  { 
    id: 4,
    title: "4. Code of Conduct",
    intro: "Our Code of Conduct outlines the behavioral standards expected of every member. Adherence to these principles is mandatory for continued access to our services.",
    subSections: [
      { subTitle: "4.1. Respectful Communication:", content: "All members must interact with fellow members, employers, and administrators in a professional and respectful manner. Harassment, discrimination, or any form of harmful behavior will result in immediate suspension or termination." },
      { subTitle: "4.2. Responsible Use:", content: "You agree not to use the organization’s platform to post content that is illegal, defamatory, obscene, or violates the intellectual property rights of others. This includes copyrighted material and private information." },
      { subTitle: "4.3. Accuracy of Information:", content: "You are responsible for ensuring that all personal and professional information you share on our platform, particularly with potential employers, is truthful and accurate. Misrepresentation is a serious breach of these terms." }
    ]
  },
  { 
    id: 5,
    title: "5. Intellectual Property",
    intro: "This section clarifies the ownership of content on the KCSO platform, both that which you create and that which belongs to the organization.",
    subSections: [
      { subTitle: "5.1. User Content:", content: "You retain all ownership rights to the content you post on the platform. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute it in connection with our services for the purpose of promoting the organization." },
      { subTitle: "5.2. KCSO Content:", content: "All materials on the platform, including logos, text, graphics, and software, are the property of KCSO and are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or modify these materials without explicit written consent." }
    ]
  },
  { 
    id: 6,
    title: "6. Third-Party Links",
    intro: "Our platform may contain links to external websites and services that are not owned or controlled by KCSO.",
    subSections: [
      { subTitle: "6.1. Disclaimer:", content: "We do not endorse and are not responsible for the content, privacy policies, or practices of these websites. You access them at your own risk. We encourage you to read the terms and policies of any third-party site you visit." }
    ]
  },
  { 
    id: 7,
    title: "7. Privacy Policy",
    intro: "Your privacy is important to us. This section outlines our commitment to protecting your personal information.",
    subSections: [
      { subTitle: "7.1. Agreement:", content: "Our Privacy Policy outlines in detail how we collect, use, and protect your personal data. By agreeing to these Terms, you also agree to our Privacy Policy, which is incorporated by reference." }
    ]
  },
  { 
    id: 8,
    title: "8. Disclaimers and Limitation of Liability",
    intro: "It is important that you understand the legal limits of our responsibility and the 'as-is' nature of our services.",
    subSections: [
      { subTitle: "8.1. Disclaimer:", content: "The services are provided on an 'as-is' and 'as-available' basis without any warranties, express or implied. We do not guarantee job placement and our role is solely to facilitate connections and opportunities, not to guarantee outcomes." },
      { subTitle: "8.2. Limitation of Liability:", content: "The KCSO is not liable for any direct, indirect, incidental, or consequential damages resulting from your membership or use of our services, including but not limited to loss of data or revenue." }
    ]
  },
  { 
    id: 9,
    title: "9. Termination of Membership",
    intro: "We reserve the right to manage our community and, in certain circumstances, terminate membership.",
    subSections: [
      { subTitle: "9.1. Right to Terminate:", content: "We reserve the right to suspend or terminate your membership at our sole discretion if you violate any of these Terms or engage in conduct we deem harmful to the community." }
    ]
  },
  { 
    id: 10,
    title: "10. Governing Law",
    intro: "This section establishes the legal framework for these terms and any disputes that may arise.",
    subSections: [
      { subTitle: "10.1. Jurisdiction:", content: "These Terms and any disputes related to them shall be governed by and construed in accordance with the laws of the Republic of Kenya." }
    ]
  },
  { 
    id: 11,
    title: "11. Dispute Resolution",
    intro: "We believe in resolving disagreements fairly and efficiently.",
    subSections: [
      { subTitle: "11.1. Arbitration:", content: "Any disputes arising from these terms will be resolved through a binding arbitration process in accordance with Kenyan law, as an alternative to litigation." }
    ]
  },
  { 
    id: 12,
    title: "12. Amendments to Terms",
    intro: "Our organization and the legal landscape may change over time, requiring updates to these terms.",
    subSections: [
      { subTitle: "12.1. Right to Modify:", content: "We reserve the right to modify these terms and conditions at any time. We will notify you of any significant changes via email or an in-app notification to ensure you are always informed." }
    ]
  },
  { 
    id: 13,
    title: "13. Contact Information",
    intro: "We are here to help if you have questions about these terms or our services.",
    subSections: [
      { subTitle: "13.1. General Inquiries:", content: "For any questions or concerns regarding these terms, please feel free to contact us at support@kcso.org. We aim to respond to all inquiries in a timely manner." }
    ]
  },
  { 
    id: 14,
    title: "14. Force Majeure",
    intro: "We are not liable for circumstances beyond our reasonable control.",
    subSections: [
      { subTitle: "14.1. Unforeseen Events:", content: "The KCSO is not liable for any failure or delay in performance of its obligations under these terms due to acts of God, war, terrorism, pandemics, or other events beyond its reasonable control." }
    ]
  },
  { 
    id: 15,
    title: "15. Indemnification",
    intro: "You agree to hold us harmless from certain legal claims.",
    subSections: [
      { subTitle: "15.1. Your Responsibility:", content: "You agree to indemnify and hold harmless the KCSO and its directors, employees, and agents from any and all claims, damages, liabilities, and expenses (including legal fees) arising from your use of the services or your breach of these terms." }
    ]
  },
  { 
    id: 16,
    title: "16. Assignment",
    intro: "Your membership is personal to you and cannot be transferred.",
    subSections: [
      { subTitle: "16.1. No Transfer:", content: "You may not assign or transfer your membership or any rights and obligations under these terms to any other person or entity without our prior written consent." }
    ]
  },
  { 
    id: 17,
    title: "17. Waiver",
    intro: "Our failure to enforce a term does not mean we've waived that right in the future.",
    subSections: [
      { subTitle: "17.1. Enforcement:", content: "The failure of KCSO to enforce any right or provision of these terms will not be deemed a waiver of such right or provision." }
    ]
  },
  { 
    id: 18,
    title: "18. Severability",
    intro: "If any part of these terms is found to be unenforceable, the rest of the terms still apply.",
    subSections: [
      { subTitle: "18.1. Invalidity:", content: "If any provision of these terms is found to be invalid or unenforceable by a court of law, the remaining provisions will continue to be in full force and effect." }
    ]
  },
  { 
    id: 19,
    title: "19. Entire Agreement",
    intro: "These terms represent the full agreement between you and us.",
    subSections: [
      { subTitle: "19.1. Full Scope:", content: "These terms, along with our Privacy Policy, constitute the entire agreement between you and the KCSO regarding your use of the services." }
    ]
  },
  { 
    id: 20,
    title: "20. Feedback and Submissions",
    intro: "We value your input and appreciate any feedback you provide.",
    subSections: [
      { subTitle: "20.1. Non-Confidential:", content: "Any feedback, comments, or suggestions you provide regarding the platform are non-confidential and we may use them without any obligation to you." }
    ]
  }
];

const TERMS_PER_PAGE = 10;
const totalPages = Math.ceil(allTerms.length / TERMS_PER_PAGE);

export default function TermsAndConditions() {
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * TERMS_PER_PAGE;
  const endIndex = startIndex + TERMS_PER_PAGE;
  const currentTerms = allTerms.slice(startIndex, endIndex);

  return (
    <motion.div
      className="bg-slate-950 text-gray-300 min-h-screen p-8 md:p-12 font-sans overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto">
        {/* Title Section */}
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2"
          variants={itemVariants}
        >
          Terms and Conditions of Membership
        </motion.h1>
        
        <motion.h3 className="text-sm text-gray-500 text-center mb-10" variants={itemVariants}>
          Last Updated: October 26, 2023
        </motion.h3>

        {/* Conditional content based on the current page */}
        <AnimatePresence mode="wait">
          <motion.div key={currentPage} variants={pageTransition} initial="initial" animate="animate" exit="exit">
            {currentTerms.map((term, index) => (
              <motion.div
                key={term.id}
                className="bg-slate-900 p-6 rounded-3xl shadow-xl mb-8 border-2 border-slate-800"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-bold text-white mb-4">{term.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-4">{term.intro}</p>
                <ul className="list-inside space-y-3 text-gray-400">
                  {term.subSections.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <span className="font-bold text-blue-400 mr-2">{sub.subTitle}</span>
                      <span>{sub.content}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Pagination Links */}
        <motion.div
          className="mt-10 p-4 rounded-3xl bg-slate-900 shadow-xl border-2 border-blue-600/50 flex items-center justify-center space-x-4 sticky bottom-0 z-10"
          variants={itemVariants}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
              className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 transform hover:scale-110
                ${currentPage === pageNumber 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-transparent text-gray-400 border border-slate-700 hover:bg-slate-800'
                }`}
            >
              {pageNumber}
            </button>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
