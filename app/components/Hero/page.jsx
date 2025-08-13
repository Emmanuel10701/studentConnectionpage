'use client'
import { motion } from 'framer-motion';
// --- Start of update ---
// Import your image here. Replace './flag.png' with the correct path to your image file.
import backgroundImage from '../../../public/leaders/KCUTSA_FLAG.png';

export default function Home() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    initial: { y: 0 },
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero Background with an imported image */}
      {/* The grid overlay has been removed to simplify the background with the new image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url(${backgroundImage.src})`
        }}
      >
        {/* Add a dark overlay to make text more readable on top of the image */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      {/* --- End of update --- */}

      {/* Floating Elements - The `top`, `bottom`, `left`, `right` classes are reduced to move them inwards */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Top Left - University Icon */}
        <motion.div 
          className="absolute top-6 md:top-14 left-6 md:left-14 w-12 h-12 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center"
          variants={floatingVariants}
          initial="initial"
          animate="float"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-.857.375a1 1 0 00.356 1.82l7 3a1 1 0 00.788 0l7-3a1 1 0 00.356-1.82l-.857-.375a1 1 0 11.788-1.838l4 1.714a1 1 0 01.356.257l2.25 2.25a1 1 0 00.356.257l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
          </svg>
        </motion.div>

        {/* Top Right - Unity Icon */}
        <motion.div 
          className="absolute top-14 md:top-22 right-6 md:right-22 w-12 h-12 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center"
          variants={floatingVariants}
          initial="initial"
          animate="float"
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </motion.div>

        {/* Center Left - Leadership Icon */}
        <motion.div 
          className="absolute top-1/2 left-4 md:left-10 w-12 h-12 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center"
          variants={floatingVariants}
          initial="initial"
          animate="float"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
          </svg>
        </motion.div>

        {/* Center Right - Empowerment Icon */}
        <motion.div 
          className="absolute top-1/2 right-4 md:right-10 w-16 h-16 md:w-20 md:h-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center"
          variants={floatingVariants}
          initial="initial"
          animate="float"
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ duration: 0.3, delay: 1.5 }}
        >
          <svg className="w-8 h-8 md:w-10 md:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </motion.div>

        {/* Bottom Left - Integrity Icon */}
        <motion.div 
          className="absolute bottom-14 md:bottom-22 left-6 md:left-22 w-12 h-12 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center"
          variants={floatingVariants}
          initial="initial"
          animate="float"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3, delay: 2 }}
        >
          <svg className="w-6 h-6 md:w-8 md:h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </motion.div>

        {/* Bottom Right - Service Icon */}
        <motion.div 
          className="absolute bottom-4 md:bottom-6 right-4 md:right-6 w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center"
          variants={floatingVariants}
          initial="initial"
          animate="float"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3, delay: 2.5 }}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center text-white">
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Content */}
          <motion.div 
            className="text-center max-w-4xl lg:max-w-5xl mx-auto mb-8 sm:mb-12 lg:mb-16"
            variants={itemVariants}
          >
            {/* KCUTSA Logo Placeholder */}
            <motion.div 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-blue-600 rounded-full mx-auto mb-6 sm:mb-8 flex items-center justify-center shadow-2xl"
              whileHover={{ 
                scale: 1.05,
                rotate: 5,
                boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.4)"
              }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-white text-lg sm:text-xl md:text-2xl font-bold">KCUTSA</span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 sm:mb-8 leading-tight"
              variants={itemVariants}
            >
              <span className="text-white">
                KCUTSA
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl sm:max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed font-medium px-2"
              variants={itemVariants}
            >
              Uniting • Empowering • Leading
            </motion.p>

            <motion.p 
              className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-2xl sm:max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
              variants={itemVariants}
            >
              Kirinyaga County University and Tertiary Students Association
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
              variants={itemVariants}
            >
              <motion.button 
                className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 25px 50px -12px rgba(37, 99, 235, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Join KCUTSA
              </motion.button>
              <motion.button 
                className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white border-2 sm:border-3 border-blue-600 text-blue-600 font-bold text-lg sm:text-xl rounded-xl sm:rounded-2xl hover:bg-blue-50 hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  backgroundColor: "#eff6ff"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Key Values Grid */}
          <motion.div 
            className="max-w-5xl lg:max-w-6xl mx-auto px-4"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Vision */}
              <motion.div 
                className="text-center"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Vision</h3>
                <p className="text-xs sm:text-sm text-gray-200 px-2">To be the leading student organization in youth empowerment, integrity, and leadership.</p>
                <p className="text-xs sm:text-sm text-gray-200 px-2">We strive to create a vibrant community of students who are passionate about making a difference.</p>
                <p className="text-xs sm:text-sm text-gray-200 px-2">Our goal is to foster a culture of excellence and service that extends beyond the university campus.</p>
              </motion.div>

              {/* Mission */}
              <motion.div 
                className="text-center"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Mission</h3>
                <p className="text-xs sm:text-sm text-gray-200 px-2">To serve as a unifying factor for all Kirinyaga tertiary students, promoting a sense of community and shared purpose.</p>
                <p className="text-xs sm:text-sm text-gray-200 px-2">We are committed to providing our members with opportunities for personal and professional growth.</p>
                <p className="text-xs sm:text-sm text-gray-200 px-2">By fostering collaboration and mutual support, we aim to build a strong network of future leaders.</p>
              </motion.div>

              {/* Values */}
              <motion.div 
                className="text-center sm:col-span-2 lg:col-span-1"
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-100 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <svg className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Values</h3>
                <p className="text-xs sm:text-sm text-gray-200 px-2">Our core values are Empowerment, Integrity, and Leadership, which guide every action we take.</p>
                <p className="text-xs sm:text-sm text-gray-200 px-2">We believe in empowering our members to reach their full potential and lead with integrity.</p>
                <p className="text-xs sm:text-sm text-gray-200 px-2">These values form the foundation of our work and our commitment to serving the community.</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
