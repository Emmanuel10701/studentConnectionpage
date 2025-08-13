"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Search, Upload, LayoutDashboard, ChevronRight, X, Briefcase, Bell, Menu, FileText, Settings, LogOut, GraduationCap, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

// --- MOCK DATA ---
const mockEmployers = [
  { id: 1, name: 'Tech Innovations Inc.', industry: 'Technology', location: 'Nairobi, Kenya' },
  { id: 2, name: 'Global Finance Group', industry: 'Finance', location: 'London, UK' },
  { id: 3, name: 'Creative Marketing Solutions', industry: 'Marketing', location: 'New York, USA' },
  { id: 4, name: 'Eco-Solutions Africa', industry: 'Environmental', location: 'Cape Town, South Africa' },
  { id: 5, name: 'Innovate Med', industry: 'Healthcare', location: 'Boston, USA' },
  { id: 6, name: 'FutureTech Solutions', industry: 'Technology', location: 'San Francisco, USA' },
  { id: 7, name: 'Green Energy Co.', industry: 'Environmental', location: 'Nairobi, Kenya' },
  { id: 8, name: 'Data Insights Ltd.', industry: 'Technology', location: 'London, UK' },
  { id: 9, name: 'Capital Investments', industry: 'Finance', location: 'New York, USA' },
];

const uniqueIndustries = [...new Set(mockEmployers.map(emp => emp.industry))];
const uniqueLocations = [...new Set(mockEmployers.map(emp => emp.location))];

// --- UTILITY COMPONENTS ---

