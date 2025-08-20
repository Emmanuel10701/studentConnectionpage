"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Users,
  Building2,
  Edit,
  Save,
  Mail,
  Phone,
  Globe,
  MapPin,
  ClipboardList,
  Fingerprint,
  Calendar,
  CreditCard,
  Building,
  Link,
  FileText
} from 'lucide-react';

// A mock data object for the employer's company profile with more comprehensive details
const initialCompanyProfile = {
  basic: {
    name: "Tech Innovators Inc.",
    industry: "IT and Software",
    description: "We are a leading technology company dedicated to creating innovative solutions that solve complex problems. Our team is passionate about mentorship and empowering the next generation of tech talent.",
    foundedDate: "2010-05-15",
    companySize: "500-1000 employees",
    logoUrl: "https://placehold.co/128x128/E0E7FF/4F46E5?text=TI",
  },
  contact: {
    email: "careers@techinnovators.com",
    phone: "+254 712 345 678",
    website: "https://www.techinnovators.com",
  },
  address: {
    street: "123 Innovation Drive",
    city: "Nairobi",
    county: "Nairobi County",
    country: "Kenya",
    postalCode: "00100",
  },
  legal: {
    businessRegistrationNumber: "BRN/2010/05/154321",
    kraPin: "A123456789Z",
    businessPermitNumber: "BPN/2023/KRA/5678",
    licenseExpiryDate: "2024-12-31",
    vatNumber: "VAT/2010/9876",
    legalName: "Tech Innovators (Kenya) Limited",
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/tech-innovators-inc",
    twitter: "https://twitter.com/techinnovators",
    facebook: "",
    instagram: "",
  },
};

// Predefined list of industries for the dropdown menu
const INDUSTRY_OPTIONS = [
  'IT and Software',
  'Agriculture',
  'Finance',
  'Healthcare',
  'Education',
  'Manufacturing',
  'Retail',
  'Hospitality',
  'Construction',
  'Media & Entertainment',
  'Other'
];

// Define animation variants for a staggered reveal effect on component load
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger the animation of child elements
      delayChildren: 0.2 // Delay the start of child animations
    }
  }
};

