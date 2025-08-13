"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaUsers,
  FaHandshake,
  FaGraduationCap,
  FaBriefcase,
  FaLightbulb,
} from "react-icons/fa";

const slides = [
  {
    image: "/images/im1.jpg",
    title: "Empowering Youth",
    subtitle: "Vision 1: Leadership & Education",
    description:
      "KCUTSA unites tertiary students from Kirinyaga County, fostering leadership skills and academic excellence through collaborative programs and initiatives.",
    icon: <FaUsers />,
  },
  {
    image: "/images/im2.jpg",
    title: "Connecting Students",
    subtitle: "Vision 2: Alumni & Employers",
    description:
      "We bridge the gap between talented youth and potential employers, creating meaningful connections that lead to internships, jobs, and career growth.",
    icon: <FaHandshake />,
  },
  {
    image: "/images/im3.jpg",
    title: "Building Leaders",
    subtitle: "Vision 3: Future Challenges",
    description:
      "Our leadership development programs equip students with essential skills for community service, governance, and professional success.",
    icon: <FaGraduationCap />,
  },
  {
    image: "/images/im4.jpg",
    title: "Mentorship Programs",
    subtitle: "Vision 4: Career Development",
    description:
      "Experienced alumni and industry professionals mentor current students, providing guidance for career paths and personal development.",
    icon: <FaLightbulb />,
  },
  {
    image: "/images/im5.jpg",
    title: "Career Fairs",
    subtitle: "Vision 5: Networking Opportunities",
    description:
      "Regular career fairs, workshops, and networking events connect our community with industry leaders and employment opportunities.",
    icon: <FaBriefcase />,
  },
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl mt-6 bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ minHeight: "24rem", maxHeight: "48rem" }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="relative w-full h-[32rem] md:h-[40rem] lg:h-[48rem]"
          style={{ backgroundColor: "#000" }} // prevent white flash
        >
          {/* Image */}
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
          {/* Caption */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white max-w-4xl mx-auto p-4 md:p-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-600 mb-2">
              {slides[currentIndex].title}
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl mt-1 mb-3 text-white/90 drop-shadow-md">
              {slides[currentIndex].subtitle}
            </h3>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed drop-shadow-md">
              {slides[currentIndex].description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {isHovered && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute top-1/2 left-5 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-3 backdrop-blur-sm transition"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-5 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-3 backdrop-blur-sm transition"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="flex justify-center space-x-3 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentIndex ? "bg-blue-600 scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Play/Pause */}
      <button
        onClick={togglePlayPause}
        className="absolute top-5 right-5 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>
    </div>
  );
}