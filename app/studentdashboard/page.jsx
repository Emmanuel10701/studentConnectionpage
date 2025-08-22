'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import {
  Home,
  Briefcase,
  User,
  Menu,
  X,
  Building2,
  Layers,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Award,
  BookOpen,
  Send,
  CheckCircle,
  BriefcaseBusiness,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  ExternalLink,
  Users,
  MessageCircle
} from 'lucide-react';
import Profile from "../components/studentprofile/page.jsx";
import Jobistings from "../components/studentjobs/page.jsx";
import EventsandNews from "../components/EventsandNews/page.jsx";

// Sidebar component
const Sidebar = ({ isSidebarOpen, toggleSidebar, setPage, session, activePage }) => {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Job Listings', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'profile', label: 'My Profile', icon: User }
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-b from-gray-900 to-gray-800 text-white w-64 lg:w-72 p-5 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mr-3">
            <Briefcase size={20} />
          </div>
          <h1 className="text-xl font-bold text-white">CareerHub</h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-400 p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* User Profile Summary */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center mb-3">
          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="font-semibold text-white">{session?.user?.name || 'User'}</p>
            <p className="text-sm text-gray-400">{session?.user?.email}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-grow">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setPage(item.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    activePage === item.id
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">© 2024 CareerHub</span>
        </div>
      </div>
    </div>
  );
};