const MessageBox = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-xl text-white shadow-lg flex items-center gap-3 ${bgColor}`}
    >
      {icon}
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto text-white opacity-70 hover:opacity-100">
        <X size={20} />
      </button>
    </motion.div>
  );
};

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  let initials = parts.map(part => part.charAt(0)).join('').toUpperCase();
  if (initials.length > 2) {
    initials = initials.substring(0, 2);
  }
  return initials;
};

/**
 * A reusable back button component.
 */
const BackButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6"
    >
      <ArrowLeft size={20} className="mr-2" />
      Back to Dashboard
    </button>
  );
};

// --- MAIN CONTENT VIEWS ---

const DashboardHome = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4">
          <Briefcase className="text-blue-500 bg-blue-50 p-3 rounded-full" size={50} />
          <div>
            <p className="text-sm text-gray-500">Employers Found</p>
            <h4 className="text-3xl font-bold text-gray-900">{mockEmployers.length}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4">
          <Upload className="text-green-500 bg-green-50 p-3 rounded-full" size={50} />
          <div>
            <p className="text-sm text-gray-500">Resume Status</p>
            <h4 className="text-3xl font-bold text-gray-900">Uploaded</h4>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Employers</h3>
          <button
            onClick={() => onNavigate('search')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center transition-colors"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockEmployers.slice(0, 3).map(employer => (
            <div key={employer.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-lg text-gray-900">{employer.name}</h4>
              <p className="text-sm text-gray-600 mt-1">Industry: {employer.industry}</p>
              <p className="text-sm text-gray-600">Location: {employer.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StudentProfile = ({ profile, setProfile, onGoBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: profile
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePic, setProfilePic] = useState(profile.profilePic || null);
  const [message, setMessage] = useState(null);

  const onSubmit = async (data) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile.');
      }

      const updatedProfileData = await response.json();
      setProfile(updatedProfileData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

    const router = useRouter();

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setMessage({ type: 'error', text: 'Please select a file to upload.' });
      return;
    }

    const formData = new FormData();
    formData.append('resume', resumeFile);
    
    try {
      const response = await fetch('/api/upload-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume.');
      }
      
      console.log("Resume uploaded:", resumeFile.name);
      setMessage({ type: 'success', text: `Resume '${resumeFile.name}' uploaded successfully!` });
      setResumeFile(null);
    } catch (error) {
      console.error("Error uploading resume:", error);
      setMessage({ type: 'error', text: 'Failed to upload resume. Please try again.' });
    }
  };
  
  const handleProfilePicUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setMessage({ type: 'success', text: `Profile picture updated!` });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCloseMessage = () => {
    setMessage(null);
  };

  return (
    <div>
      <BackButton onClick={onGoBack} />
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <h3 className="flex items-center text-xl md:text-2xl font-bold text-gray-900 mb-6">
          <User className="mr-3 text-blue-600" /> My Profile
        </h3>
        
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 mb-8">
          <div className="relative w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600 overflow-hidden shrink-0">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(profile.name)
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Change Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                {...register("name", { required: "Name is required" })} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="Your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                {...register("email", { required: "Email is required" })} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="your-email@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
              <input 
                type="text" 
                id="institution" 
                {...register("institution", { required: "Institution is required" })} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="Your university/college"
              />
              {errors.institution && <p className="mt-1 text-sm text-red-500">{errors.institution.message}</p>}
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">Course of Study</label>
              <input 
                type="text" 
                id="course" 
                {...register("course", { required: "Course is required" })} 
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="e.g., Computer Science"
              />
              {errors.course && <p className="mt-1 text-sm text-red-500">{errors.course.message}</p>}
            </div>

            <div>
              <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
              <select
                id="yearOfStudy"
                {...register("yearOfStudy", { required: "Year of study is required" })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="6">6th Year</option>
                <option value="alumni">Alumni</option>
              </select>
              {errors.yearOfStudy && <p className="mt-1 text-sm text-red-500">{errors.yearOfStudy.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              id="bio" 
              rows="4"
              {...register("bio")} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="Tell us about yourself and your aspirations..."
            />
          </div>
     <div className="flex flex-wrap gap-3">
      {/* Update Profile button */}
      <button
        type="submit"
        disabled={isUpdating}
        className="bg-blue-600 text-white font-medium py-2 px-5 rounded-full shadow hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isUpdating ? "Updating..." : "Update Profile"}
      </button>

      {/* Go Back button */}
      <button
        type="button"
        onClick={() => router.back()}
        className="bg-gray-500 text-white font-medium py-2 px-5 rounded-full shadow hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2"
      >
        Go Home
      </button>
      </div>
        </form>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
            <FileText className="mr-2 text-green-600" size={20} /> Upload Resume
          </h4>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input 
              type="file" 
              id="resume" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
            />
            <button
              onClick={handleResumeUpload}
              className="w-full md:w-auto bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!resumeFile}
            >
              Upload
            </button>
          </div>
        </div>
        <AnimatePresence>
          {message && <MessageBox message={message.text} type={message.type} onClose={handleCloseMessage} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const EmployerSearch = ({ onGoBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [employers, setEmployers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchEmployers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = new URL('/api/employers', window.location.origin);
        if (searchTerm) url.searchParams.append('name', searchTerm);
        if (selectedIndustry) url.searchParams.append('industry', selectedIndustry);
        if (selectedLocation) url.searchParams.append('location', selectedLocation);

        const response = new Promise((resolve) => {
          setTimeout(() => {
            const filtered = mockEmployers.filter(emp => {
              const matchesSearchTerm = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesIndustry = selectedIndustry === '' || emp.industry === selectedIndustry;
              const matchesLocation = selectedLocation === '' || emp.location === selectedLocation;
              return matchesSearchTerm && matchesIndustry && matchesLocation;
            });
            resolve({ ok: true, json: () => Promise.resolve(filtered) });
          }, 500);
        });

        const data = await (await response).json();
        setEmployers(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployers();
  }, [searchTerm, selectedIndustry, selectedLocation]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('');
    setSelectedLocation('');
  };

  return (
    <div>
      <BackButton onClick={onGoBack} />
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <h3 className="flex items-center text-xl md:text-2xl font-bold text-gray-900 mb-6">
          <Search className="mr-3 text-purple-600" /> Search for Employers
        </h3>
        
        <div className="mb-6 space-y-4">
          <div className="flex items-center border border-gray-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-purple-500 transition-shadow">
            <Search className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search by company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 text-gray-800 bg-transparent focus:outline-none"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="industry-filter" className="sr-only">Filter by Industry</label>
              <select
                id="industry-filter"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="">All Industries</option>
                {uniqueIndustries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="location-filter" className="sr-only">Filter by Location</label>
              <select
                id="location-filter"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleClearFilters}
              className="w-full md:w-auto px-6 py-3 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading && <p className="col-span-full text-center py-8">Loading employers...</p>}
          {error && <p className="text-red-500 col-span-full text-center py-8">Error: {error}</p>}
          {!isLoading && !error && (
            <AnimatePresence>
              {employers.length > 0 ? (
                employers.map(employer => (
                  <motion.div 
                    key={employer.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <h4 className="font-semibold text-lg text-gray-900">{employer.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">Industry: {employer.industry}</p>
                    <p className="text-sm text-gray-600">Location: {employer.location}</p>
                  </motion.div>
                ))
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 col-span-full text-center py-8"
                >
                  No employers found matching your criteria.
                </motion.p>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  
  const [studentProfile, setStudentProfile] = useState({
    name: 'Emmanuel Manaku',
    email: 'emmanuel.manaku@example.com',
    institution: 'Kirinyaga University',
    course: 'Computer Science',
    yearOfStudy: '3',
    bio: 'A passionate student looking for opportunities in the technology sector.',
    profilePic: null,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHome onNavigate={setActiveView} />;
      case 'profile':
        return <StudentProfile profile={studentProfile} setProfile={setStudentProfile} onGoBack={() => setActiveView('dashboard')} />;
      case 'search':
        return <EmployerSearch onGoBack={() => setActiveView('dashboard')} />;
      default:
        return <DashboardHome onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-inter text-gray-800 flex">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
      
      <motion.nav
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarOpen ? '0%' : '-100%' }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 md:static md:translate-x-0 transition-transform duration-300`}
      >
        <div className="p-8">
          <div className="flex items-center gap-2 mb-8">
            <GraduationCap size={28} className="text-blue-600" />
            <h1 className="text-2xl font-extrabold text-gray-900">Student Portal</h1>
          </div>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => { setActiveView('dashboard'); setIsSidebarOpen(false); }}
                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-colors duration-200 ${
                  activeView === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => { setActiveView('profile'); setIsSidebarOpen(false); }}
                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-colors duration-200 ${
                  activeView === 'profile'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <User size={20} />
                <span>My Profile</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => { setActiveView('search'); setIsSidebarOpen(false); }}
                className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-colors duration-200 ${
                  activeView === 'search'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Search size={20} />
                <span>Employer Search</span>
              </button>
            </li>
          </ul>
        </div>
      </motion.nav>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 md:p-6 flex items-center justify-between z-30">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-200 md:hidden">
            <Menu size={24} />
          </button>
          <div className="hidden md:flex flex-1 items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              {activeView}
            </h2>
          </div>
          <div className="relative flex items-center space-x-4" ref={profileMenuRef}>
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell size={24} className="text-gray-600" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-md hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none"
            >
              {getInitials(studentProfile.name)}
            </button>
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-2"
                >
                  <button 
                    onClick={() => { setActiveView('profile'); setIsProfileMenuOpen(false); }}
                    className="w-full text-left p-3 rounded-lg flex items-center gap-3 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Settings size={20} />
                    <span>Edit Profile</span>
                  </button>
                  <div className="border-t border-gray-200 my-2" />
                  <button 
                    onClick={() => { /* Handle logout logic */ }}
                    className="w-full text-left p-3 rounded-lg flex items-center gap-3 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderView()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}