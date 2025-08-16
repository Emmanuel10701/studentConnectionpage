"use client";

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  LayoutDashboard,
  Menu,
  X,
  Users,
  Building2,
  Search,
  GraduationCap,
  Plus,
  Trash2,
  Eye,
  CircleCheck,
  Edit,
  Save,
  Mail,
  Phone,
  Globe,
  XCircle,
  MapPin,
  ClipboardList,
  Fingerprint,
  Calendar,
  CreditCard,
  Building,
  Link,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  User,
  Map,
  FileText
} from 'lucide-react';
import { createPortal } from 'react-dom';

// A mock data object for the employer's company profile with more comprehensive details
const initialCompanyProfile = {
  // --- Basic Information ---
  basic: {
    name: "Tech Innovators Inc.",
    industry: "IT and Software",
    description: "We are a leading technology company dedicated to creating innovative solutions that solve complex problems. Our team is passionate about mentorship and empowering the next generation of tech talent.",
    foundedDate: "2010-05-15",
    companySize: "500-1000 employees",
    logoUrl: "https://placehold.co/128x128/E0E7FF/4F46E5?text=TI",
  },
  // --- Contact Information ---
  contact: {
    email: "careers@techinnovators.com",
    phone: "+254 712 345 678",
    website: "https://www.techinnovators.com",
  },
  // --- Physical Address ---
  address: {
    street: "123 Innovation Drive",
    city: "Nairobi",
    county: "Nairobi County",
    country: "Kenya",
    postalCode: "00100",
  },
  // --- Business & Legal Details ---
  legal: {
    businessRegistrationNumber: "BRN/2010/05/154321",
    kraPin: "A123456789Z",
    businessPermitNumber: "BPN/2023/KRA/5678",
    licenseExpiryDate: "2024-12-31",
    vatNumber: "VAT/2010/9876",
    legalName: "Tech Innovators (Kenya) Limited",
  },
  // --- Social Media & Presence ---
  socials: {
    linkedin: "https://www.linkedin.com/company/tech-innovators-inc",
    twitter: "https://twitter.com/techinnovators",
    facebook: "", // Setting a social link to an empty string to demonstrate optionality
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

// Helper function to handle nested state changes
const handleProfileChange = (e, profile, setProfile) => {
  const { name, value } = e.target;
  const keys = name.split('.');

  setProfile(prevProfile => {
    // Create a deep copy to avoid direct state mutation
    const newProfile = JSON.parse(JSON.stringify(prevProfile));
    
    // Navigate to the correct nested object
    let current = newProfile;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    // Update the value
    current[keys[keys.length - 1]] = value;
    
    return newProfile;
  });
};

const CompanyProfile = () => {
  const [profile, setProfile] = useState(initialCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  
  // Effect to check if the current industry is "Other" on load or when entering edit mode
  useEffect(() => {
    if (isEditing && !INDUSTRY_OPTIONS.includes(profile.basic.industry)) {
      setShowOtherIndustry(true);
    } else {
      setShowOtherIndustry(false);
    }
  }, [isEditing, profile.basic.industry]);

  // Handle changes for the industry select dropdown
  const handleIndustryChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setShowOtherIndustry(true);
      setProfile(prevProfile => ({
        ...prevProfile,
        basic: {
          ...prevProfile.basic,
          industry: '' // Clear the value to allow new input
        }
      }));
    } else {
      setShowOtherIndustry(false);
      handleProfileChange(e, profile, setProfile);
    }
  };

  // A component to render a single field, based on whether we are in editing mode
  const Field = ({ label, value, name, type = 'text', icon: Icon }) => (
    <div className="mb-4">
      <div className="flex items-center text-gray-700 font-semibold mb-2">
        {Icon && <Icon size={18} className="mr-2 text-blue-600" />}
        <span>{label}</span>
      </div>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => handleProfileChange(e, profile, setProfile)}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
        />
      ) : (
        <p className="text-gray-600 text-sm break-words">{value || 'N/A'}</p>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-8 rounded-3xl shadow-xl bg-white border border-gray-100 max-w-5xl mx-auto my-10">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900">Company Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 font-bold py-2 px-6 rounded-full shadow-md transform transition-all duration-300 text-sm
            ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {isEditing ? <><Save size={18} /> Save</> : <><Edit size={18} /> Edit Profile</>}
        </button>
      </div>

      {/* Main Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 mb-8 pb-8 border-b border-gray-200">
        <img
          src={profile.basic.logoUrl}
          alt={`${profile.basic.name} logo`}
          className="w-28 h-28 rounded-full border-4 border-white shadow-lg mx-auto md:mx-0"
        />
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <input
              type="text"
              name="basic.name"
              value={profile.basic.name}
              onChange={(e) => handleProfileChange(e, profile, setProfile)}
              className="w-full text-3xl font-bold p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
            />
          ) : (
            <h2 className="text-3xl font-extrabold text-gray-900">{profile.basic.name}</h2>
          )}
          <p className="text-sm text-gray-600 mt-2 flex items-center justify-center md:justify-start gap-2">
            <Briefcase size={16} className="text-gray-500" /> {profile.basic.industry} • <Users size={16} className="text-gray-500" /> {profile.basic.companySize}
          </p>
          <div className="mt-4">
            {isEditing ? (
              <textarea
                name="basic.description"
                value={profile.basic.description}
                onChange={(e) => handleProfileChange(e, profile, setProfile)}
                className="w-full text-gray-500 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                rows="4"
              />
            ) : (
              <p className="text-gray-500 leading-relaxed text-sm max-w-xl mx-auto md:mx-0">{profile.basic.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
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
                  {showOtherIndustry && (
                    <input
                      type="text"
                      name="basic.industry"
                      placeholder="Specify your industry"
                      value={profile.basic.industry}
                      onChange={(e) => handleProfileChange(e, profile, setProfile)}
                      className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                  )}
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
            <Field label="Street" value={profile.address.street} name="address.street" icon={Map} />
            <Field label="City" value={profile.address.city} name="address.city" icon={Building} />
            <Field label="County" value={profile.address.county} name="address.county" icon={Map} />
            <Field label="Country" value={profile.address.country} name="address.country" icon={Globe} />
            <Field label="Postal Code" value={profile.address.postalCode} name="address.postalCode" icon={Mail} />
          </div>
        </div>
        
        {/* --- Business & Legal Details Section --- */}
        <div className="md:col-span-2">
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
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
            {isEditing && (
              <>
                <Field label="LinkedIn" value={profile.socials.linkedin} name="socials.linkedin" type="url" icon={Linkedin} />
                <Field label="Twitter" value={profile.socials.twitter} name="socials.twitter" type="url" icon={Twitter} />
                <Field label="Facebook" value={profile.socials.facebook} name="socials.facebook" type="url" icon={Facebook} />
                <Field label="Instagram" value={profile.socials.instagram} name="socials.instagram" type="url" icon={Instagram} />
              </>
            )}
            {!isEditing && (
              <div className="space-y-4">
                {profile.socials.linkedin && (
                  <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Linkedin size={18} /> LinkedIn
                  </a>
                )}
                {profile.socials.twitter && (
                  <a href={profile.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Twitter size={18} /> Twitter
                  </a>
                )}
                {profile.socials.facebook && (
                  <a href={profile.socials.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Facebook size={18} /> Facebook
                  </a>
                )}
                {profile.socials.instagram && (
                  <a href={profile.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                    <Instagram size={18} /> Instagram
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
