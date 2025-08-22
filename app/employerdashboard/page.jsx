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
  Target
} from 'lucide-react';

// --- Imported Components ---
import JobPostings from '../components/jobslistings/page.jsx';
import CompanyProfile from "../components/companyprofile/page.jsx";
import TalentSearch from "../components/Talentserch/page.jsx";
import Employerevents from '../components/EmployerEvent/page.jsx';

// --- Mock Data (for demonstration) ---
const mockStudents = [
  {
    id: 1, name: "Jane Doe", specialization: "Computer Science", university: "Kirinyaga University", status: "Student", gpa: 3.8, bio: "Passionate full-stack developer with a focus on building scalable web applications. Eager to contribute to a dynamic team.", skills: ["React", "Node.js", "SQL", "JavaScript", "TypeScript"], resumeUrl: "#", imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=JD",
  },
  {
    id: 2, name: "John Smith", specialization: "Business Administration", university: "University of Nairobi", status: "Alumni", gpa: 3.5, bio: "Results-driven marketing enthusiast with experience in digital marketing and SEO. Seeking an internship to apply theoretical knowledge.", skills: ["Marketing", "SEO", "Analytics", "Project Management", "Content Creation"], resumeUrl: "#", imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=JS",
  },
  {
    id: 3, name: "Emily White", specialization: "Mechanical Engineering", university: "Jomo Kenyatta University", status: "Student", gpa: 3.9, bio: "Aspiring robotics engineer with hands-on experience in CAD software and Python programming for automation.", skills: ["CAD", "Robotics", "Python", "Thermodynamics", "SolidWorks"], resumeUrl: "#", imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=EW",
  },
  {
    id: 4, name: "David Chen", specialization: "Data Science", university: "Strathmore University", status: "Student", gpa: 3.7, bio: "Data analyst with strong skills in statistical modeling and machine learning. Experienced in using Python libraries like Pandas and Scikit-learn.", skills: ["Python", "Machine Learning", "Pandas", "Statistics", "Data Visualization"], resumeUrl: "#", imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=DC",
  },
  {
    id: 5, name: "Sarah Kim", specialization: "Graphic Design", university: "Kirinyaga University", status: "Alumni", gpa: 3.6, bio: "Creative graphic designer specializing in UI/UX and brand identity. Proficient in Adobe Creative Suite and Figma.", skills: ["Adobe Suite", "UI/UX", "Branding", "Figma", "Typography"], resumeUrl: "#", imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=SK",
  },
  {
    id: 6, name: "Alex Johnson", specialization: "Computer Science", university: "Kirinyaga University", status: "Student", gpa: 4.0, bio: "Top student in my class with a passion for software architecture and efficient algorithms. Seeking a challenging internship.", skills: ["Java", "C++", "Data Structures", "Algorithms", "React"], resumeUrl: "#", imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=AJ",
  },
  {
    id: 7, name: "Michael Green", specialization: "Information Technology", university: "Kirinyaga University", status: "Student", gpa: 3.4, bio: "Network administrator with experience in server management and cybersecurity protocols. Looking for a hands-on IT role.", skills: ["Networking", "Cybersecurity", "Linux", "Cloud Computing", "Troubleshooting"], resumeUrl: "#", imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=MG",
  },
  {
    id: 8, name: "Jessica Lee", specialization: "Actuarial Science", university: "University of Nairobi", status: "Alumni", gpa: 3.9, bio: "Skilled in financial modeling and risk analysis. Eager to apply my analytical skills in an insurance or finance setting.", skills: ["Actuarial Science", "Statistics", "R", "SQL", "Risk Analysis"], resumeUrl: "#", imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=JL",
  },
];

const mockJobs = [
  {
    id: "job-1", title: "Junior Software Developer", location: "Nairobi, Kenya", jobType: "Full-Time", experience: "Entry Level", salary: "$50,000 - $60,000", benefits: ["Health Insurance", "Paid Time Off", "Professional Development"], description: "Develop and maintain web applications using modern technologies. Collaborate with senior developers and product managers to build scalable and user-friendly solutions.", requirements: "Proficiency in React, Node.js, and a keen eye for detail. Bachelor's degree in Computer Science or related field.", applicants: [mockStudents[0].id, mockStudents[5].id, mockStudents[6].id],
  },
  {
    id: "job-2", title: "Marketing Intern", location: "Remote", jobType: "Internship", experience: "Student", salary: "$15/hour", benefits: ["Flexible Schedule", "Mentorship Program"], description: "Assist the marketing team with content creation, social media management, and data analysis. This is a great opportunity to gain hands-on experience in a fast-paced environment.", requirements: "Strong communication skills, familiarity with digital marketing tools, and a passion for creative storytelling.", applicants: [mockStudents[1].id, mockStudents[4].id],
  },
  {
    id: "job-3", title: "Data Analyst", location: "On-site", jobType: "Full-Time", experience: "1-3 Years", salary: "$70,000 - $85,000", benefits: ["401(k) Match", "Dental/Vision Insurance", "Gym Membership"], description: "Analyze large datasets to provide actionable insights and support business decisions. You will work closely with various departments to understand their data needs.", requirements: "Experience with Python (Pandas), SQL, and data visualization tools. Strong analytical and problem-solving skills.", applicants: [mockStudents[3].id, mockStudents[7].id],
  },
];

