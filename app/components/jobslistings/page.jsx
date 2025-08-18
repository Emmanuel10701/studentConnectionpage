'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Eye,
  CircleCheck,
  XCircle,
  Search,
  Users,
  GraduationCap,
  Mail,
  Paperclip,
  Bookmark,
  Pencil,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
  DollarSign,
  Clock,
  Shield,
  Star,
  UserCheck, // New icon for applicant profile
  Book, // New icon for GPA
} from 'lucide-react';
import { createPortal } from 'react-dom';

// --- MOCK DATA ---
const mockJobs = [
  {
    id: "job-1",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Business Analyst',
    employer: 'Data Insights Ltd.',
    description: 'As a Business Analyst, you will be the bridge between our business and technical teams. You will be responsible for gathering and documenting requirements, analyzing data to provide actionable insights, and making recommendations to improve business processes. This role requires a blend of strong communication skills, analytical thinking, and technical knowledge. You will work closely with stakeholders to understand their needs and translate them into clear specifications. We are looking for someone who is a natural problem-solver and can think critically about business challenges.',
    location: 'London, UK',
    officeType: 'Hybrid',
    salary: '45,000-55,000 GBP',
    type: 'Full-Time',
    qualifications: 'Bachelor\'s degree in Business, IT, or a related field. At least 2 years of experience as a business analyst. Proficiency in data analysis tools like Tableau or Power BI is a plus.',
    skills: ['Business Analysis', 'Requirements Gathering', 'Data Analysis', 'SQL', 'Process Mapping'],
    benefits: ['Generous holiday allowance', 'Flexible working hours', 'Professional development support', 'Company pension scheme'],
    industry: 'Technology',
    postDate: new Date('2025-08-08T12:00:00Z'),
    applicants: [1, 2], // In a real app, this would be an array of applicant IDs
  },
  {
    id: "job-2",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Junior Software Developer',
    employer: 'Innovate Solutions Inc.',
    description: 'Develop and maintain web applications using modern technologies. Work on a dynamic team to build scalable and high-performance software.',
    location: 'Nairobi, Kenya',
    officeType: 'On-site',
    salary: 'KES 80,000 - 100,000',
    type: 'Full-Time',
    qualifications: 'Bachelor\'s degree in Computer Science. Proficiency in React and Node.js. Experience with database technologies like MongoDB or SQL.',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB'],
    benefits: ['Health Insurance', 'Gym Membership', 'Paid Time Off'],
    industry: 'Technology',
    postDate: new Date('2025-08-05T10:00:00Z'),
    applicants: [1],
  },
  {
    id: "job-3",
    employerId: "68a21c5d52b4b2a5451368b2",
    title: 'Marketing Intern',
    employer: 'Creative Hubs',
    description: 'Assist the marketing team with content creation, social media management, and data analysis. This is a great opportunity for a student to gain real-world experience.',
    location: 'Cape Town, South Africa',
    officeType: 'Remote',
    salary: 'ZAR 10,000 - 15,000',
    type: 'Internship',
    qualifications: 'Currently enrolled in a Bachelor\'s program for Business or Marketing. Strong communication and writing skills. Familiarity with social media platforms.',
    skills: ['Social Media', 'Content Creation', 'SEO', 'Analytics'],
    benefits: ['Flexible schedule', 'Mentorship program', 'Networking events'],
    industry: 'Marketing',
    postDate: new Date('2025-08-01T09:00:00Z'),
    applicants: [2],
  },
  {
    id: "job-4",
    employerId: "68a21c5d52b4b2a5451368b3",
    title: 'Data Analyst',
    employer: 'Analytics Pros',
    description: 'Analyze large datasets to provide actionable insights and support business decisions. You will use a variety of tools to transform raw data into a clear narrative.',
    location: 'San Francisco, CA',
    officeType: 'Hybrid',
    salary: '$70,000 - $85,000',
    type: 'Full-Time',
    qualifications: 'Experience with Python (Pandas), SQL, and data visualization tools like Tableau. Strong analytical and problem-solving skills.',
    skills: ['Python', 'SQL', 'Data Visualization', 'Pandas', 'Statistics'],
    benefits: ['401k matching', 'Comprehensive health plans', 'Performance bonuses'],
    industry: 'Data Science',
    postDate: new Date('2025-07-28T14:00:00Z'),
    applicants: [],
  },
  {
    id: "job-5",
    employerId: "68a21c5d52b4b2a5451368b4",
    title: 'Graphic Designer',
    employer: 'Brand Innovators',
    description: 'Join our creative team to design captivating visuals for various campaigns. Your role will involve everything from digital ads to print materials.',
    location: 'Berlin, Germany',
    officeType: 'On-site',
    salary: '€40,000 - €50,000',
    type: 'Full-Time',
    qualifications: 'Portfolio showcasing strong design skills. Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign) and Figma.',
    skills: ['Adobe Suite', 'Figma', 'UI/UX', 'Branding', 'Typography'],
    benefits: ['Creative workshops', 'Paid conferences', 'Commuter benefits'],
    industry: 'Design',
    postDate: new Date('2025-07-25T11:00:00Z'),
    applicants: [],
  },
  {
    id: "job-6",
    employerId: "68a21c5d52b4b2a5451368b5",
    title: 'Cybersecurity Analyst',
    employer: 'SecureNet Solutions',
    description: 'Protect company systems and data from cyber threats. You will conduct risk assessments, monitor network traffic, and respond to security incidents.',
    location: 'Singapore',
    officeType: 'Hybrid',
    salary: 'SGD 60,000 - 75,000',
    type: 'Full-Time',
    qualifications: 'Relevant certifications (e.g., CompTIA Security+). Experience with SIEM tools and network security protocols. Bachelor\'s degree in a related field.',
    skills: ['Cybersecurity', 'Network Security', 'Risk Assessment', 'Incident Response'],
    benefits: ['Professional certifications covered', 'Flexible hours', 'Employee stock options'],
    industry: 'Cybersecurity',
    postDate: new Date('2025-07-20T16:00:00Z'),
    applicants: [],
  },
  {
    id: "job-7",
    employerId: "68a21c5d52b4b2a5451368b6",
    title: 'Financial Controller',
    employer: 'Global Finance Corp.',
    description: 'Manage and oversee the company\'s financial operations, including budgeting, forecasting, and financial reporting. You will ensure compliance with all regulations.',
    location: 'Dubai, UAE',
    officeType: 'On-site',
    salary: 'AED 150,000 - 200,000',
    type: 'Full-Time',
    qualifications: 'CPA or equivalent certification. At least 5 years of experience in a similar role. Strong knowledge of accounting principles and financial software.',
    skills: ['Financial Reporting', 'Budgeting', 'Forecasting', 'Auditing'],
    benefits: ['Annual performance bonus', 'Health and dental coverage', 'Travel allowance'],
    industry: 'Finance',
    postDate: new Date('2025-07-15T08:00:00Z'),
    applicants: [],
  },
  {
    id: "job-8",
    employerId: "68a21c5d52b4b2a5451368b7",
    title: 'HR Generalist',
    employer: 'People First Solutions',
    description: 'Handle various human resources functions, including recruitment, employee relations, and performance management. You will be a key point of contact for all employees.',
    location: 'Toronto, Canada',
    officeType: 'Hybrid',
    salary: 'CAD 60,000 - 75,000',
    type: 'Full-Time',
    qualifications: 'Bachelor\'s degree in Human Resources or Business Administration. 2-3 years of HR experience. Strong interpersonal and communication skills.',
    skills: ['Recruitment', 'Employee Relations', 'Performance Management', 'HRIS'],
    benefits: ['Professional development budget', 'Health and wellness programs', 'Remote work options'],
    industry: 'Human Resources',
    postDate: new Date('2025-07-10T13:00:00Z'),
    applicants: [],
  },
  {
    id: "job-9",
    employerId: "68a21c5d52b4b2a5451368b8",
    title: 'Research Scientist',
    employer: 'BioTech Innovations',
    description: 'Conduct experiments and analyze data for new drug discovery. Your work will directly impact patient care and public health.',
    location: 'Boston, MA',
    officeType: 'On-site',
    salary: '$90,000 - $110,000',
    type: 'Full-Time',
    qualifications: 'Ph.D. in Biology, Chemistry, or a related field. Proven experience in a lab setting. Strong publication record is a plus.',
    skills: ['Molecular Biology', 'Data Analysis', 'Lab Techniques', 'Scientific Writing'],
    benefits: ['Medical, dental, vision insurance', '401k with company match', 'Relocation assistance'],
    industry: 'Biotechnology',
    postDate: new Date('2025-07-05T15:00:00Z'),
    applicants: [],
  },
  {
    id: "job-10",
    employerId: "68a21c5d52b4b2a5451368b9",
    title: 'Project Manager',
    employer: 'Build Right Construction',
    description: 'Oversee and manage construction projects from conception to completion. Ensure projects are delivered on time and within budget.',
    location: 'Sydney, Australia',
    officeType: 'On-site',
    salary: 'AUD 95,000 - 110,000',
    type: 'Full-Time',
    qualifications: 'Bachelor\'s degree in Engineering or Construction Management. PMP certification is preferred. At least 5 years of project management experience.',
    skills: ['Project Management', 'Budgeting', 'Scheduling', 'Risk Management'],
    benefits: ['Company vehicle', 'Performance-based bonuses', 'Tool allowance'],
    industry: 'Construction',
    postDate: new Date('2025-07-01T10:00:00Z'),
    applicants: [],
  },
];

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
];


