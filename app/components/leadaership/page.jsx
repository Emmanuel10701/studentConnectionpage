"use client";
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaLightbulb,
  FaHandshake,
  FaChartLine,
  FaStar,
  FaAward,
  FaGraduationCap,
  FaGlobe,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";


const leadershipData = [
  {
    name: "Bilha Wachira",
    position: "Chairperson / President",
    contribution:
      "Leads the association, represents KCUTSA in official matters, and oversees all activities to ensure the vision and mission are achieved.",
    image: "/leaders/BILHA WACHIRA.png",
    achievements: ["She is good in Chairperson / President."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
  {
    name: "Samuel Gachago",
    position: "Secretary General",
    contribution:
      "Manages communication within the association, records minutes, and coordinates administrative duties.",
    image: "/leaders/SAMUEL GACHAGO.png",
    achievements: ["He is good in Secretary General."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
  {
    name: "Kelvin Karua",
    position: "Vice Chairperson",
    contribution:
      "Supports the Chairperson and assumes leadership duties in their absence.",
    image: "/leaders/KELVIN KARUA.png",
    achievements: ["He is good in Vice Chairperson."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
  {
    name: "Beatrice Njeri",
    position: "Vice Secretary General",
    contribution:
      "Assists the Secretary General in administrative and communication tasks.",
    image: "/leaders/BEATRICE NJERI.png",
    achievements: ["She is good in Vice Secretary General."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
  {
    name: "Beatrice Njogu",
    position: "Finance Secretary",
    contribution:
      "Oversees all financial matters, including budgeting, fundraising, and expense management.",
    image: "/leaders/BEATRICE NJOGU.png",
    achievements: ["She is good in Finance Secretary."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
  {
    name: "Ian Mucomba",
    position: "Communication Director",
    contribution:
      "Leads public relations, manages media, and ensures the association's message reaches members and the public.",
    image: "/leaders/IAN MUCOMBA.png",
    achievements: ["He is good in Communication Director."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
  {
    name: "Josephat Gichuhi",
    position: "Interfaith Director",
    contribution:
      "Promotes religious harmony and coordinates interfaith activities among members.",
    image: "/leaders/JOSEPHAT GICHUHI.png",
    achievements: ["He is good in Interfaith Director."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
  {
    name: "Zilpha Wachira",
    position: "Welfare Secretary",
    contribution:
      "Focuses on the well-being of members, organizing support services and welfare programs.",
    image: "/leaders/ZILPHA WACHIRA.png", // No exact match for Zilpha Wachira image provided, so I used the flag
    achievements: ["She is good in Welfare Secretary."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
  {
    name: "Nancy Wambui",
    position: "PWD Director",
    contribution:
      "Advocates for persons with disabilities and ensures inclusivity within the association.",
    image: "/leaders/NANCY WAMBUI.png",
    achievements: ["She is good in PWD Director."],
    social: { linkedin: "#", twitter: "#", email: "kirinyagacountystudentskcutsa@gmail.com" },
  },
];

const whyUsData = [
  {
    icon: <FaUsers className="text-4xl" />,
    title: "Community Focused",
    description:
      "We foster an inclusive environment where every student can thrive and find their voice.",
    features: ["Peer Support Networks", "Cultural Diversity", "Inclusive Events"],
    color: "from-blue-500 to-blue-600",
  },
{
  icon: <FaLightbulb className="text-4xl" />,
  title: "Learning & Partnership",
  description: "The Kenya Institute Of Technology — fostering innovation, collaboration, and student growth.",
  features: ["Project-Based Learning", "Creative Workshops", "Innovation Labs"],
  color: "from-yellow-500 to-orange-500",
},

  {
    icon: <FaHandshake className="text-4xl" />,
    title: "Industry Partnerships",
    description:
      "We collaborate with top companies to provide students with real-world experience.",
    features: ["Internship Programs", "Industry Mentors", "Career Fairs"],
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <FaChartLine className="text-4xl" />,
    title: "Career Growth",
    description:
      "We offer comprehensive career services and internships to prepare students for success.",
    features: ["Career Counseling", "Resume Building", "Interview Prep"],
    color: "from-purple-500 to-pink-500",
  },
];

// Animation variants (unchanged)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function LeadershipAndWhyUs() {
  const [activeTab, setActiveTab] = useState("leadership");
  const [pageIndex, setPageIndex] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(1);

  // Responsive cards per page
  useEffect(() => {
    function updateCardsPerPage() {
      if (window.innerWidth >= 1024) setCardsPerPage(3);
      else if (window.innerWidth >= 768) setCardsPerPage(2);
      else setCardsPerPage(1);
    }
    updateCardsPerPage();
    window.addEventListener("resize", updateCardsPerPage);
    return () => window.removeEventListener("resize", updateCardsPerPage);
  }, []);

  const totalPages = Math.ceil(leadershipData.length / cardsPerPage);

  // Navigation handlers
  const handleNextPage = () => {
    setPageIndex((prev) => (prev + 1) % totalPages);
  };
  const handlePrevPage = () => {
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  // Slice visible leaders
  let visibleLeaders = leadershipData.slice(
    pageIndex * cardsPerPage,
    pageIndex * cardsPerPage + cardsPerPage
  );

  // Fill from start if slice short
  if (visibleLeaders.length < cardsPerPage) {
    visibleLeaders = visibleLeaders.concat(
      leadershipData.slice(0, cardsPerPage - visibleLeaders.length)
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 px-4 md:px-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
            <button
              onClick={() => setActiveTab("leadership")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "leadership"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              Our Leadership
            </button>
            <button
              onClick={() => setActiveTab("whyus")}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "whyus"
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              Why Choose Us
            </button>
          </div>
        </div>

        {/* Leadership Section */}
        {activeTab === "leadership" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Meet Our Leaders
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Exceptional individuals driving change and fostering growth within
                our community
              </p>
            </motion.div>

            <div className="relative">
              {/* Carousel container */}
              <div className="flex space-x-6 overflow-hidden">
                {visibleLeaders.map((leader, idx) => (
                  <motion.div
                    key={leader.name + idx}
                    variants={itemVariants}
                    className="flex-shrink-0 group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
                    style={{
                      width:
                        cardsPerPage === 1
                          ? "100%"
                          : cardsPerPage === 2
                          ? "48%"
                          : "30%",
                    }}
                  >
                    {/* Profile Image */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all duration-300">
                        <img
                          src={leader.image}
                          alt={leader.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <FaStar className="text-white text-sm" />
                      </div>
                    </div>

                    {/* Leader Info */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors duration-300">
                        {leader.name}
                      </h3>
                      <p className="text-blue-400 font-semibold mb-3">
                        {leader.position}
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {leader.contribution}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div className="space-y-2 mb-6">
                      {leader.achievements.map((achievement, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <FaAward className="text-yellow-500 text-xs" />
                          <span className="text-gray-300">{achievement}</span>
                        </div>
                      ))}
                    </div>

                    {/* Social Links */}
                    <div className="flex justify-center space-x-4">
                      {Object.entries(leader.social).map(([platform, link]) => (
                        <a
                          key={platform}
                          href={link}
                          className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
                        >
                          {(platform === "linkedin" ||
                            platform === "twitter" ||
                            platform === "email") && <FaGlobe />}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrevPage}
                aria-label="Previous Leaders"
                className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-gray-800 hover:bg-white/40 transition"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextPage}
                aria-label="Next Leaders"
                className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-3 text-gray-800 hover:bg-white/40 transition"
              >
                <FaChevronRight />
              </button>
            </div>
          </motion.div>
        )}

        {/* Why Us Section */}
        {activeTab === "whyus" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-16"
          >
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Why Choose KCUTSA
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover what makes us the premier choice for students seeking
                excellence and growth
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {whyUsData.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 hover:border-gray-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                    {/* Icon */}
                    <div
                      className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}
                    >
                      {item.icon}
                    </div>

                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-2">
                        {item.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2 text-xs"
                          >
                            <FaGraduationCap className="text-blue-400" />
                            <span className="text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-sm rounded-3xl p-8 border border-blue-500/30">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Join Our Community?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Take the first step towards your future with KCUTSA. Connect with
                  like-minded individuals and unlock opportunities that will shape your
                  career.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg">
                    Get Started Today
                  </button>
                  <button className="px-8 py-4 border border-blue-500 text-blue-400 rounded-xl font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
