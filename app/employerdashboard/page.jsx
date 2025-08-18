'use client';
import React, { useState } from 'react';
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
  LogOut
} from 'lucide-react';
import { createPortal } from 'react-dom';
import JobPostings from '../components/jobslistings/page.jsx';
import  CompanyProfile from "../components/companyprofile/page.jsx";
import  TalentSearch from "../components/Talentserch/page.jsx";
import Employerevents from '../components/EmployerEvent/page.jsx';

// NOTE: These are placeholder components for the purpose of this example.
// The dashboard content has been fully implemented below.


// Mock data for the employer's company profile
const initialCompanyProfile = {
  name: "Tech Innovators Inc.",
  location: "Nairobi, Kenya",
  industry: "Software Development",
  description: "We are a leading technology company dedicated to creating innovative solutions that solve complex problems. Our team is passionate about mentorship and empowering the next generation of tech talent.",
  logoUrl: "https://placehold.co/128x128/E0E7FF/4F46E5?text=TI",
  companySize: "500+ employees",
  website: "https://www.techinnovators.com",
  contact: {
    email: "careers@techinnovators.com",
    phone: "+254 712 345 678",
  },
};

// Mock data for students with more details and a new 'status' property
const mockStudents = [
  {
    id: 1,
    name: "Jane Doe",
    specialization: "Computer Science",
    university: "Kirinyaga University",
    status: "Student",
    gpa: 3.8,
    bio: "Passionate full-stack developer with a focus on building scalable web applications. Eager to contribute to a dynamic team.",
    skills: ["React", "Node.js", "SQL", "JavaScript", "TypeScript"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=JD",
  },
  {
    id: 2,
    name: "John Smith",
    specialization: "Business Administration",
    university: "University of Nairobi",
    status: "Alumni",
    gpa: 3.5,
    bio: "Results-driven marketing enthusiast with experience in digital marketing and SEO. Seeking an internship to apply theoretical knowledge.",
    skills: ["Marketing", "SEO", "Analytics", "Project Management", "Content Creation"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=JS",
  },
  {
    id: 3,
    name: "Emily White",
    specialization: "Mechanical Engineering",
    university: "Jomo Kenyatta University",
    status: "Student",
    gpa: 3.9,
    bio: "Aspiring robotics engineer with hands-on experience in CAD software and Python programming for automation.",
    skills: ["CAD", "Robotics", "Python", "Thermodynamics", "SolidWorks"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=EW",
  },
  {
    id: 4,
    name: "David Chen",
    specialization: "Data Science",
    university: "Strathmore University",
    status: "Student",
    gpa: 3.7,
    bio: "Data analyst with strong skills in statistical modeling and machine learning. Experienced in using Python libraries like Pandas and Scikit-learn.",
    skills: ["Python", "Machine Learning", "Pandas", "Statistics", "Data Visualization"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=DC",
  },
  {
    id: 5,
    name: "Sarah Kim",
    specialization: "Graphic Design",
    university: "Kirinyaga University",
    status: "Alumni",
    gpa: 3.6,
    bio: "Creative graphic designer specializing in UI/UX and brand identity. Proficient in Adobe Creative Suite and Figma.",
    skills: ["Adobe Suite", "UI/UX", "Branding", "Figma", "Typography"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=SK",
  },
  {
    id: 6,
    name: "Alex Johnson",
    specialization: "Computer Science",
    university: "Kirinyaga University",
    status: "Student",
    gpa: 4.0,
    bio: "Top student in my class with a passion for software architecture and efficient algorithms. Seeking a challenging internship.",
    skills: ["Java", "C++", "Data Structures", "Algorithms", "React"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=AJ",
  },
  {
    id: 7,
    name: "Michael Green",
    specialization: "Information Technology",
    university: "Kirinyaga University",
    status: "Student",
    gpa: 3.4,
    bio: "Network administrator with experience in server management and cybersecurity protocols. Looking for a hands-on IT role.",
    skills: ["Networking", "Cybersecurity", "Linux", "Cloud Computing", "Troubleshooting"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=MG",
  },
  {
    id: 8,
    name: "Jessica Lee",
    specialization: "Actuarial Science",
    university: "University of Nairobi",
    status: "Alumni",
    gpa: 3.9,
    bio: "Skilled in financial modeling and risk analysis. Eager to apply my analytical skills in an insurance or finance setting.",
    skills: ["Actuarial Science", "Statistics", "R", "SQL", "Risk Analysis"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=JL",
  },
];

// Mock data for job postings with more details
const mockJobs = [
  {
    id: "job-1",
    title: "Junior Software Developer",
    location: "Nairobi, Kenya",
    jobType: "Full-Time",
    experience: "Entry Level",
    salary: "$50,000 - $60,000",
    benefits: ["Health Insurance", "Paid Time Off", "Professional Development"],
    description: "Develop and maintain web applications using modern technologies. Collaborate with senior developers and product managers to build scalable and user-friendly solutions.",
    requirements: "Proficiency in React, Node.js, and a keen eye for detail. Bachelor's degree in Computer Science or related field.",
    applicants: [mockStudents[0], mockStudents[5], mockStudents[6]],
  },
  {
    id: "job-2",
    title: "Marketing Intern",
    location: "Remote",
    jobType: "Internship",
    experience: "Student",
    salary: "$15/hour",
    benefits: ["Flexible Schedule", "Mentorship Program"],
    description: "Assist the marketing team with content creation, social media management, and data analysis. This is a great opportunity to gain hands-on experience in a fast-paced environment.",
    requirements: "Strong communication skills, familiarity with digital marketing tools, and a passion for creative storytelling.",
    applicants: [mockStudents[1], mockStudents[4]],
  },
  {
    id: "job-3",
    title: "Data Analyst",
    location: "On-site",
    jobType: "Full-Time",
    experience: "1-3 Years",
    salary: "$70,000 - $85,000",
    benefits: ["401(k) Match", "Dental/Vision Insurance", "Gym Membership"],
    description: "Analyze large datasets to provide actionable insights and support business decisions. You will work closely with various departments to understand their data needs.",
    requirements: "Experience with Python (Pandas), SQL, and data visualization tools. Strong analytical and problem-solving skills.",
    applicants: [mockStudents[3], mockStudents[7]],
  },
];


const App = () => {
  const [companyProfile, setCompanyProfile] = useState(initialCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState(mockStudents);
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Helper function to handle nested object state updates
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

  // State management functions
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

  // This is the core logic that renders the correct component based on the activeSection state
  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        const totalStudents = students.filter(s => s.status === 'Student').length;
        const totalAlumni = students.filter(s => s.status === 'Alumni').length;
        const totalJobs = jobs.length;
        return (
          <div className="w-full">
            {/* Company Overview Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                <img
                  src={companyProfile.logoUrl}
                  alt={`${companyProfile.name} logo`}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto md:mx-0"
                />
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{companyProfile.name}</h1>
                  <p className="text-sm text-gray-600 mt-1 flex items-center justify-center md:justify-start gap-2">
                    <Globe size={16} /> {companyProfile.location} • {companyProfile.industry}
                  </p>
                  <p className="text-gray-500 mt-4 leading-relaxed text-sm">{companyProfile.description}</p>
                </div>
              </div>
            </div>

            {/* Stats Grid - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Total Students Card */}
              <div className="relative overflow-hidden bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between h-48">
                <div className="z-10">
                  <p className="text-lg font-semibold text-gray-700">Student Talent Pool</p>
                  <p className="text-5xl font-extrabold text-blue-600 mt-2">{totalStudents}</p>
                  <p className="text-sm text-gray-500 mt-2">Connecting with the next generation of innovators.</p>
                </div>
                <GraduationCap size={120} className="absolute -bottom-8 -right-8 text-blue-200 opacity-50 z-0" />
              </div>

              {/* Total Alumni Card */}
              <div className="relative overflow-hidden bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between h-48">
                <div className="z-10">
                  <p className="text-lg font-semibold text-gray-700">Valuable Alumni Network</p>
                  <p className="text-5xl font-extrabold text-green-600 mt-2">{totalAlumni}</p>
                  <p className="text-sm text-gray-500 mt-2">Access to a wide range of experienced professionals.</p>
                </div>
                <Users size={120} className="absolute -bottom-8 -right-8 text-green-200 opacity-50 z-0" />
              </div>

              {/* Job Postings Card */}
              <div className="relative overflow-hidden bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between h-48">
                <div className="z-10">
                  <p className="text-lg font-semibold text-gray-700">Active Job Postings</p>
                  <p className="text-5xl font-extrabold text-purple-600 mt-2">{totalJobs}</p>
                  <p className="text-sm text-gray-500 mt-2">Showcase opportunities to the right talent.</p>
                </div>
                <Briefcase size={120} className="absolute -bottom-8 -right-8 text-purple-200 opacity-50 z-0" />
              </div>
            </div>

            {/* Latest Students Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Students</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {students.slice(0, 4).map(student => (
                  <div key={student.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl shadow-sm">
                    <img src={student.imageUrl} alt={student.name} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.specialization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Job Postings Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Job Postings</h2>
              <ul className="space-y-4">
                {jobs.slice(0, 3).map(job => (
                  <li key={job.id} className="bg-gray-50 p-4 rounded-2xl shadow-sm">
                    <p className="font-semibold text-gray-900">{job.title}</p>
                    <p className="text-sm text-gray-500">{job.description.substring(0, 70)}...</p>
                  </li>
                ))}
              </ul>
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
        return (
            <div className="w-full">
              {/* Company Overview Section */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                  <img
                    src={companyProfile.logoUrl}
                    alt={`${companyProfile.name} logo`}
                    className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto md:mx-0"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{companyProfile.name}</h1>
                    <p className="text-sm text-gray-600 mt-1 flex items-center justify-center md:justify-start gap-2">
                      <Globe size={16} /> {companyProfile.location} • {companyProfile.industry}
                    </p>
                    <p className="text-gray-500 mt-4 leading-relaxed text-sm">{companyProfile.description}</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Fully Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Students Card */}
                <div className="relative overflow-hidden bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between h-48">
                  <div className="z-10">
                    <p className="text-lg font-semibold text-gray-700">Student Talent Pool</p>
                    <p className="text-5xl font-extrabold text-blue-600 mt-2">{students.filter(s => s.status === 'Student').length}</p>
                    <p className="text-sm text-gray-500 mt-2">Connecting with the next generation of innovators.</p>
                  </div>
                  <GraduationCap size={120} className="absolute -bottom-8 -right-8 text-blue-200 opacity-50 z-0" />
                </div>

                {/* Total Alumni Card */}
                <div className="relative overflow-hidden bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between h-48">
                  <div className="z-10">
                    <p className="text-lg font-semibold text-gray-700">Valuable Alumni Network</p>
                    <p className="text-5xl font-extrabold text-green-600 mt-2">{students.filter(s => s.status === 'Alumni').length}</p>
                    <p className="text-sm text-gray-500 mt-2">Access to a wide range of experienced professionals.</p>
                  </div>
                  <Users size={120} className="absolute -bottom-8 -right-8 text-green-200 opacity-50 z-0" />
                </div>

                {/* Job Postings Card */}
                <div className="relative overflow-hidden bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col justify-between h-48">
                  <div className="z-10">
                    <p className="text-lg font-semibold text-gray-700">Active Job Postings</p>
                    <p className="text-5xl font-extrabold text-purple-600 mt-2">{jobs.length}</p>
                    <p className="text-sm text-gray-500 mt-2">Showcase opportunities to the right talent.</p>
                  </div>
                  <Briefcase size={120} className="absolute -bottom-8 -right-8 text-purple-200 opacity-50 z-0" />
                </div>
              </div>

              {/* Latest Students Section */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Students</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {students.slice(0, 4).map(student => (
                    <div key={student.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl shadow-sm">
                      <img src={student.imageUrl} alt={student.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.specialization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Job Postings Section */}
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Job Postings</h2>
                <ul className="space-y-4">
                  {jobs.slice(0, 3).map(job => (
                    <li key={job.id} className="bg-gray-50 p-4 rounded-2xl shadow-sm">
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.description.substring(0, 70)}...</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg lg:hidden transition-transform duration-300 transform hover:scale-105"
        aria-label="Toggle navigation"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar - Now fixed for all screen sizes */}
      

    
      <aside
        className={`fixed inset-y-0 left-0 w-full sm:w-[60vw] md:w-[60vw] lg:w-[24vw] xl:w-[20vw] bg-gray-900 text-gray-300 p-6 flex flex-col transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:flex-shrink-0 z-40 bg-gradient-to-b from-gray-900 to-slate-950`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between lg:justify-center mb-10">
          <div className="flex items-center">
            <Briefcase size={36} className="text-blue-500 mr-3" />
            <span className="text-xl font-bold text-white">HireHub</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 lg:hidden hover:text-white p-2 rounded-lg transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu - Adjusted spacing for a more modern feel */}
        <nav className="flex-1 space-y-2">
          {/* Dashboard Link */}
          <a
            onClick={() => {
              setActiveSection('Dashboard');
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'Dashboard'
                ? 'bg-blue-600 text-white shadow-lg border-l-4 border-blue-400'
                : 'hover:bg-gray-700 hover:text-white'
            } justify-center lg:justify-start`}
            aria-label="Navigate to Dashboard"
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </a>

          {/* Company Profile Link */}
          <a
            onClick={() => {
              setActiveSection('CompanyProfile');
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'CompanyProfile'
                ? 'bg-blue-600 text-white shadow-lg border-l-4 border-blue-400'
                : 'hover:bg-gray-700 hover:text-white'
            } justify-center lg:justify-start`}
            aria-label="Navigate to Company Profile"
          >
            <Building2 size={20} />
            <span className="font-medium">Company Profile</span>
          </a>

          {/* Talent Search Link */}
          <a
            onClick={() => {
              setActiveSection('TalentSearch');
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'TalentSearch'
                ? 'bg-blue-600 text-white shadow-lg border-l-4 border-blue-400'
                : 'hover:bg-gray-700 hover:text-white'
            } justify-center lg:justify-start`}
            aria-label="Navigate to Talent Search"
          >
            <Search size={20} />
            <span className="font-medium">Talent Search</span>
          </a>

          {/* Job Postings Link */}
          <a
            onClick={() => {
              setActiveSection('JobPostings');
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'JobPostings'
                ? 'bg-blue-600 text-white shadow-lg border-l-4 border-blue-400'
                : 'hover:bg-gray-700 hover:text-white'
            } justify-center lg:justify-start`}
            aria-label="Navigate to Job Postings"
          >
            <Briefcase size={20} />
            <span className="font-medium">Job Postings</span>
          </a>
          
          {/* Job Postings Link */}
          <a
            onClick={() => {
              setActiveSection('News and Events');
              setIsSidebarOpen(false);
            }}
            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
              activeSection === 'News and Events'
                ? 'bg-blue-600 text-white shadow-lg border-l-4 border-blue-400'
                : 'hover:bg-gray-700 hover:text-white'
            } justify-center lg:justify-start`}
            aria-label="Navigate to Job Postings"
          >
            <Calendar size={20} />
            <span className="font-medium">News and Events</span>
          </a>
        </nav>

        {/* Separator */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* User and Settings Section - Now only contains Log Out */}
        <div className="mt-auto space-y-2">
          <a
            onClick={() => {
              // Handle logout logic here
              setIsSidebarOpen(false);
            }}
            className="flex items-center gap-4 p-4 rounded-xl cursor-pointer text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200 justify-center lg:justify-start"
            aria-label="Log Out"
          >
            <LogOut size={20} />
            <span className="font-medium">Log Out</span>
          </a>
        </div>
      </aside>


      {/* Main Content - Now has a left margin to account for the fixed sidebar on large screens */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 mt-16 lg:mt-0 lg:ml-[24vw] flex justify-center">
        <div className="w-full max-w-7xl h-full">
          {renderContent()}
        </div>
      </main>

      {/* Modal containers will appear here via createPortal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full m-auto shadow-2xl transform transition-all duration-300 scale-100">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-200"
            >
              <XCircle size={32} />
            </button>
            <p>Student Profile Modal</p>
          </div>
        </div>
      )}
      {selectedJobApplicants && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-white rounded-3xl p-8 max-w-3xl w-full m-auto shadow-2xl transform transition-all duration-300">
            <button
              onClick={() => setSelectedJobApplicants(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <XCircle size={32} />
            </button>
            <p>Applicants Modal</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