// --- COMPONENTS ---
/**
 * A modal for confirming a delete action.
 * Uses createPortal to render outside the main DOM tree.
 */
const DeleteConfirmationModal = ({ onConfirm, onCancel, title, message }) => {
  return createPortal(
    <div className="fixed inset-0 z-[102] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full m-auto shadow-2xl transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};


/**
 * A modal to display the applicants for a specific job.
 * Now handles both the list of applicants and the detailed profile view.
 */
const ApplicantsModal = ({ job, applicants, allStudents, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const jobApplicants = applicants.map(applicantId =>
    allStudents.find(student => student.id === applicantId)
  ).filter(Boolean); // Filter out any undefined results

  const filteredApplicants = jobApplicants.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!job || !allStudents) return null;

  const handleBackToList = () => {
    setSelectedApplicant(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-3xl p-8 max-w-5xl w-full mx-auto shadow-2xl transform transition-all duration-300 scale-100 my-8">
        <button
          onClick={selectedApplicant ? handleBackToList : onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <XCircle size={32} />
        </button>
        
        {!selectedApplicant && (
          <>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Applicants for "{job.title}"</h3>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by name, major, or university..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {filteredApplicants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto pr-2">
                {filteredApplicants.map(student => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedApplicant(student)}
                    className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-100"
                  >
                    <img src={student.imageUrl} alt={student.name} className="w-20 h-20 rounded-full border-2 border-blue-200 shadow-md" />
                    <div className="space-y-1">
                      <p className="font-bold text-lg text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600 font-medium truncate">{student.specialization}</p>
                      <p className="text-xs font-medium text-gray-400">{student.university}</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {student.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No matching applicants found.</p>
            )}
          </>
        )}

        {selectedApplicant && (
          <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                <ChevronLeft size={20} /> Back to List
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Card */}
              <div className="w-full md:w-1/3 flex flex-col items-center bg-gray-50 p-8 rounded-2xl shadow-inner border border-gray-200">
                <img src={selectedApplicant.imageUrl} alt={selectedApplicant.name} className="w-32 h-32 rounded-full border-4 border-blue-200 mb-4 shadow-lg" />
                <h2 className="text-3xl font-bold text-gray-900">{selectedApplicant.name}</h2>
                <p className="text-md text-blue-600 font-semibold mb-2">{selectedApplicant.specialization}</p>
                <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                  <GraduationCap size={16} /> {selectedApplicant.university}
                </p>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <a href={selectedApplicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors">
                    <Paperclip size={20} />
                  </a>
                  <button className="p-3 bg-gray-200 text-gray-700 rounded-full shadow-md hover:bg-gray-300 transition-colors">
                    <Mail size={20} />
                  </button>
                </div>
              </div>
              
              {/* Details Section */}
              <div className="w-full md:w-2/3 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex items-center gap-3 text-gray-700 mb-2">
                    <UserCheck size={20} />
                    <p className="text-lg font-semibold">About Me</p>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{selectedApplicant.bio}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="flex items-center gap-3 text-gray-700 mb-2">
                    <Star size={20} />
                    <p className="text-lg font-semibold">Skills</p>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills.map(skill => (
                      <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="flex items-center gap-3 text-gray-700 mb-2">
                      <Book size={20} />
                      <p className="text-lg font-semibold">Education</p>
                    </h3>
                    <p className="text-sm text-gray-600">GPA: <span className="font-bold text-gray-800">{selectedApplicant.gpa}</span></p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="flex items-center gap-3 text-gray-700 mb-2">
                      <Briefcase size={20} />
                      <p className="text-lg font-semibold">Status</p>
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">{selectedApplicant.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};


/**
 * The main component for displaying and managing job postings.
 * Now includes edit functionality, pagination, and displays all new fields.
 */
const JobPostings = ({
  jobs,
  handleSaveJob,
  handleDeleteJob,
  handleViewApplicants,
  handleEditJob,
  editingJob,
  setEditingJob
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    employer: "",
    description: "",
    location: "",
    officeType: "On-site",
    salary: "",
    type: "Full-Time",
    qualifications: "",
    skills: "", // Comma-separated string
    benefits: "", // Comma-separated string
    industry: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    if (editingJob) {
      setNewJob({
        ...editingJob,
        skills: editingJob.skills.join(', '),
        benefits: editingJob.benefits.join(', '),
      });
      setShowForm(true);
    } else {
      setNewJob({
        title: "",
        employer: "",
        description: "",
        location: "",
        officeType: "On-site",
        salary: "",
        type: "Full-Time",
        qualifications: "",
        skills: "",
        benefits: "",
        industry: "",
      });
    }
  }, [editingJob]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newJob.title && newJob.description) {
      const jobData = {
        ...newJob,
        skills: newJob.skills.split(',').map(s => s.trim()),
        benefits: newJob.benefits.split(',').map(b => b.trim()),
      };
      handleSaveJob(jobData, editingJob ? editingJob.id : null);
      setNewJob({
        title: "",
        employer: "",
        description: "",
        location: "",
        officeType: "On-site",
        salary: "",
        type: "Full-Time",
        qualifications: "",
        skills: "",
        benefits: "",
        industry: "",
      });
      setEditingJob(null);
      setShowForm(false);
    }
  };

  const openDeleteModal = (jobId) => {
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setJobToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    handleDeleteJob(jobToDelete);
    closeDeleteModal();
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 bg-gray-50 bg-opacity-90 backdrop-blur-md p-4 md:p-8 rounded-b-3xl shadow-xl flex justify-between items-center flex-wrap gap-4 border-b border-gray-200">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center gap-2">
          <Bookmark size={36} className="text-blue-600" /> Job Board
        </h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingJob(null);
          }}
          className={`flex-shrink-0 flex items-center gap-2 font-bold py-3 px-6 rounded-full shadow-md transform transition-all duration-300 text-sm
            ${showForm ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {showForm ? <><XCircle size={18} /> Close Form</> : <><Plus size={18} /> Post a New Job</>}
        </button>
      </div>

      <div className="bg-gray-100 p-4 md:p-8 pt-24 min-h-screen">
        {showForm && (
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-2xl mb-8 border border-gray-200 shadow-inner">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-gray-500" /> {editingJob ? 'Edit Job Listing' : 'Create a New Job Listing'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newJob.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="employer" className="block text-sm font-medium text-gray-700">Employer</label>
                <input
                  type="text"
                  id="employer"
                  name="employer"
                  value={newJob.employer}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newJob.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="officeType" className="block text-sm font-medium text-gray-700">Office Type</label>
                <select
                  id="officeType"
                  name="officeType"
                  value={newJob.officeType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={newJob.salary}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
                <select
                  id="type"
                  name="type"
                  value={newJob.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={newJob.industry}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">Qualifications</label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={newJob.qualifications}
                  onChange={handleInputChange}
                  rows="2"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                ></textarea>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newJob.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                ></textarea>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (Comma-separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={newJob.skills}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                />
              </div>
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Benefits (Comma-separated)</label>
                <input
                  type="text"
                  id="benefits"
                  name="benefits"
                  value={newJob.benefits}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <CircleCheck size={20} className="mr-2" /> {editingJob ? 'Update Job' : 'Post Job'}
            </button>
          </form>
        )}

        <div className="flex flex-col gap-6">
          {currentJobs.length > 0 ? (
            currentJobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-200">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase size={20} className="text-blue-500" />{job.title}
                      </h3>
                      <p className="text-sm font-semibold text-gray-600 mt-1">{job.employer}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-600">{job.applicants?.length || 0} Applicants</span>
                      <Users size={20} className="text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm font-medium text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" /> {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Building size={16} className="text-gray-400" /> {job.officeType}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-gray-400" /> {job.salary}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" /> {job.type}
                    </div>
                  </div>
                  <p className="text-base text-gray-600">{job.description}</p>
                  <div className="text-sm text-gray-500 space-y-2">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Star size={16} className="text-gray-400" /> Qualifications:
                    </h4>
                    <p>{job.qualifications}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2 text-sm mb-2">
                      <Paperclip size={16} className="text-gray-400" /> Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.map(skill => (
                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2 text-sm mb-2">
                      <Shield size={16} className="text-gray-400" /> Benefits:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.benefits?.map(benefit => (
                        <span key={benefit} className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    onClick={() => handleEditJob(job)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-sm font-medium rounded-full shadow-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Pencil size={18} /> Edit
                  </button>
                  <button
                    onClick={() => handleViewApplicants(job)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={18} /> View Applicants
                  </button>
                  <button
                    onClick={() => openDeleteModal(job.id)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full py-12">You haven't posted any jobs yet.</p>
          )}
        </div>

        {jobs.length > jobsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full transition-colors ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <ChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`w-8 h-8 rounded-full font-semibold transition-colors
                  ${currentPage === index + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full transition-colors ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {showDeleteModal && (
          <DeleteConfirmationModal
            onConfirm={confirmDelete}
            onCancel={closeDeleteModal}
            title="Confirm Deletion"
            message="Are you sure you want to delete this job posting? This action cannot be undone."
          />
        )}
      </div>
    </>
  );
};

/**
 * Main App Component to manage state and render different views.
 */
export default function App() {
  const [jobs, setJobs] = useState(mockJobs);
  const [view, setView] = useState('job-postings');
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSaveJob = (jobData, jobId = null) => {
    if (jobId) {
      setJobs(jobs.map(job => (job.id === jobId ? { ...job, ...jobData } : job)));
    } else {
      const newId = `job-${Date.now()}`;
      setJobs([{ ...jobData, id: newId, postDate: new Date(), applicants: [] }, ...jobs]);
    }
  };

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    setView('applicants');
  };

  const handleEditJob = (job) => {
    setJobs(jobs.map(j => j.id === job.id ? { ...j, isEditing: true } : { ...j, isEditing: false }));
  };

  const handleEditJobSave = (updatedJob) => {
    setJobs(jobs.map(job =>
      job.id === updatedJob.id ? { ...updatedJob, isEditing: false } : job
    ));
  };

  const renderView = () => {
    switch (view) {
      case 'job-postings':
        return (
          <JobPostings
            jobs={jobs}
            handleSaveJob={handleSaveJob}
            handleDeleteJob={handleDeleteJob}
            handleViewApplicants={handleViewApplicants}
            handleEditJob={handleEditJob}
            editingJob={jobs.find(j => j.isEditing)}
            setEditingJob={job => setJobs(jobs.map(j => j.id === job.id ? { ...j, isEditing: true } : { ...j, isEditing: false }))}
          />
        );
      case 'applicants':
        return (
          <ApplicantsModal
            job={selectedJob}
            applicants={selectedJob.applicants}
            allStudents={mockStudents}
            onClose={() => setView('job-postings')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans text-gray-900 antialiased">
      {renderView()}
    </div>
  );
}
