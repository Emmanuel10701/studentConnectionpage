'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  BarChart2,
  Folder,
  Settings,
  MapPin,
  Calendar,
  DollarSign,
  Laptop,
  ThumbsUp,
  Award,
  LogOut,
  User,
  ChevronRight,
  Filter,
  Bell,
  MessageSquare,
  ChevronDown,
  ExternalLink,
  Bookmark,
  Share,
  MoreHorizontal,
  Download,
  Send,
  Heart,
  BookOpen,
  TrendingUp,
  Target,
  Loader2
} from 'lucide-react';

// --- Imported Components ---
import JobPostings from '../components/jobslistings/page.jsx';
import CompanyProfile from "../components/companyprofile/page.jsx";
import TalentSearch from "../components/Talentserch/page.jsx";
import Employerevents from '../components/EmployerEvent/page.jsx';

// --- Main Employer Dashboard Component ---
const App = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [companyProfile, setCompanyProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  useEffect(() => {
    // Redirect if unauthenticated
    if (status === 'unauthenticated') {
      router.push('/Employerlogin');
      return;
    }

    // Redirect if authenticated but role is not EMPLOYER
    if (status === 'authenticated' && session?.user) {
      if (session.user.role !== 'EMPLOYER') {
        router.push('/Employerlogin');
        return;
      }

      // Fetch dashboard data
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch company profile
          const employerRes = await fetch(`/api/employerId/user/${session.user.id}`);
          if (!employerRes.ok) throw new Error('Failed to fetch employer data');
          
          const employerData = await employerRes.json();
          if (!employerData.success) throw new Error('No employer profile found');

          const employeeId = employerData.employee.id;
          
          // Fetch company data
          const companyRes = await fetch(`/api/company/employee/${employeeId}`);
          if (!companyRes.ok) throw new Error('Failed to fetch company data');
          
          const companyData = await companyRes.json();
          if (companyData.success) {
            setCompanyProfile(companyData.company);
          }

          // Fetch all data in parallel
          const [studentsRes, jobsRes, eventsRes, newsRes] = await Promise.all([
            fetch('/api/student'),
            fetch(`/api/companyjobs/${companyData.company.id}/jobs`),
            fetch('/api/events'),
            fetch('/api/new')
          ]);

          // Process students data
          if (studentsRes.ok) {
            const studentsData = await studentsRes.json();
            setStudents(Array.isArray(studentsData) ? studentsData : [studentsData]);
          }

          // Process jobs data
          if (jobsRes.ok) {
            const jobsData = await jobsRes.json();
            setJobs(Array.isArray(jobsData) ? jobsData : [jobsData]);
          }

          // Process events data
          if (eventsRes.ok) {
            const eventsData = await eventsRes.json();
            setEvents(Array.isArray(eventsData) ? eventsData : [eventsData]);
          }

          // Process news data
          if (newsRes.ok) {
            const newsData = await newsRes.json();
            setNews(Array.isArray(newsData) ? newsData : [newsData]);
          }

        } catch (err) {
          console.error("Failed to fetch dashboard data:", err);
          setError("Failed to load dashboard data.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [status, router, session]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompanyProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCompanyProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.university?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePostJob = async (newJob) => {
    try {
      if (!companyProfile?.id) {
        throw new Error('Company profile not found');
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newJob,
          companyId: companyProfile.id
        }),
      });

      if (response.ok) {
        const savedJob = await response.json();
        setJobs(prev => [...prev, savedJob]);
      } else {
        throw new Error('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      setError('Failed to create job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (response.ok) {
        setJobs(prev => prev.filter(job => job.id !== jobId));
      } else {
        throw new Error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      setError('Failed to delete job');
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJobApplicants({ job, applicants: job.applicants || [] });
  };

  // Get upcoming events (next 3)
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="ml-4 text-gray-500">Loading dashboard...</p>
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }

    switch (activeSection) {
      case 'Dashboard':
        const totalStudents = students.filter(s => s.role === 'STUDENT').length;
        const totalJobs = jobs.length;
        const totalEvents = events.length;
        
        return (
          <div className="w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back, {companyProfile?.name || 'Employer'}</p>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
                  />
                </div>
                <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50">
                  <Bell className="h-5 w-5" />
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {companyProfile?.name?.charAt(0) || 'E'}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{totalStudents}</h2>
                    <p className="text-sm text-gray-500">Students</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{jobs.length}</h2>
                    <p className="text-sm text-gray-500">Active Jobs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{totalEvents}</h2>
                    <p className="text-sm text-gray-500">Upcoming Events</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-orange-50">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{news.length}</h2>
                    <p className="text-sm text-gray-500">News Articles</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Latest Students Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Students</h2>
                  <button className="text-blue-600 text-sm font-medium flex items-center">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {students.slice(0, 3).map(student => (
                    <div key={student.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setSelectedStudent(student)}>
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Job Postings Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Active Jobs</h2>
                  <button className="text-blue-600 text-sm font-medium flex items-center">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {jobs.slice(0, 3).map(job => (
                    <div key={job.id} className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {job.applicants?.length || 0} applicants
                        </span>
                        <button 
                          onClick={() => handleViewApplicants(job)}
                          className="text-blue-600 text-sm font-medium"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Events Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                <button className="text-blue-600 text-sm font-medium flex items-center">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEvents.slice(0, 3).map((event, index) => (
                  <div key={event.id || index} className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="ml-2 text-sm font-medium text-blue-800">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'CompanyProfile':
        return <CompanyProfile />;
      case 'TalentSearch':
        return <TalentSearch />;
      case 'JobPostings':
        return <JobPostings />;
      case 'News and Events':
        return <Employerevents />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-xl shadow-lg lg:hidden transition-all duration-300 hover:bg-blue-700"
        aria-label="Toggle navigation"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-80 bg-white text-gray-700 p-6 flex flex-col transition-transform duration-300 ease-in-out transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-40 shadow-xl lg:shadow-none`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <Briefcase size={32} className="text-blue-600 mr-3" />
            <span className="text-xl font-bold text-gray-900">HireHub</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 lg:hidden hover:text-gray-600 p-1 rounded-lg transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1">
          {['Dashboard', 'CompanyProfile', 'TalentSearch', 'JobPostings', 'News and Events'].map((section) => (
            <a
              key={section}
              onClick={() => { setActiveSection(section); setIsSidebarOpen(false); }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                activeSection === section ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {section === 'Dashboard' && <LayoutDashboard size={20} />}
              {section === 'CompanyProfile' && <Building2 size={20} />}
              {section === 'TalentSearch' && <Search size={20} />}
              {section === 'JobPostings' && <Briefcase size={20} />}
              {section === 'News and Events' && <Calendar size={20} />}
              <span className="font-medium">{section}</span>
            </a>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-1">
          <a className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 text-gray-700 transition-all duration-200">
            <Settings size={20} className="text-gray-500" />
            <span className="font-medium">Settings</span>
          </a>
          <a className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 text-red-600 transition-all duration-200">
            <LogOut size={20} className="text-red-500" />
            <span className="font-medium">Log Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 lg:p-8 mt-16 lg:mt-0 lg:ml-80">
        <div className="w-full max-w-7xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;