'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Home,
  Briefcase,
  User,
  Menu,
  X,
  GraduationCap,
  Award,
  CheckCircle,
  BriefcaseBusiness,
  Download,
  MessageCircle,
  Rocket,
  Zap,
  HeartHandshake,
  Star,
  Calendar,
  Bell,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import Profile from "../components/studentprofile/page.jsx";
import Jobistings from "../components/studentjobs/page.jsx";
import EventsandNews from "../components/EventsandNews/page.jsx";
import toast from 'react-hot-toast';

// Modern Loading Components
const CircularLoader = () => (
  <div className="relative w-14 h-14">
    <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
  </div>
);

// Glassmorphism Card Component
const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl shadow-gray-200 ${className}`}>
    {children}
  </div>
);

// Profile Creation Modal Component
const CreateProfileModal = ({ isOpen, onClose, onCreateProfile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-8 mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <PlusCircle size={32} className="text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Your Profile</h2>
          <p className="text-gray-600 mb-6">
            You need to create a profile to access all features of CareerHub. Let's get started!
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCreateProfile}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
            >
              Create Profile
              <ArrowRight size={18} className="ml-2" />
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
            >
              Later
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

// Modern Sidebar Component
const Sidebar = ({ isSidebarOpen, toggleSidebar, setPage, session, activePage, hasProfile }) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, color: 'text-indigo-500' },
    { id: 'jobs', label: 'Job Listings', icon: Briefcase, color: 'text-blue-500' },
    { id: 'events', label: 'Events', icon: HeartHandshake, color: 'text-green-500' },
    { id: 'profile', label: 'My Profile', icon: User, color: 'text-purple-500' }
  ];

  const handleMenuItemClick = (id) => {
    setPage(id);
    toggleSidebar(); // Close sidebar on click
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-all duration-300 ease-in-out 
        w-80 p-6 flex flex-col
        bg-gray-900 
        border-r border-gray-700/50
        shadow-2xl
      `}>
        {/* Sidebar Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <Rocket size={22} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              CareerHub
            </h1>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-700/50 transition-all"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* User Profile */}
        <div className="p-5 mb-8 bg-gray-800 rounded-2xl shadow-xl shadow-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {session?.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{session?.user?.name || 'User'}</p>
              <p className="text-sm text-gray-400 truncate">{session?.user?.email}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                disabled={!hasProfile && item.id !== 'profile'}
                className={`
                  w-full flex items-center p-4 rounded-xl transition-all duration-200
                  ${activePage === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                  ${!hasProfile && item.id !== 'profile' ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <Icon size={22} className={`${activePage === item.id ? 'text-white' : item.color} mr-4`} />
                <span className="font-medium">{item.label}</span>
                {activePage === item.id && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <span className="text-xs text-gray-500">CareerHub v2.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

// Modern Header Component
const Header = ({ toggleSidebar, studentProfile }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 p-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl hover:bg-gray-100 transition-all lg:hidden"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        <h1 className="text-xl font-bold text-gray-800">Student Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Resume Download - Only show if profile exists */}
        {studentProfile?.resumePath && (
          <a
            href={studentProfile.resumePath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Download size={18} className="mr-2" />
            Resume
          </a>
        )}

        {/* User Quick Menu */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center text-white font-semibold shadow-lg">
            {studentProfile?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

// Modern Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-200 hover:scale-[1.02] transition-transform duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 font-medium mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${color} shadow-lg`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

// Modern Info Card Component
const InfoCard = ({ title, icon: Icon, children, className = '', action }) => (
  <div className={`p-6 bg-white rounded-2xl shadow-xl shadow-gray-200 ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Icon size={20} className="mr-3 text-indigo-500" />
        {title}
      </h3>
      {action && (
        <button className="text-indigo-500 hover:text-indigo-600 transition-colors">
          <ArrowRight size={18} />
        </button>
      )}
    </div>
    {children}
  </div>
);

// Modern Loading Component
const ProfileLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
    <CircularLoader />
    <div className="text-center space-y-2">
      <p className="text-lg font-semibold text-gray-700">Loading your career dashboard</p>
      <p className="text-sm text-gray-500">Preparing your personalized experience</p>
    </div>
    <div className="w-60 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
    </div>
  </div>
);

// Empty State Component for users without profile
const EmptyDashboard = ({ onCreateProfile }) => (
  <div className="p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
    <div className="w-full max-w-2xl p-8 text-center bg-white rounded-2xl shadow-xl shadow-gray-200">
      <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Rocket size={32} className="text-white" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to CareerHub!</h2>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        Get started by creating your professional profile. Showcase your skills, education, and experience to potential employers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-50 rounded-xl">
          <Briefcase className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800">Job Opportunities</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-xl">
          <GraduationCap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800">Showcase Education</p>
        </div>
        <div className="p-4 bg-indigo-50 rounded-xl">
          <Award className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800">Highlight Achievements</p>
        </div>
      </div>

      <button
        onClick={onCreateProfile}
        className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center mx-auto"
      >
        Create Your Profile
        <ArrowRight size={20} className="ml-2" />
      </button>
    </div>
  </div>
);






// Modern Home Dashboard Component
const HomeDashboard = ({ studentProfile, basicProfile, setPage, loadingProfile, onCreateProfile, userId }) => {


  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);


// In your HomeDashboard component, update the useEffect for checking subscription:
useEffect(() => {
  const checkSubscriptionStatus = async () => {
    try {
      const email = basicProfile?.email;
      if (!email) return;
      
      // Encode the email for the URL
      const encodedEmail = encodeURIComponent(email);
      const response = await fetch(`/api/jobalerts?email=${encodedEmail}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsSubscribed(data.isSubscribed);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  if (basicProfile?.email) {
    checkSubscriptionStatus();
  }
}, [basicProfile?.email]);

// Update the subscription handlers:
const handleSubscribeToAlerts = async () => {
  try {
    setIsSubscribing(true);
    const email = basicProfile?.email;
    
    if (!email) {
      toast.error('Email address is required');
      return;
    }

    const response = await fetch('/api/jobalerts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const responseData = await response.json();

    if (response.ok) {
      setIsSubscribed(responseData.isSubscribed);
      toast.success(responseData.message || 'Subscribed to job alerts!');
    } else {
      toast.error(responseData.message || 'Failed to subscribe to alerts');
    }
  } catch (error) {
    console.error('Error subscribing to alerts:', error);
    toast.error('Error subscribing to alerts');
  } finally {
    setIsSubscribing(false);
  }
};

const handleUnsubscribeFromAlerts = async () => {
  try {
    const email = basicProfile?.email;
    
    if (!email) {
      toast.error('Email address is required');
      return;
    }

    const response = await fetch('/api/jobalerts', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const responseData = await response.json();

    if (response.ok) {
      setIsSubscribed(false);
      toast.success(responseData.message || 'Unsubscribed from job alerts');
    } else {
      toast.error(responseData.message || 'Failed to unsubscribe');
    }
  } catch (error) {
    console.error('Error unsubscribing from alerts:', error);
    toast.error('Error unsubscribing from alerts');
  }
};



  const stats = [
    {
      title: 'Achievements',
      value: studentProfile?.achievements?.length || 0,
      icon: Award,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      title: 'Education',
      value: studentProfile?.education?.length || 0,
      icon: GraduationCap,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      title: 'Experience',
      value: studentProfile?.experience?.length || 0,
      icon: BriefcaseBusiness,
      color: 'bg-gradient-to-r from-amber-500 to-orange-500'
    },
    {
      title: 'Certifications',
      value: studentProfile?.certifications?.length || 0,
      icon: CheckCircle,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    }
  ];

  if (loadingProfile) {
    return (
      <div className="p-6 lg:p-8">
        <ProfileLoading />
      </div>
    );
  }

  // Show empty state if no profile exists
  if (!studentProfile) {
    return <EmptyDashboard onCreateProfile={onCreateProfile} />;
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-xl shadow-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {basicProfile?.name || 'Future Leader'}! 👋
            </h1>
            <p className="text-indigo-100 opacity-90">
              {studentProfile?.summary || 'Your journey to career success starts here. Complete your profile to unlock opportunities.'}
            </p>
          </div>
          <div className="hidden lg:block">
            <Rocket size={48} className="text-white/20" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
<InfoCard title="Professional Details" icon={User} action>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-1">
      <p className="text-sm text-gray-500 font-medium">Full Name</p>
      <p className="font-semibold text-gray-800">{basicProfile?.name || 'Not provided'}</p>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-500 font-medium">Email</p>
      <p className="font-semibold text-gray-800">{basicProfile?.email || 'Not provided'}</p>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-500 font-medium">Education Level</p>
      <p className="font-semibold text-gray-800">{studentProfile?.educationLevel || 'Not specified'}</p>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-500 font-medium">Experience</p>
      <p className="font-semibold text-gray-800">{studentProfile?.experienceRange || 'Not specified'}</p>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-500 font-medium">Status</p>
      <p className="font-semibold text-gray-800">{studentProfile?.studentStatus || 'Not specified'}</p>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-500 font-medium">Job Preference</p>
      <p className="font-semibold text-gray-800">{studentProfile?.jobType || 'Not specified'}</p>
    </div>
    <div className="space-y-1">
      <p className="text-sm text-gray-500 font-medium">Location</p>
      <p className="font-semibold text-gray-800">
        {studentProfile?.address ? (
          `${studentProfile.address.details || ''}, ${studentProfile.address.ward || ''}`
        ) : (
          'Not provided'
        )}
      </p>
    </div>
  </div>
</InfoCard>

          {/* Education & Experience */}
          <InfoCard title="Education & Experience" icon={GraduationCap} action>
            <div className="space-y-4">
              {studentProfile?.education?.slice(0, 2).map((edu, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <GraduationCap size={24} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">
                      {edu.graduationYear} {edu.isCurrent && '(Current)'}
                    </p>
                  </div>
                </div>
              ))}
              {studentProfile?.experience?.slice(0, 2).map((exp, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                    <BriefcaseBusiness size={24} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{exp.title}</p>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">
                      {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'N/A'} -{' '}
                      {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </InfoCard>
        </div>






        
          {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <InfoCard title="Quick Actions" icon={Zap}>
            <div className="space-y-3">
              <button
                onClick={() => setPage('profile')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all group shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center mr-3">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-800">Update Profile</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-indigo-500" />
              </button>
              <button
                onClick={() => setPage('jobs')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all group shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
                    <Briefcase size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-800">Browse Jobs</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-500" />
              </button>
              <button
                onClick={() => setPage('events')}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all group shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-3">
                    <Calendar size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-800">View Events</span>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-green-500" />
              </button>
            </div>
          </InfoCard>
{/* Job Alerts Subscription */}

{/* Job Alerts Commitment Card */}
<InfoCard title="Our Commitment" icon={Bell}>
  <div className="space-y-4">
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Rocket size={24} className="text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Dedicated to Your Career Success</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            We are committed to bringing you the latest job notifications and opportunities. 
            Our mission is to ensure you never miss out on perfect career matches that align 
            with your skills and aspirations.
          </p>
        </div>
      </div>
    </div>

    {/* Features List */}
    <div className="grid grid-cols-1 gap-2">
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
        <span className="text-sm text-gray-700">Instant job opportunity notifications</span>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
        <span className="text-sm text-gray-700">Personalized career matches</span>
      </div>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
        <span className="text-sm text-gray-700">Early access to new positions</span>
      </div>
    </div>
  </div>
</InfoCard>



        
{/* Community & Activity Cards - Beneath Education & Experience */}
<div className="flex flex-col lg:flex-row gap-6 flex-wrap">
  {/* Community Connect */}
  <div className="flex-1 min-w-[300px]">
    <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl shadow-xl shadow-green-200 h-full">
      <div className="flex items-center mb-4">
        <HeartHandshake size={24} className="mr-3" />
        <h3 className="font-semibold">Student Community</h3>
      </div>
      <p className="text-green-100 mb-4 text-sm">
        Join 2,500+ students networking and sharing opportunities
      </p>
      <a
        href="https://chat.whatsapp.com/your-group-link"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-lg"
      >
        <MessageCircle size={18} className="mr-2" />
        Join Community
      </a>
    </div>
  </div>

</div>
</div>

      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed on small screens
  const [page, setPage] = useState('home');
  const [studentProfile, setStudentProfile] = useState(null);
  const [basicProfile, setBasicProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);

  // Effect to handle initial sidebar state on different screen sizes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // 'lg' breakpoint
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/studentlogin');
      return;
    }

    if (status === 'authenticated' && session?.user?.id && session?.user?.role === 'STUDENT') {
      const fetchProfiles = async () => {
        setLoadingProfile(true);
        setError(null);
        try {
          const profileRes = await fetch(`/api/studententireprofile/${session.user.id}`);

          if (!profileRes.ok) {
            if (profileRes.status === 404) {
              setStudentProfile(null);
              setShowCreateProfileModal(true);
            } else {
              throw new Error(`Failed to fetch profile: ${profileRes.status}`);
            }
          } else {
            const profileData = await profileRes.json();
            setStudentProfile(profileData);
            setShowCreateProfileModal(false);
          }

          setBasicProfile({
            name: session.user.name,
            email: session.user.email,
          });

        } catch (error) {
          console.error("Error fetching profiles:", error);
          setError(error.message);
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchProfiles();
    } else if (status === 'authenticated' && session?.user?.role !== 'STUDENT') {
      router.push('/studentlogin');
    }
  }, [status, router, session]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCreateProfile = () => {
    setShowCreateProfileModal(false);
    setPage('profile');
  };

  const renderPage = () => {
    if (loadingProfile && page === 'home') {
      return <HomeDashboard studentProfile={studentProfile} basicProfile={basicProfile} setPage={setPage} loadingProfile={loadingProfile} onCreateProfile={handleCreateProfile} />;
    }

    if (error) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600">Error loading profile</p>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </div>
      );
    }

    switch (page) {
      case 'home':
        return <HomeDashboard studentProfile={studentProfile} basicProfile={basicProfile} setPage={setPage} loadingProfile={loadingProfile} onCreateProfile={handleCreateProfile} />;
      case 'jobs':
        return <Jobistings title="Job Listings" />;
      case 'events':
        return <EventsandNews title="Events and News" />;
      case 'profile':
        return <Profile studentProfile={studentProfile} basicProfile={basicProfile} title="My Profile" />;
      default:
        return <HomeDashboard studentProfile={studentProfile} basicProfile={basicProfile} setPage={setPage} loadingProfile={loadingProfile} onCreateProfile={handleCreateProfile} />;
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="text-center space-y-6">
          <CircularLoader />
          <div>
            <p className="text-xl font-semibold text-gray-700">Launching CareerHub</p>
            <p className="text-gray-500 mt-2">Preparing your professional dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex min-h-screen bg-white font-sans text-gray-800">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          setPage={setPage}
          session={session}
          activePage={page}
          hasProfile={!!studentProfile}
        />
        <div className="flex-grow lg:ml-80">
          <Header toggleSidebar={toggleSidebar} studentProfile={studentProfile} />
          <main className="min-h-screen px-3 md:px-[3%] lg:px-[7%]">
            {renderPage()}
          </main>
        </div>

        {/* Create Profile Modal */}
        <CreateProfileModal
          isOpen={showCreateProfileModal}
          onClose={() => setShowCreateProfileModal(false)}
          onCreateProfile={handleCreateProfile}
        />
      </div>
    );
  }

  return null;
};

export default App;