'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Briefcase, Users, Building2, Edit, Save, Mail, Phone, Globe,
  MapPin, ClipboardList, Fingerprint, Calendar, CreditCard,
  Building, Link, FileText, AlertCircle, CheckCircle, XCircle,
  Upload, Eye, Shield, TrendingUp, BarChart3, HeartHandshake, Zap, Target, Loader2, X, Clock
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
    instagram: '',
    lastUpdated: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [logoPreview, setLogoPreview] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [lastUpdatedText, setLastUpdatedText] = useState('');

  // Calculate profile completion
  const calculateCompletion = (profile) => {
    const requiredFields = [
      'name', 'industry', 'description', 'companySize', 
      'email', 'phone', 'website', 'city', 'country'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = profile[field];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  // Format date relative to now
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Never updated';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  };

  // Fetch company profile from API
  useEffect(() => {
    if (status !== 'authenticated' || !userId) {
      setLoading(false);
      return;
    }

    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get employee ID
        const employerRes = await fetch(`/api/employerId/user/${userId}`);
        if (!employerRes.ok) {
          throw new Error('Failed to fetch employer data');
        }
        
        const employerData = await employerRes.json();
        if (!employerData.success) {
          setHasProfile(false);
          setShowModal(true);
          setLoading(false);
          return;
        }
        
        const employeeId = employerData.employee.id;
        
        // Fetch company using employee ID
        const companyRes = await fetch(`/api/company/employee/${employeeId}`);
        
        if (companyRes.status === 404) {
          setHasProfile(false);
          setShowModal(true);
          setLoading(false);
          return;
        }
        
        if (!companyRes.ok) {
          throw new Error('Failed to fetch company data');
        }
        
        const companyJson = await companyRes.json();
        if (companyJson.success) {
          setProfile(companyJson.company);
          setHasProfile(true);
        } else {
          setHasProfile(false);
          setShowModal(true);
        }
      } catch (err) {
        console.error('Error fetching company profile:', err);
        setError(err.message);
        setHasProfile(false);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated' && userId) {
      fetchCompanyProfile();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, userId]);

  // Update completion percentage and last updated text when profile changes
  useEffect(() => {
    setCompletionPercentage(calculateCompletion(profile));
    setLastUpdatedText(formatRelativeTime(profile.lastUpdated));
  }, [profile]);

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
        setProfile(prev => ({ ...prev, logoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    let response;
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString()
    };
    
    // Remove userId from the data being sent
    const { userId: _, ...profileWithoutUserId } = updatedProfile;
    
    if (hasProfile && profile.id) {
      // PUT request - include company ID in the URL
      const apiEndpoint = `/api/company/${profile.id}`;
      
      response = await fetch(apiEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileWithoutUserId), // Send data without userId
      });
    } else {
      // POST request - create new company
      const apiEndpoint = '/api/company';
      response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileWithoutUserId,
          userId: userId // Only include userId for POST, not PUT
        }),
      });
    }

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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-800">Create Your Company Profile</h2>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="bg-blue-50 p-5 rounded-xl mb-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Briefcase className="text-blue-600 mt-0.5 flex-shrink-0" size={22} />
                  <p className="text-blue-800 text-lg">
                    <span className="font-semibold">Welcome!</span> Create your company profile to get started. 
                    This will help candidates learn about your organization and culture.
                  </p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-md border-2 border-white">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Company logo preview" 
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                        ) : (
                          <Building2 size={40} className="text-blue-600" />
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg">
                        <Upload size={16} />
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
                  
                  <div className="mb-6">
                    <div className="flex items-center text-gray-700 font-medium mb-3">
                      <Building2 size={20} className="mr-2 text-blue-500" />
                      <span className="text-lg font-semibold text-blue-700">Company Name</span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={profile.name || ''}
                      onChange={handleProfileChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center text-gray-700 font-medium mb-3">
                      <Briefcase size={20} className="mr-2 text-blue-500" />
                      <span className="text-lg font-semibold text-blue-700">Industry</span>
                    </div>
                    <select
                      name="industry"
                      value={profile.industry || ''}
                      onChange={handleProfileChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                      required
                    >
                      <option value="">Select an Industry</option>
                      {INDUSTRY_OPTIONS.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center text-gray-700 font-medium mb-3">
                      <Users size={20} className="mr-2 text-blue-500" />
                      <span className="text-lg font-semibold text-blue-700">Company Size</span>
                    </div>
                    <input
                      type="text"
                      name="companySize"
                      value={profile.companySize || ''}
                      onChange={handleProfileChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                      placeholder="e.g., 50-100 employees"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center text-gray-700 font-medium mb-3">
                      <FileText size={20} className="mr-2 text-blue-500" />
                      <span className="text-lg font-semibold text-blue-700">Description</span>
                    </div>
                    <textarea
                      name="description"
                      value={profile.description || ''}
                      onChange={handleProfileChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base resize-y bg-gray-50"
                      rows="4"
                      placeholder="Tell us about your company culture, mission, and values..."
                      required
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-base"
                  >
                    <XCircle size={18} /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md disabled:opacity-70 flex items-center gap-2 text-base"
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

            <form onSubmit={handleSubmit}>
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <Building2 size={22} className="text-blue-600" /> Basic Information
                    </h2>
                    
                    <div className="space-y-5">
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Building2 size={18} className="mr-2 text-blue-500" />
                          <span className="text-base font-semibold text-blue-700">Company Name</span>
                          {profile.name && <CheckCircle size={16} className="ml-2 text-green-500" />}
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={profile.name || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="Enter your company name"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.name ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.name || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Briefcase size={18} className="mr-2 text-blue-500" />
                          <span className="text-base font-semibold text-blue-700">Industry</span>
                          {profile.industry && <CheckCircle size={16} className="ml-2 text-green-500" />}
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
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Users size={18} className="mr-2 text-blue-500" />
                          <span className="text-base font-semibold text-blue-700">Company Size</span>
                          {profile.companySize && <CheckCircle size={16} className="ml-2 text-green-500" />}
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="companySize"
                            value={profile.companySize || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="e.g., 50-100 employees"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.companySize ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.companySize || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <FileText size={18} className="mr-2 text-blue-500" />
                          <span className="text-base font-semibold text-blue-700">Description</span>
                          {profile.description && <CheckCircle size={16} className="ml-2 text-green-500" />}
                        </div>
                        {isEditing ? (
                          <textarea
                            name="description"
                            value={profile.description || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base resize-y bg-gray-50"
                            rows="3"
                            placeholder="Tell us about your company culture, mission, and values..."
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.description ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.description || 'Not specified'}
                          </p>
                        )}
                      </div>
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
                            <p className="text-2xl font-bold text-blue-600 mt-1">{completionPercentage}%</p>
                          </div>
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <TrendingUp size={20} className="text-blue-600" />
                          </div>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out" 
                            style={{width: `${completionPercentage}%`}}
                          ></div>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                          {completionPercentage === 100 
                            ? 'Profile complete! 🎉' 
                            : `Complete ${100 - completionPercentage}% more to finish`}
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-purple-800 uppercase">Last Updated</p>
                            <p className="text-base font-medium text-purple-600 mt-1 flex items-center gap-1">
                              <Clock size={14} /> {lastUpdatedText}
                            </p>
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
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Mail size={18} className="mr-2 text-purple-500" />
                          <span className="text-base font-semibold text-purple-700">Email</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={profile.email || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="company@example.com"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.email ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.email || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Phone size={18} className="mr-2 text-purple-500" />
                          <span className="text-base font-semibold text-purple-700">Phone</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={profile.phone || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="+1 (555) 123-4567"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.phone ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.phone || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Link size={18} className="mr-2 text-purple-500" />
                          <span className="text-base font-semibold text-purple-700">Website</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="url"
                            name="website"
                            value={profile.website || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="https://www.example.com"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.website ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.website || 'Not specified'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <MapPin size={22} className="text-orange-600" /> Location
                    </h2>
                    
                    <div className="space-y-5">
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <MapPin size={18} className="mr-2 text-orange-500" />
                          <span className="text-base font-semibold text-orange-700">Street</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="street"
                            value={profile.street || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="123 Main Street"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.street ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.street || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Building size={18} className="mr-2 text-orange-500" />
                          <span className="text-base font-semibold text-orange-700">City</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="city"
                            value={profile.city || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="New York"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.city ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.city || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <MapPin size={18} className="mr-2 text-orange-500" />
                          <span className="text-base font-semibold text-orange-700">State/County</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="county"
                            value={profile.county || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="New York"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.county ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.county || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Globe size={18} className="mr-2 text-orange-500" />
                          <span className="text-base font-semibold text-orange-700">Country</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="country"
                            value={profile.county || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="United States"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.country ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.country || 'Not specified'}
                          </p>
                        )}
                      </div>
                      
                      <div className="mb-5">
                        <div className="flex items-center text-gray-700 font-medium mb-2">
                          <Mail size={18} className="mr-2 text-orange-500" />
                          <span className="text-base font-semibold text-orange-700">Postal Code</span>
                        </div>
                        {isEditing ? (
                          <input
                            type="text"
                            name="postalCode"
                            value={profile.postalCode || ''}
                            onChange={handleProfileChange}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                            placeholder="10001"
                          />
                        ) : (
                          <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.postalCode ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                            {profile.postalCode || 'Not specified'}
                          </p>
                        )}
                      </div>
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
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <ClipboardList size={18} className="mr-2 text-teal-500" />
                        <span className="text-base font-semibold text-teal-700">Business Reg. No.</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="businessRegistrationNumber"
                          value={profile.businessRegistrationNumber || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="123456789"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.businessRegistrationNumber ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.businessRegistrationNumber || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <Fingerprint size={18} className="mr-2 text-teal-500" />
                        <span className="text-base font-semibold text-teal-700">KRA PIN</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="kraPin"
                          value={profile.kraPin || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="P123456789X"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.kraPin ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.kraPin || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <CreditCard size={18} className="mr-2 text-teal-500" />
                        <span className="text-base font-semibold text-teal-700">Business Permit No.</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="businessPermitNumber"
                          value={profile.businessPermitNumber || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="BP-12345"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.businessPermitNumber ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.businessPermitNumber || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <Calendar size={18} className="mr-2 text-teal-500" />
                        <span className="text-base font-semibold text-teal-700">License Expiry</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="date"
                          name="licenseExpiryDate"
                          value={profile.licenseExpiryDate || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.licenseExpiryDate ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.licenseExpiryDate || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <Briefcase size={18} className="mr-2 text-teal-500" />
                        <span className="text-base font-semibold text-teal-700">VAT Number</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="vatNumber"
                          value={profile.vatNumber || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="VAT123456789"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.vatNumber ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.vatNumber || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <Building size={18} className="mr-2 text-teal-500" />
                        <span className="text-base font-semibold text-teal-700">Legal Name</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="legalName"
                          value={profile.legalName || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="Legal Company Name, Inc."
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.legalName ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.legalName || 'Not specified'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <HeartHandshake size={22} className="text-red-600" /> Social Presence
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <Link size={18} className="mr-2 text-red-500" />
                        <span className="text-base font-semibold text-red-700">LinkedIn</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="url"
                          name="linkedin"
                          value={profile.linkedin || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="https://linkedin.com/company/example"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.linkedin ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.linkedin || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <Link size={18} className="mr-2 text-red-500" />
                        <span className="text-base font-semibold text-red-700">Twitter</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="url"
                          name="twitter"
                          value={profile.twitter || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="https://twitter.com/example"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.twitter ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.twitter || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <Link size={18} className="mr-2 text-red-500" />
                        <span className="text-base font-semibold text-red-700">Facebook</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="url"
                          name="facebook"
                          value={profile.facebook || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="https://facebook.com/example"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.facebook ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.facebook || 'Not specified'}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-5">
                      <div className="flex items-center text-gray-700 font-medium mb-2">
                        <Link size={18} className="mr-2 text-red-500" />
                        <span className="text-base font-semibold text-red-700">Instagram</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="url"
                          name="instagram"
                          value={profile.instagram || ''}
                          onChange={handleProfileChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-base bg-gray-50"
                          placeholder="https://instagram.com/example"
                        />
                      ) : (
                        <p className={`text-gray-700 text-base break-words p-2 rounded-lg ${!profile.instagram ? 'text-gray-400 italic' : 'bg-gray-50'}`}>
                          {profile.instagram || 'Not specified'}
                        </p>
                      )}
                    </div>
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
                        <p className="text-blue-600 font-medium">{profile.website || 'N/A'}</p>
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
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <BarChart3 size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Profile Completion: {completionPercentage}%</p>
                        <div className="w-32 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{width: `${completionPercentage}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
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
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md disabled:opacity-70 flex items-center gap-2 text-base"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Save size={18} />
                        )}
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Building2 size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Company Profile Found</h2>
              <p className="text-gray-600 mb-6">
                It looks like you haven't created a company profile yet. Get started by setting up your company information to attract the best talent.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md flex items-center gap-2 mx-auto text-base"
              >
                <Briefcase size={18} /> Create Company Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;