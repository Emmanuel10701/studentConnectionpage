'use client';
import React, { useState } from 'react';
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
  Calendar,
  Send,
  CheckCircle,
  Clock,
  BriefcaseBusiness,
} from 'lucide-react';
import Profile from "../components/studentprofile/page.jsx"; // Import the Profile component
import Jobistings from "../components/studentjobs/page.jsx"; // Import the Profile component
import EventsandNews from "../components/EventsandNews/page.jsx"

// Sidebar component, including navigation links
const Sidebar = ({ isSidebarOpen, toggleSidebar, setPage }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out bg-gray-900 text-white w-64 lg:w-80 p-5 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-indigo-400">JobApp</h1>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-grow">
        <ul>
          <li className="mb-4">
            <a
              href="#"
              onClick={() => setPage('home')}
              className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Home size={20} className="mr-3 text-indigo-300" />
              Dashboard
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#"
              onClick={() => setPage('jobs')}
              className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Briefcase size={20} className="mr-3 text-indigo-300" />
              Job Listings
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#"
              onClick={() => setPage('events')}
              className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Send size={20} className="mr-3 text-indigo-300" />
Events
            </a>
          </li>
          <li className="mb-4">
            <a
              href="#"
              onClick={() => setPage('profile')}
              className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <User size={20} className="mr-3 text-indigo-300" />
              My Profile
            </a>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">© 2024 Jobs For You</span>
        </div>
      </div>
    </div>
  );
};

// Header component for mobile view
const Header = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40 bg-white p-4 shadow-sm lg:hidden flex items-center justify-between">
      <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-gray-100" aria-label="Open sidebar">
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold text-gray-800">Jobs For You</h1>
    </header>
  );
};

// Component for empty content pages
const EmptyContent = ({ title }) => (
  <div className="p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">{title}</h2>
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center">
      <Building2 size={64} className="text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No content available.</h3>
      <p className="text-gray-500">This page is currently empty.</p>
    </div>
  </div>
);

// Main dashboard component that combines personal info and other sections
const HomeDashboard = () => (
  <div className="p-8 space-y-8">
    <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

    {/* Top Summary Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm font-light">Total Courses</p>
          <p className="text-3xl font-bold">12</p>
        </div>
        <BookOpen size={48} className="opacity-50" />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">GPA</p>
          <p className="text-3xl font-bold text-gray-800">3.8</p>
        </div>
        <GraduationCap size={48} className="text-indigo-400 opacity-70" />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Latest Achievement</p>
          <p className="text-3xl font-bold text-gray-800">Web Dev Certificate</p>
        </div>
        <Award size={48} className="text-yellow-500 opacity-70" />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Upcoming Deadline</p>
          <p className="text-3xl font-bold text-gray-800">10 Days</p>
        </div>
        <Calendar size={48} className="text-red-400 opacity-70" />
      </div>
    </div>

    {/* Main Content Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Personal Info & Skills */}
      <div className="lg:col-span-2 space-y-8">
        {/* Student Information Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <User size={24} className="mr-2 text-indigo-500" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <div>
              <p className="font-medium text-gray-700">Full Name:</p>
              <p className="ml-2">John Doe</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Student ID:</p>
              <p className="ml-2">123456789</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Email:</p>
              <p className="ml-2">john.doe@university.edu</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Phone:</p>
              <p className="ml-2">(123) 456-7890</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Address:</p>
              <p className="ml-2">123 University Ave, Anytown</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Major:</p>
              <p className="ml-2">Computer Science</p>
            </div>
          </div>
        </div>

        {/* Education & Experience Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <GraduationCap size={24} className="mr-2 text-indigo-500" />
            Education & Experience
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <ChevronRight size={18} className="text-gray-400 mt-1" />
              <div className="ml-2">
                <p className="font-semibold text-gray-700">Bachelor of Science in Computer Science</p>
                <p className="text-sm text-gray-500">University of Technology, 2020 - 2024</p>
                <p className="text-sm text-gray-500">GPA: 3.8 / 4.0</p>
              </div>
            </li>
            <li className="flex items-start">
              <ChevronRight size={18} className="text-gray-400 mt-1" />
              <div className="ml-2">
                <p className="font-semibold text-gray-700">Software Engineering Intern</p>
                <p className="text-sm text-gray-500">Tech Innovators Inc., Summer 2023</p>
                <p className="text-sm text-gray-500">Developed a front-end module for a new product dashboard.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Skills Section */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
            <Award size={24} className="mr-2 text-indigo-500" />
            Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium text-gray-700 mb-1">Web Development (90%)</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Data Analysis (75%)</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Project Management (85%)</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">UI/UX Design (60%)</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Activity & Quick Links */}
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Layers size={20} className="mr-2 text-indigo-500" />
            Recent Activity
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
              <span className="ml-2">Submitted resume for a new job.</span>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
              <span className="ml-2">Enrolled in "Advanced React" course.</span>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
              <span className="ml-2">Completed "Python for Data Science" module.</span>
            </li>
            <li className="flex items-center">
              <ChevronRight size={16} className="text-gray-400" />
              <span className="ml-2">Updated personal contact information.</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Sparkles size={20} className="mr-2 text-indigo-500" />
            Quick Links
          </h3>
          <ul className="space-y-3 text-indigo-600">
            <li>
              <a href="#" className="flex items-center hover:underline">
                View Transcript <ChevronRight size={16} className="ml-1" />
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:underline">
                Update Skills <ChevronRight size={16} className="ml-1" />
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:underline">
                Find Mentors <ChevronRight size={16} className="ml-1" />
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center hover:underline">
                Career Resources <ChevronRight size={16} className="ml-1" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Main App component that manages the state and page rendering
const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState('home');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomeDashboard />;
      case 'jobs':
        return <Jobistings title="Job Listings" />;
      case 'events':
        return <EventsandNews title="Events and News" />;
      case 'profile':
        return <Profile title="My Profile" />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setPage={setPage} />
      <div
        className={`flex-grow transition-all duration-300 ease-in-out lg:ml-80`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="min-h-screen">
          {renderPage()}
        </main>
      </div>
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
        ></div>
      )}
    </div>
  );
};

export default App;