const mockInitialCompanyProfile = {
  name: "Tech Innovators Inc.", location: "Nairobi, Kenya", industry: "Software Development", description: "We are a leading technology company dedicated to creating innovative solutions that solve complex problems. Our team is passionate about mentorship and empowering the next generation of tech talent.", logoUrl: "https://placehold.co/128x128/E0E7FF/4F46E5?text=TI", companySize: "500+ employees", website: "https://www.techinnovators.com", contact: { email: "careers@techinnovators.com", phone: "+254 712 345 678", },
};

// --- Mock API Endpoints (for demonstration) ---
const mockApi = {
  fetchCompanyProfile: (employerId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockInitialCompanyProfile), 500);
    });
  },
  fetchJobs: (employerId) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockJobs), 500);
    });
  },
  fetchStudents: () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStudents), 500);
    });
  },
};

// --- Main Employer Dashboard Component ---
const App = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [companyProfile, setCompanyProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  
  // FIX: Initialize with a value that works for both server and client.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // FIX: Use useEffect to set the initial state on the client side only.
  useEffect(() => {
    // This code will only run in the browser after the component has mounted.
    // It prevents a hydration mismatch.
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  // Effect to handle authentication and data fetching
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/Employerlogin');
      return;
    }

    if (status === 'authenticated' && session?.user?.id) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          const [profileData, studentsData, jobsData] = await Promise.all([
            mockApi.fetchCompanyProfile(session.user.id),
            mockApi.fetchStudents(),
            mockApi.fetchJobs(session.user.id)
          ]);

          setCompanyProfile(profileData);
          setStudents(studentsData);

          const jobsWithApplicants = jobsData.map(job => ({
            ...job,
            applicants: job.applicants.map(applicantId =>
              studentsData.find(student => student.id === applicantId)
            ).filter(Boolean)
          }));
          setJobs(jobsWithApplicants);

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
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePostJob = (newJob) => {
    const newId = `job-${jobs.length + 1}`;
    setJobs(prevJobs => [...prevJobs, { ...newJob, id: newId, applicants: [] }]);
  };

  const handleDeleteJob = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const handleViewApplicants = (job) => {
    setSelectedJobApplicants({ job, applicants: job.applicants });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-500">Loading dashboard...</p>
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    }
    if (!companyProfile) {
      return <div className="text-center text-gray-500 p-8">No company profile found. Please create one.</div>;
    }

    switch (activeSection) {
      case 'Dashboard':
        const totalStudents = students.filter(s => s.status === 'Student').length;
        const totalAlumni = students.filter(s => s.status === 'Alumni').length;
        const totalJobs = jobs.length;
        return (
          <div className="w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Welcome back, {companyProfile.name}</p>
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
                      {companyProfile.name.charAt(0)}
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10 border border-gray-200">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <User className="h-4 w-4 mr-2" /> Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                        <Settings className="h-4 w-4 mr-2" /> Settings
                      </a>
                      <div className="border-t border-gray-100 my-1"></div>
                      <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                        <LogOut className="h-4 w-4 mr-2" /> Sign out
                      </a>
                    </div>
                  )}
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
                    <p className="text-sm text-gray-500">Student Talent</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" /> 12% increase
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-50">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{totalAlumni}</h2>
                    <p className="text-sm text-gray-500">Alumni Network</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" /> 8% increase
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">{totalJobs}</h2>
                    <p className="text-sm text-gray-500">Active Jobs</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" /> 5 new this month
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-orange-50">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">87%</h2>
                    <p className="text-sm text-gray-500">Match Rate</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" /> 3% improvement
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Latest Students Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Talent</h2>
                  <button className="text-blue-600 text-sm font-medium flex items-center">
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {students.slice(0, 3).map(student => (
                    <div key={student.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setSelectedStudent(student)}>
                      <img src={student.imageUrl} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-500">{student.specialization} • {student.university}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {student.status}
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
                      <p className="text-sm text-gray-500 mt-1">{job.location} • {job.jobType}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {job.applicants.length} applicants
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
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-blue-800">Tomorrow</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Campus Recruitment</h3>
                  <p className="text-sm text-gray-500 mt-1">University of Nairobi</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-purple-800">Oct 15</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Tech Career Fair</h3>
                  <p className="text-sm text-gray-500 mt-1">KICC, Nairobi</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="ml-2 text-sm font-medium text-green-800">Oct 22</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Interview Workshop</h3>
                  <p className="text-sm text-gray-500 mt-1">Virtual Event</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'CompanyProfile':
        return <CompanyProfile profile={companyProfile} isEditing={isEditing} handleProfileChange={handleProfileChange} setIsEditing={setIsEditing} />;
      case 'TalentSearch':
        return <TalentSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} filteredStudents={filteredStudents} setSelectedStudent={setSelectedStudent} />;
      case 'JobPostings':
        return <JobPostings jobs={jobs} handlePostJob={handlePostJob} handleDeleteJob={handleDeleteJob} handleViewApplicants={handleViewApplicants} selectedJobApplicants={selectedJobApplicants} setSelectedStudent={setSelectedStudent} setSelectedJobApplicants={setSelectedJobApplicants} />;
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
        // Updated classes for a wider, always-fixed sidebar without scrolling
        className={`fixed inset-y-0 left-0 w-[24rem] bg-white text-gray-700 p-6 flex flex-col transition-transform duration-300 ease-in-out transform ${
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
          {/* Dashboard Link */}
          <a
            onClick={() => { setActiveSection('Dashboard'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'Dashboard' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
            aria-label="Navigate to Dashboard"
          >
            <LayoutDashboard size={20} className={activeSection === 'Dashboard' ? 'text-blue-600' : 'text-gray-500'} />
            <span className="font-medium">Dashboard</span>
          </a>

          {/* Company Profile Link */}
          <a
            onClick={() => { setActiveSection('CompanyProfile'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'CompanyProfile' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
            aria-label="Navigate to Company Profile"
          >
            <Building2 size={20} className={activeSection === 'CompanyProfile' ? 'text-blue-600' : 'text-gray-500'} />
            <span className="font-medium">Company Profile</span>
          </a>

          {/* Talent Search Link */}
          <a
            onClick={() => { setActiveSection('TalentSearch'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'TalentSearch' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
            aria-label="Navigate to Talent Search"
          >
            <Search size={20} className={activeSection === 'TalentSearch' ? 'text-blue-600' : 'text-gray-500'} />
            <span className="font-medium">Talent Search</span>
          </a>

          {/* Job Postings Link */}
          <a
            onClick={() => { setActiveSection('JobPostings'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'JobPostings' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
            aria-label="Navigate to Job Postings"
          >
            <Briefcase size={20} className={activeSection === 'JobPostings' ? 'text-blue-600' : 'text-gray-500'} />
            <span className="font-medium">Job Postings</span>
          </a>
          
          {/* News and Events Link */}
          <a
            onClick={() => { setActiveSection('News and Events'); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'News and Events' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
            aria-label="Navigate to News and Events"
          >
            <Calendar size={20} className={activeSection === 'News and Events' ? 'text-blue-600' : 'text-gray-500'} />
            <span className="font-medium">News and Events</span>
          </a>
        </nav>

        {/* Separator */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Bottom Section */}
        <div className="space-y-1">
          <a
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 text-gray-700 transition-all duration-200"
          >
            <Settings size={20} className="text-gray-500" />
            <span className="font-medium">Settings</span>
          </a>
          <a
            onClick={() => {
              // Handle logout logic here
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 text-red-600 transition-all duration-200"
            aria-label="Log Out"
          >
            <LogOut size={20} className="text-red-500" />
            <span className="font-medium">Log Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-5 lg:p-8 mt-16 lg:mt-0 lg:ml-[24rem]">
        <div className="w-full max-w-7xl mx-auto h-full">
          {renderContent()}
        </div>
      </main>

      {/* Modals */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white rounded-2xl p-6 max-w-lg w-full m-auto shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
            {/* Student Profile Modal Content */}
            <div className="flex flex-col">
              <div className="flex items-center">
                <img src={selectedStudent.imageUrl} alt={selectedStudent.name} className="w-20 h-20 rounded-full object-cover" />
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-sm text-gray-600">{selectedStudent.specialization}</p>
                  <p className="text-sm text-gray-500">{selectedStudent.university}</p>
                  <div className="mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedStudent.status === 'Student' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* ... rest of the modal content */}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;