const Header = ({ toggleSidebar, studentProfile }) => {
  return (
    <header className="sticky top-0 z-40 bg-white p-4 shadow-sm lg:shadow-md lg:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-full hover:bg-gray-100 mr-3" aria-label="Open sidebar">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Student Dashboard</h1>
      </div>
      {studentProfile && (
        <div className="hidden md:flex items-center space-x-4">
          {studentProfile.resumePath && (
            <a
              href={studentProfile.resumePath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download size={16} className="mr-2" />
              Resume
            </a>
          )}
        </div>
      )}
    </header>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const InfoCard = ({ title, icon: Icon, children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}>
    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <Icon size={20} className="mr-2 text-indigo-500" />
      {title}
    </h3>
    {children}
  </div>
);

// Loading component with Material-UI spinner
const ProfileLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <CircularProgress size={60} thickness={4} className="text-indigo-600" />
    <div className="text-center">
      <p className="text-lg font-semibold text-gray-700">Loading your profile</p>
      <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your information</p>
    </div>
    <Box sx={{ width: '60%', maxWidth: 300 }}>
      <LinearProgress />
    </Box>
  </div>
);

const HomeDashboard = ({ studentProfile, basicProfile, setPage, loadingProfile }) => {
  const stats = [
    {
      title: 'Achievements',
      value: studentProfile?.achievements?.length || 0,
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      title: 'Education',
      value: studentProfile?.education?.length || 0,
      icon: GraduationCap,
      color: 'bg-blue-500'
    },
    {
      title: 'Experience',
      value: studentProfile?.experience?.length || 0,
      icon: BriefcaseBusiness,
      color: 'bg-yellow-500'
    },
    {
      title: 'Certifications',
      value: studentProfile?.certifications?.length || 0,
      icon: CheckCircle,
      color: 'bg-green-500'
    }
  ];

  if (loadingProfile) {
    return (
      <div className="p-6 lg:p-8">
        <ProfileLoading />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {basicProfile?.name || 'Student'}!
        </h1>
        <p className="text-indigo-100">
          {studentProfile?.summary || 'Complete your profile to unlock more opportunities'}
        </p>
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
          <InfoCard title="Personal Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{basicProfile?.name || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{basicProfile?.email || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Bio</p>
                <p className="font-medium">{studentProfile?.bio || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">
                  {studentProfile?.address ? (
                    `${studentProfile.address.details || ''}, ${studentProfile.address.ward || ''}, ${studentProfile.address.subCounty || ''}, ${studentProfile.address.county || ''}`
                  ) : (
                    'Not provided'
                  )}
                </p>
              </div>
            </div>
          </InfoCard>

          {/* Education & Experience */}
          <InfoCard title="Education & Experience" icon={GraduationCap}>
            <div className="space-y-4">
              {studentProfile?.education?.map((edu, index) => (
                <div key={index} className="border-l-4 border-indigo-400 pl-4 py-2">
                  <p className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-sm text-gray-600">{edu.school}</p>
                  <p className="text-sm text-gray-500">
                    {edu.graduationYear} {edu.isCurrent && '(Current)'}
                  </p>
                </div>
              ))}
              {studentProfile?.experience?.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4 py-2">
                  <p className="font-semibold">{exp.title}</p>
                  <p className="text-sm text-gray-600">{exp.company}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(exp.startDate).toLocaleDateString()} -{' '}
                    {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </InfoCard>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Achievements */}
          <InfoCard title="Achievements" icon={Award}>
            <ul className="space-y-2">
              {studentProfile?.achievements?.map((ach, index) => (
                <li key={index} className="flex items-center">
                  <ChevronRight size={16} className="text-indigo-400 mr-2" />
                  <span>{ach.name}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          {/* Certifications */}
          <InfoCard title="Certifications" icon={BookOpen}>
            <ul className="space-y-2">
              {studentProfile?.certifications?.map((cert, index) => (
                <li key={index} className="flex items-center">
                  <ChevronRight size={16} className="text-indigo-400 mr-2" />
                  <span>{cert.name}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          {/* Quick Actions */}
          <InfoCard title="Quick Actions" icon={Sparkles}>
            <div className="space-y-3">
              <button
                onClick={() => setPage('profile')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span>Update Profile</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPage('jobs')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span>Browse Jobs</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPage('events')}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span>View Events</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </InfoCard>

          {/* WhatsApp Connect */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center mb-3">
              <MessageCircle size={24} className="mr-2" />
              <h3 className="font-semibold">Student Network</h3>
            </div>
            <p className="text-green-100 mb-4 text-sm">
              Connect with fellow students and get real-time updates
            </p>
            <a
              href="https://chat.whatsapp.com/your-group-link"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center py-2 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Join WhatsApp Group
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState('home');
  const [studentProfile, setStudentProfile] = useState(null);
  const [basicProfile, setBasicProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/studentlogin');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      const fetchProfiles = async () => {
        setLoadingProfile(true);
        setError(null);
        try {
          // Fetch detailed student profile from the new API endpoint
          const profileRes = await fetch(`/api/studententireprofile/${session.user.id}`);
          
          if (!profileRes.ok) {
            if (profileRes.status === 404) {
              // Profile doesn't exist yet, that's okay
              setStudentProfile(null);
            } else {
              throw new Error(`Failed to fetch profile: ${profileRes.status}`);
            }
          } else {
            const profileData = await profileRes.json();
            setStudentProfile(profileData);
          }

          // Set basic profile from session
          setBasicProfile({
            name: session.user.name,
            email: session.user.email
          });

        } catch (error) {
          console.error("Error fetching profiles:", error);
          setError(error.message);
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchProfiles();
    }
  }, [status, router, session]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPage = () => {
    if (loadingProfile && page === 'home') {
      return <HomeDashboard studentProfile={studentProfile} basicProfile={basicProfile} setPage={setPage} loadingProfile={loadingProfile} />;
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
        return <HomeDashboard studentProfile={studentProfile} basicProfile={basicProfile} setPage={setPage} loadingProfile={loadingProfile} />;
      case 'jobs':
        return <Jobistings title="Job Listings" />;
      case 'events':
        return <EventsandNews title="Events and News" />;
      case 'profile':
        return <Profile studentProfile={studentProfile} basicProfile={basicProfile} title="My Profile" />;
      default:
        return <HomeDashboard studentProfile={studentProfile} basicProfile={basicProfile} setPage={setPage} loadingProfile={loadingProfile} />;
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <CircularProgress size={60} thickness={4} className="text-indigo-600" />
          <p className="mt-4 text-lg font-semibold text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return (
      <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
        <Sidebar 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          setPage={setPage} 
          session={session} 
          activePage={page}
        />
        <div className="flex-grow lg:ml-72">
          <Header toggleSidebar={toggleSidebar} studentProfile={studentProfile} />
          <main className="min-h-screen">
            {renderPage()}
          </main>
        </div>
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          ></div>
        )}
      </div>
    );
  }

  return null;
};

export default App;