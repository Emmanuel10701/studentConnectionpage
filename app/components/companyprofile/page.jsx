'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
  Briefcase, Users, Building2, Edit, Save, Mail, Phone, Globe,
  MapPin, ClipboardList, Fingerprint, Calendar, CreditCard,
  Building, Link, FileText, AlertCircle, CheckCircle, XCircle,
  Upload, Eye, Shield, TrendingUp, BarChart3, HeartHandshake, Zap, Target, Loader2, X, ChevronDown 
} from 'lucide-react';

const INDUSTRY_OPTIONS = [
  'IT and Software', 'Agriculture', 'Finance', 'Healthcare', 'Education',
  'Manufacturing', 'Retail', 'Hospitality', 'Construction',
  'Media & Entertainment', 'Other'
];

const CompanyProfile = () => {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // Initialize profile with all required fields
  const [profile, setProfile] = useState({
    name: '',
    industry: '',
    description: '',
    foundedDate: '',
    companySize: '',
    logoUrl: '',
    email: '',
    phone: '',
    website: '',
    street: '',
    city: '',
    county: '',
    country: '',
    postalCode: '',
    businessRegistrationNumber: '',
    kraPin: '',
    businessPermitNumber: '',
    licenseExpiryDate: '',
    vatNumber: '',
    legalName: '',
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [logoPreview, setLogoPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const formRef = useRef(null);

  // Fetch company profile data
  useEffect(() => {
    if (status === 'authenticated' && userId) {
      const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/company?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            if (data.company) {
              setProfile(data.company);
              setHasProfile(true);
            } else {
              setHasProfile(false);
              setShowModal(true);
            }
          } else if (response.status === 404) {
            setHasProfile(false);
            setShowModal(true);
          } else {
            throw new Error('Failed to fetch company profile.');
          }
        } catch (err) {
          setError(err.message || 'An unexpected error occurred.');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [status, userId]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        // In a real app, you would upload this to a server and get a URL
        setProfile(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const method = hasProfile ? 'PUT' : 'POST';
    const apiEndpoint = '/api/company';
    
    // Prepare the data for the backend
    const payload = { 
      ...profile,
      userId: userId
    };

    try {
      const response = await fetch(apiEndpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save profile.');
      }

      const data = await response.json();
      setProfile(data.company);
      setIsEditing(false);
      setHasProfile(true);
      setShowModal(false);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Field = ({ label, name, type = 'text', icon: Icon, isTextArea = false, placeholder = "", color = "text-blue-500" }) => (
    <div className="mb-5">
      <div className="flex items-center text-gray-700 font-medium mb-2">
        {Icon && <Icon size={18} className={`mr-2 ${color}`} />}
        <span className={`text-base font-semibold ${color.replace('500', '700')}`}>{label}</span>
      </div>
      {isEditing ? (
        isTextArea ? (
          <textarea
            name={name}
            value={profile[name] || ''}
            onChange={handleProfileChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base resize-y bg-gray-50"
            rows="3"
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={profile[name] || ''}
            onChange={handleProfileChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
            placeholder={placeholder}
          />
        )
      ) : (
        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile[name] ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
          {profile[name] || 'Not specified'}
        </p>
      )}
    </div>
  );

  if (loading || status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg text-gray-600 font-medium">Loading your company profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 font-sans w-full">
      {/* Modal for new users without a profile */}
      {showModal && !hasProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-800">Create Your Company Profile</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Briefcase className="text-blue-600 mt-0.5 flex-shrink-0" size={20} />
                  <p className="text-blue-800">
                    <span className="font-semibold">Welcome!</span> Create your company profile to get started. 
                    This will help candidates learn about your organization and culture.
                  </p>
                </div>
              </div>
              
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div className="flex flex-col items-center mb-4">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md border-2 border-white">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Company logo preview" 
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        ) : (
                          <Building2 size={32} className="text-blue-600" />
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer shadow-lg">
                        <Upload size={14} />
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleLogoChange}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-600">Upload your company logo</p>
                  </div>
                  
                  <div className="mb-5">
                    <div className="flex items-center text-gray-700 font-medium mb-2">
                      <Building2 size={18} className="mr-2 text-blue-500" />
                      <span className="text-base font-semibold text-blue-700">Company Name</span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={profile.name || ''}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-700 font-medium mb-2">
                      <Briefcase size={18} className="mr-2 text-blue-500" />
                      <span className="text-base font-semibold text-blue-700">Industry</span>
                    </div>
                    <select
                      name="industry"
                      value={profile.industry || ''}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                    >
                      <option value="">Select an Industry</option>
                      {INDUSTRY_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-5">
                    <div className="flex items-center text-gray-700 font-medium mb-2">
                      <Users size={18} className="mr-2 text-blue-500" />
                      <span className="text-base font-semibold text-blue-700">Company Size</span>
                    </div>
                    <input
                      type="text"
                      name="companySize"
                      value={profile.companySize || ''}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                      placeholder="e.g., 50-100 employees"
                    />
                  </div>
                  
                  <div className="mb-5">
                    <div className="flex items-center text-gray-700 font-medium mb-2">
                      <FileText size={18} className="mr-2 text-blue-500" />
                      <span className="text-base font-semibold text-blue-700">Description</span>
                    </div>
                    <textarea
                      name="description"
                      value={profile.description || ''}
                      onChange={handleProfileChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base resize-y bg-gray-50"
                      rows="3"
                      placeholder="Tell us about your company culture, mission, and values..."
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-base"
                  >
                    <XCircle size={18} /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md disabled:opacity-70 flex items-center gap-2 text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save size={18} />
                    )}
                    Create Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md border-2 border-white">
                  {logoPreview || profile.logoUrl ? (
                    <img 
                      src={logoPreview || profile.logoUrl} 
                      alt="Company logo" 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <Building2 size={32} className="text-blue-600" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer shadow-lg">
                    <Upload size={14} />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleLogoChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {profile.name || (isEditing ? 'New Company' : 'Company Profile')}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <Briefcase size={16} /> {profile.industry || 'Add your industry'}
                  <span className="mx-2">•</span>
                  <Users size={16} /> {profile.companySize || 'Add company size'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 text-base whitespace-nowrap shadow-lg
                ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'}`}
            >
              {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit size={18} /> Edit Profile</>}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center p-4 mb-6 text-base text-red-800 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle size={20} className="mr-3 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Only show the rest if the user has a profile */}
        {hasProfile ? (
          <>
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto scrollbar-hide mb-6 bg-white rounded-xl shadow-sm p-1 border border-gray-200">
              {['overview', 'details', 'legal', 'social', 'preview'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 rounded-lg text-base font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'overview' && <BarChart3 size={16} />}
                  {tab === 'details' && <FileText size={16} />}
                  {tab === 'legal' && <Shield size={16} />}
                  {tab === 'social' && <HeartHandshake size={16} />}
                  {tab === 'preview' && <Eye size={16} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <form ref={formRef} onSubmit={handleSubmit}>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Building2 size={22} className="text-blue-600" /> Basic Information
                    </h2>
                    
                    <div className="space-y-5">
                      <Field 
                        label="Company Name" 
                        name="name" 
                        icon={Building2} 
                        placeholder="Enter your company name"
                      />
                      
                      <div>
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Briefcase size={18} className="mr-2 text-blue-500" />
                          <span className="text-base font-semibold text-blue-700">Industry</span>
                        </div>
                        {isEditing ? (
                          <select
                            name="industry"
                            value={profile.industry || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          >
                            <option value="">Select an Industry</option>
                            {INDUSTRY_OPTIONS.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.industry ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.industry || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <Field 
                        label="Company Size" 
                        name="companySize" 
                        icon={Users} 
                        placeholder="e.g., 50-100 employees"
                      />
                      
                      <Field 
                        label="Description" 
                        name="description" 
                        icon={FileText} 
                        isTextArea={true}
                        placeholder="Tell us about your company culture, mission, and values..."
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Zap size={22} className="text-yellow-500" /> Quick Stats
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-blue-800 uppercase">Profile Completeness</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">72%</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <TrendingUp size={20} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-purple-800 uppercase">Last Updated</p>
                            <p className="text-base font-medium text-purple-600 mt-1">2 days ago</p>
                          </div>
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Calendar size={20} className="text-purple-600" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-green-800 uppercase">Visibility</p>
                            <p className="text-base font-medium text-green-600 mt-1">Public</p>
                          </div>
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Eye size={20} className="text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Mail size={22} className="text-purple-600" /> Contact Details
                    </h2>
                    
                    <div className="space-y-5">
                      <Field label="Email" name="email" type="email" icon={Mail} color="text-purple-500" placeholder="company@example.com" />
                      <Field label="Phone" name="phone" type="tel" icon={Phone} color="text-purple-500" placeholder="+1 (555) 123-4567" />
                      <Field label="Website" name="website" type="url" icon={Link} color="text-purple-500" placeholder="https://www.example.com" />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <MapPin size={22} className="text-orange-600" /> Location
                    </h2>
                    
                    <div className="space-y-5">
                      <Field label="Street" name="street" icon={MapPin} color="text-orange-500" placeholder="123 Main Street" />
                      <Field label="City" name="city" icon={Building} color="text-orange-500" placeholder="New York" />
                      <Field label="State/County" name="county" icon={MapPin} color="text-orange-500" placeholder="New York" />
                      <Field label="Country" name="country" icon={Globe} color="text-orange-500" placeholder="United States" />
                      <Field label="Postal Code" name="postalCode" icon={Mail} color="text-orange-500" placeholder="10001" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'legal' && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Shield size={22} className="text-teal-600" /> Business & Legal
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Business Reg. No." name="businessRegistrationNumber" icon={ClipboardList} color="text-teal-500" placeholder="123456789" />
                    <Field label="KRA PIN" name="kraPin" icon={Fingerprint} color="text-teal-500" placeholder="P123456789X" />
                    <Field label="Business Permit No." name="businessPermitNumber" icon={CreditCard} color="text-teal-500" placeholder="BP-12345" />
                    <Field label="License Expiry" name="licenseExpiryDate" type="date" icon={Calendar} color="text-teal-500" />
                    <Field label="VAT Number" name="vatNumber" icon={Briefcase} color="text-teal-500" placeholder="VAT123456789" />
                    <Field label="Legal Name" name="legalName" icon={Building} color="text-teal-500" placeholder="Legal Company Name, Inc." />
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb极6 flex items-center gap-2">
                    <HeartHandshake size={22} className="text-red-600" /> Social Presence
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="LinkedIn" name="linkedin" type="url" icon={Link} color="text-red-500" placeholder="https://linkedin.com/company/example" />
                    <Field label="Twitter" name="twitter" type="url" icon={Link} color="text-red-500" placeholder="https://twitter.com/example" />
                    <Field label="Facebook" name="facebook" type="url" icon={Link} color="text-red-500" placeholder="https://facebook.com/example" />
                    <Field label="Instagram" name="instagram" type="url" icon={Link} color="text-red-500" placeholder="https://instagram.com/example" />
                  </div>
                  
                  <div className="mt-8 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                    <div className="flex items-start gap-3">
                      <Target size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-base text-red-800">
                        <span className="font-semibold">Pro Tip:</span> Complete your social profiles to increase visibility and engagement with potential candidates.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Eye size={22} className="text-blue-600" /> Profile Preview
                  </h2>
                  
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-sm border border-white">
                        {logoPreview || profile.logoUrl ? (
                          <img 
                            src={logoPreview || profile.logoUrl} 
                            alt="Company logo" 
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ) : (
                          <Building2 size={24} className="text-blue-600" />
                        )}
                      </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{profile.name || 'Company Name'}</h3>
                          <p className="text-gray-600 text-base">{profile.industry || 'Industry'} • {profile.companySize || 'Company Size'}</p>
                        </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6 text-base leading-relaxed">
                      {profile.description || 'Company description will appear here.'}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-base">
                      <div>
                        <p className="text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{profile.email || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="text-gray-800 font-medium">{profile.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Website</p>
                        <p className="text-blue-600 font极ium">{profile.website || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Location</p>
                        <p className="text-gray-800 font-medium">
                          {[profile.city, profile.country].filter(Boolean).join(', ') || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 sticky bottom-4 z-10">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <p className="text-gray-600 text-base flex items-center gap-2">
                      <AlertCircle size={16} className="text-blue-500" />
                      {hasProfile ? 'Editing your company profile' : 'Creating your company profile'}
                    </p>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-base"
                        disabled={isSubmitting}
                      >
                        <XCircle size={18} /> Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-blue极600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md disabled:opacity-70 flex items-center gap-2 text-base"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save size={18} />
                        )}
                        {hasProfile ? 'Update Profile' : 'Create Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          // Empty state when no profile exists and modal is not shown
          !showModal && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md border-2 border-white mb-6">
                  <Building2 size={32} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">No Company Profile Yet</h2>
                <p className="text-gray-600 mb-6">
                  Get started by creating your company profile to showcase your organization to potential candidates.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 shadow-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 mx-auto"
                >
                  <Briefcase size={18} /> Create Company Profile
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;