const CompanyProfile = () => {
  const [profile, setProfile] = useState(initialCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);

  // Use a modern and readable way to handle nested state updates
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');

    setProfile(prevProfile => ({
      ...prevProfile,
      [section]: {
        ...prevProfile[section],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    if (isEditing && !INDUSTRY_OPTIONS.includes(profile.basic.industry)) {
      setShowOtherIndustry(true);
    } else {
      setShowOtherIndustry(false);
    }
  }, [isEditing, profile.basic.industry]);

  const handleIndustryChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setShowOtherIndustry(true);
      setProfile(prevProfile => ({
        ...prevProfile,
        basic: { ...prevProfile.basic, industry: '' }
      }));
    } else {
      setShowOtherIndustry(false);
      handleProfileChange(e);
    }
  };

  // A component to render a single field, based on whether we are in editing mode
  // The motion.div has been removed from this component to stop individual field animations
  const Field = ({ label, value, name, type = 'text', icon: Icon }) => (
    <div className="mb-4">
      <div className="flex items-center text-gray-700 font-semibold mb-2">
        {Icon && <Icon size={18} className="mr-2 text-blue-600" />}
        <span>{label}</span>
      </div>
      {isEditing ? (
        type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={handleProfileChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm resize-y"
            rows="3"
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleProfileChange}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        )
      ) : (
        <p className="text-gray-600 text-sm break-words">{value || 'N/A'}</p>
      )}
    </div>
  );

  return (
    // Main container with a subtle fade-in animation, now set to take up the full screen
    <motion.div
      className="p-4 sm:p-8 bg-white w-full min-h-screen font-sans"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <motion.h1 className="text-3xl font-extrabold text-gray-900" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
            Company Profile
          </motion.h1>
          <motion.button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 font-bold py-2 px-6 rounded-full shadow-lg transform transition-all duration-300 text-sm whitespace-nowrap
              ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            whileHover={{ scale: 1.05, boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)" }}
            whileTap={{ scale: 0.95 }}
            variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
          >
            {isEditing ? <><Save size={18} /> Save</> : <><Edit size={18} /> Edit Profile</>}
          </motion.button>
        </div>

        {/* Main Profile Header Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8 pb-8 border-b border-gray-200">
          <motion.img
            src={profile.basic.logoUrl}
            alt={`${profile.basic.name} logo`}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg mx-auto md:mx-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          />
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <input
                type="text"
                name="basic.name"
                value={profile.basic.name}
                onChange={handleProfileChange}
                className="w-full text-3xl font-bold p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              />
            ) : (
              <h2 className="text-3xl font-extrabold text-gray-900">
                {profile.basic.name}
              </h2>
            )}
            <p className="text-sm text-gray-600 mt-2 flex items-center justify-center md:justify-start gap-2">
              <Briefcase size={16} className="text-gray-500" /> {profile.basic.industry} • <Users size={16} className="text-gray-500" /> {profile.basic.companySize}
            </p>
            <div className="mt-4">
              {isEditing ? (
                <textarea
                  name="basic.description"
                  value={profile.basic.description}
                  onChange={handleProfileChange}
                  className="w-full text-gray-500 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm resize-y"
                  rows="4"
                />
              ) : (
                <p className="text-gray-500 leading-relaxed text-sm max-w-xl mx-auto md:mx-0">
                  {profile.basic.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details Grid - Structured for better layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* --- Basic Information Section --- */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-blue-600" /> Basic Info
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <Field label="Founded" value={profile.basic.foundedDate} name="basic.foundedDate" type="date" icon={Calendar} />
              {/* Industry Field with Dropdown */}
              <div>
                <div className="flex items-center text-gray-700 font-semibold mb-2">
                  <Briefcase size={18} className="mr-2 text-blue-600" />
                  <span>Industry</span>
                </div>
                {isEditing ? (
                  <>
                    <select
                      name="basic.industry"
                      value={INDUSTRY_OPTIONS.includes(profile.basic.industry) ? profile.basic.industry : 'Other'}
                      onChange={handleIndustryChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm mb-2"
                    >
                      {INDUSTRY_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <AnimatePresence>
                      {showOtherIndustry && (
                        <motion.input
                          key="other-industry-input"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          type="text"
                          name="basic.industry"
                          placeholder="Specify your industry"
                          value={profile.basic.industry}
                          onChange={handleProfileChange}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm break-words">{profile.basic.industry || 'N/A'}</p>
                )}
              </div>
              <Field label="Company Size" value={profile.basic.companySize} name="basic.companySize" icon={Users} />
            </div>
          </div>

          {/* --- Contact Information Section --- */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-blue-600" /> Contact Details
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <Field label="Email" value={profile.contact.email} name="contact.email" type="email" icon={Mail} />
              <Field label="Phone" value={profile.contact.phone} name="contact.phone" type="tel" icon={Phone} />
              <Field label="Website" value={profile.contact.website} name="contact.website" type="url" icon={Link} />
            </div>
          </div>

          {/* --- Physical Address Section --- */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" /> Physical Address
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <Field label="Street" value={profile.address.street} name="address.street" icon={MapPin} />
              <Field label="City" value={profile.address.city} name="address.city" icon={Building} />
              <Field label="County" value={profile.address.county} name="address.county" icon={MapPin} />
              <Field label="Country" value={profile.address.country} name="address.country" icon={Globe} />
              <Field label="Postal Code" value={profile.address.postalCode} name="address.postalCode" icon={Mail} />
            </div>
          </div>
        </div>

        {/* Second Row of Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* --- Business & Legal Details Section --- */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> Business & Legal
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Business Reg. No." value={profile.legal.businessRegistrationNumber} name="legal.businessRegistrationNumber" icon={ClipboardList} />
              <Field label="KRA PIN" value={profile.legal.kraPin} name="legal.kraPin" icon={Fingerprint} />
              <Field label="Business Permit No." value={profile.legal.businessPermitNumber} name="legal.businessPermitNumber" icon={CreditCard} />
              <Field label="License Expiry" value={profile.legal.licenseExpiryDate} name="legal.licenseExpiryDate" type="date" icon={Calendar} />
              <Field label="VAT Number" value={profile.legal.vatNumber} name="legal.vatNumber" icon={Briefcase} />
              <Field label="Legal Name" value={profile.legal.legalName} name="legal.legalName" icon={Building} />
            </div>
          </div>

          {/* --- Social Media Section --- */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Link size={20} className="text-blue-600" /> Social Links
            </h3>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="social-edit"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Field label="LinkedIn" value={profile.socials.linkedin} name="socials.linkedin" type="url" />
                    <Field label="Twitter" value={profile.socials.twitter} name="socials.twitter" type="url" />
                    <Field label="Facebook" value={profile.socials.facebook} name="socials.facebook" type="url" />
                    <Field label="Instagram" value={profile.socials.instagram} name="socials.instagram" type="url" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="social-view"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {profile.socials.linkedin && (
                      <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold hover:underline text-blue-800">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-800" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22.23 0H1.77C.79 0 0 .79 0 1.77v20.46C0 23.21.79 24 1.77 24h20.46c.98 0 1.77-.79 1.77-1.77V1.77C24 .79 23.21 0 22.23 0zM7.18 20.37H3.63V9.77h3.55v10.6zM5.4 8.21a2.15 2.15 0 1 1 .01-4.31 2.15 2.15 0 0 1-.01 4.31zm14.4 12.16h-3.55v-5.6c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.7h-3.55V9.77h3.41v1.57h.05c.47-.9 1.62-1.85 3.36-1.85 3.6 0 4.26 2.37 4.26 5.46v6.42z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                    {profile.socials.twitter && (
                      <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold hover:underline text-blue-500">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-500" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.932 4.932 0 0 0 2.165-2.724 9.947 9.947 0 0 1-3.136 1.196 4.916 4.916 0 0 0-8.384 4.496A13.972 13.972 0 0 1 1.67 3.51a4.91 4.91 0 0 0-1.638 6.571A4.908 4.908 0 0 0 3.328 8.16a4.897 4.897 0 0 1-2.228-.617v.062a4.922 4.922 0 0 0 3.948 4.827 4.922 4.922 0 0 1-2.217.084c.631 1.94 2.45 3.356 4.606 3.393A9.851 9.851 0 0 1 .45 18.067a13.97 13.97 0 0 0 7.55 2.213c9.055 0 14.008-7.502 14.008-14.004 0-.213-.004-.424-.012-.635a9.98 9.98 0 0 0 2.46-2.544z" />
                        </svg>
                        Twitter
                      </a>
                    )}
                    {profile.socials.facebook && (
                      <a href={profile.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold hover:underline text-blue-600">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-blue-600" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 6.016 4.388 11.054 10.125 11.854v-8.386H7.172v-3.468h2.953V9.387c0-2.91 1.776-4.497 4.354-4.497 1.246 0 2.316.222 2.63.32v3.013h-1.78c-1.397 0-1.666.664-1.666 1.633v2.158h3.32l-.54 3.468h-2.78V23.854C19.612 23.054 24 18.016 24 12c0-6.627-5.373-12-12-12z" />
                        </svg>
                        Facebook
                      </a>
                    )}
                    {profile.socials.instagram && (
                      <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold hover:underline text-pink-600">
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-pink-600" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2.163c3.204 0 3.58.012 4.85.07c3.252.155 4.908 1.811 5.063 5.063.058 1.27.07 1.646.07 4.85s-.012 3.58-.07 4.85c-.155 3.252-1.811 4.908-5.063 5.063-1.27.058-1.646.07-4.85.07s-3.58-.012-4.85-.07c-3.252-.155-4.908-1.811-5.063-5.063-.058-1.27-.07-1.646-.07-4.85s.012-3.58.07-4.85c.155-3.252 1.811-4.908 5.063-5.063 1.27-.058 1.646-.07 4.85-.07zm0-2.163C8.715 0 8.324.012 7.05.07c-3.79.18-6.148 2.538-6.328 6.328-.058 1.27-.07 1.646-.07 4.85s.012 3.58.07 4.85c.18 3.79 2.538 6.148 6.328 6.328 1.27.058 1.646.07 4.85.07s3.58-.012 4.85-.07c3.79-.18 6.148-2.538 6.328-6.328.058-1.27.07-1.646.07-4.85s-.012-3.58-.07-4.85c-.18-3.79-2.538-6.148-6.328-6.328-1.27-.058-1.646-.07-4.85-.07z" />
                          <path d="M12 6.551a5.449 5.449 0 1 0 0 10.898A5.449 5.449 0 0 0 12 6.551zm0 8.95a3.501 3.501 0 1 1 0-7.002 3.501 3.501 0 0 1 0 7.002z" />
                          <circle cx="17.653" cy="6.289" r="1.2" />
                        </svg>
                        Instagram
                      </a>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CompanyProfile;
