
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
  UserCheck,
  Book,
  Filter,
  X,
  Download,
  Send,
  Calendar,
  BarChart3,
  TrendingUp,
  Award,
  Heart,
  BookOpen,
  Target,
  Zap,
  HeartHandshake
} from 'lucide-react';
import { createPortal } from 'react-dom';

// --- MOCK DATA ---
// --- MOCK DATA ---
const mockJobs = [
  {
    id: "job-1",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Business Analyst',
    employer: 'Data Insights Ltd.',
    description: 'As a Business Analyst, you will bridge business and technical teams by gathering requirements and analyzing data. You will deliver insights and recommend process improvements for better decision-making.',
    location: 'London, UK',
    officeType: 'Hybrid',
    salary: '45,000-55,000 GBP',
    type: 'Full-Time',
    qualifications: 'Bachelor\'s degree in Business, IT, or a related field. 2+ years of experience as a business analyst.',
    skills: ['Business Analysis', 'Requirements Gathering', 'Data Analysis', 'SQL', 'Process Mapping'],
    benefits: ['Generous holiday allowance', 'Flexible working hours', 'Professional development support'],
    industry: 'Technology',
    postDate: new Date('2025-08-08T12:00:00Z'),
    applicants: [1, 2],
    status: 'active',
    views: 124,
    matches: 87
  },
  {
    id: "job-2",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Junior Software Developer',
    employer: 'Innovate Solutions Inc.',
    description: 'Join our engineering team to develop and maintain web applications with modern frameworks. You’ll collaborate with senior developers to build scalable, high-performance software.',
    location: 'Nairobi, Kenya',
    officeType: 'On-site',
    salary: 'KES 80,000 - 100,000',
    type: 'Full-Time',
    qualifications: 'Bachelor\'s degree in Computer Science. Proficiency in React and Node.js.',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB'],
    benefits: ['Health Insurance', 'Gym Membership', 'Paid Time Off'],
    industry: 'Technology',
    postDate: new Date('2025-08-05T10:00:00Z'),
    applicants: [1],
    status: 'active',
    views: 98,
    matches: 65
  },
  {
    id: "job-3",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Digital Marketing Specialist',
    employer: 'Bright Media Agency',
    description: 'Plan and execute digital marketing campaigns across social media and search platforms. Analyze campaign performance and optimize for maximum ROI.',
    location: 'New York, USA',
    officeType: 'Remote',
    salary: '$55,000 - $65,000',
    type: 'Full-Time',
    qualifications: 'Degree in Marketing or related field. Experience with SEO, PPC, and Google Analytics.',
    skills: ['SEO', 'PPC', 'Social Media Marketing', 'Analytics', 'Content Strategy'],
    benefits: ['Remote work', 'Health benefits', 'Training programs'],
    industry: 'Marketing',
    postDate: new Date('2025-08-10T09:00:00Z'),
    applicants: [3, 4],
    status: 'active',
    views: 210,
    matches: 110
  },
  {
    id: "job-4",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Graphic Designer',
    employer: 'Creative Minds Studio',
    description: 'Design marketing materials, brand assets, and digital content for clients. Work closely with cross-functional teams to deliver engaging designs.',
    location: 'Berlin, Germany',
    officeType: 'Hybrid',
    salary: '€40,000 - €50,000',
    type: 'Full-Time',
    qualifications: 'Degree in Design or related field. Strong portfolio in Adobe Creative Suite.',
    skills: ['Photoshop', 'Illustrator', 'UI/UX', 'Branding', 'Figma'],
    benefits: ['Flexible hours', 'Creative environment', 'Team retreats'],
    industry: 'Design',
    postDate: new Date('2025-08-12T11:00:00Z'),
    applicants: [5],
    status: 'active',
    views: 150,
    matches: 90
  },
  {
    id: "job-5",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'HR Manager',
    employer: 'People First HR',
    description: 'Oversee recruitment, employee relations, and organizational development. Support leadership in creating a positive and inclusive workplace culture.',
    location: 'Toronto, Canada',
    officeType: 'On-site',
    salary: 'CAD 70,000 - 85,000',
    type: 'Full-Time',
    qualifications: 'Bachelor\'s in HR or related field. 5+ years in HR management.',
    skills: ['Recruitment', 'Employee Relations', 'Performance Management', 'HR Policies'],
    benefits: ['Health insurance', 'Retirement plan', 'Paid leave'],
    industry: 'Human Resources',
    postDate: new Date('2025-08-06T14:00:00Z'),
    applicants: [],
    status: 'active',
    views: 75,
    matches: 40
  },
  {
    id: "job-6",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Data Scientist',
    employer: 'AI Labs',
    description: 'Work on cutting-edge AI and ML projects to analyze datasets and develop predictive models. Deliver insights that shape product strategies and innovations.',
    location: 'San Francisco, USA',
    officeType: 'Hybrid',
    salary: '$95,000 - $120,000',
    type: 'Full-Time',
    qualifications: 'MSc/PhD in Data Science, Statistics, or related field. Proficiency in Python and ML frameworks.',
    skills: ['Python', 'TensorFlow', 'Machine Learning', 'Statistics', 'Data Visualization'],
    benefits: ['Stock options', 'Remote flexibility', 'Health insurance'],
    industry: 'Artificial Intelligence',
    postDate: new Date('2025-08-15T16:00:00Z'),
    applicants: [2, 6],
    status: 'active',
    views: 300,
    matches: 150
  },
  {
    id: "job-7",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Content Writer',
    employer: 'StoryHub Media',
    description: 'Write and edit articles, blogs, and marketing content. Collaborate with SEO specialists and designers to create engaging, reader-friendly materials.',
    location: 'Cape Town, South Africa',
    officeType: 'Remote',
    salary: 'ZAR 25,000 - 35,000',
    type: 'Contract',
    qualifications: 'Degree in English, Journalism, or related field. Excellent writing and editing skills.',
    skills: ['Writing', 'Editing', 'SEO', 'Content Strategy', 'Research'],
    benefits: ['Remote work', 'Flexible hours'],
    industry: 'Media',
    postDate: new Date('2025-08-03T08:00:00Z'),
    applicants: [7],
    status: 'active',
    views: 180,
    matches: 70
  },
  {
    id: "job-8",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Customer Support Specialist',
    employer: 'ServiceNow Ltd.',
    description: 'Handle customer queries via chat, email, and phone. Provide excellent service and escalate issues where necessary to ensure customer satisfaction.',
    location: 'Mumbai, India',
    officeType: 'On-site',
    salary: 'INR 400,000 - 500,000',
    type: 'Full-Time',
    qualifications: 'Strong communication skills. Experience in customer service is a plus.',
    skills: ['Customer Service', 'Communication', 'Problem-Solving', 'CRM Systems'],
    benefits: ['Health insurance', 'Performance bonus'],
    industry: 'Customer Service',
    postDate: new Date('2025-08-04T09:30:00Z'),
    applicants: [],
    status: 'active',
    views: 60,
    matches: 20
  },
  {
    id: "job-9",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Project Manager',
    employer: 'Global Build Corp',
    description: 'Lead cross-functional project teams to deliver projects on time and within budget. Oversee project planning, resource allocation, and reporting.',
    location: 'Dubai, UAE',
    officeType: 'Hybrid',
    salary: 'AED 25,000 - 30,000',
    type: 'Full-Time',
    qualifications: 'PMP certification preferred. 5+ years of project management experience.',
    skills: ['Project Planning', 'Agile', 'Leadership', 'Risk Management'],
    benefits: ['Housing allowance', 'Travel benefits', 'Health coverage'],
    industry: 'Construction',
    postDate: new Date('2025-08-01T15:00:00Z'),
    applicants: [8, 9],
    status: 'active',
    views: 140,
    matches: 75
  },
  {
    id: "job-10",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Sales Executive',
    employer: 'MarketReach Ltd.',
    description: 'Identify new business opportunities, manage client accounts, and meet sales targets. Build strong customer relationships and close deals.',
    location: 'Lagos, Nigeria',
    officeType: 'On-site',
    salary: '₦250,000 - 300,000',
    type: 'Full-Time',
    qualifications: 'Bachelor’s degree in Business or related field. 2+ years in sales roles.',
    skills: ['Sales', 'Negotiation', 'Customer Relationship', 'Communication'],
    benefits: ['Commission structure', 'Travel allowance'],
    industry: 'Sales',
    postDate: new Date('2025-08-14T17:00:00Z'),
    applicants: [10],
    status: 'active',
    views: 85,
    matches: 40
  },
  {
    id: "job-11",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'UI/UX Designer',
    employer: 'PixelCraft Studios',
    description: 'Design user interfaces and experiences for web and mobile apps. Work with developers to ensure designs are implemented effectively.',
    location: 'Amsterdam, Netherlands',
    officeType: 'Hybrid',
    salary: '€55,000 - 65,000',
    type: 'Full-Time',
    qualifications: 'Portfolio demonstrating UI/UX design work. Skilled in Figma and Sketch.',
    skills: ['UI/UX', 'Figma', 'Wireframing', 'Prototyping'],
    benefits: ['Flexible hours', 'Remote option'],
    industry: 'Design',
    postDate: new Date('2025-08-02T12:30:00Z'),
    applicants: [],
    status: 'active',
    views: 95,
    matches: 50
  },
  {
    id: "job-12",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Cybersecurity Analyst',
    employer: 'SecureTech Ltd.',
    description: 'Monitor and secure company systems against cyber threats. Conduct vulnerability assessments and recommend security enhancements.',
    location: 'Washington D.C., USA',
    officeType: 'On-site',
    salary: '$80,000 - 95,000',
    type: 'Full-Time',
    qualifications: 'Degree in Cybersecurity or related field. Knowledge of firewalls and SIEM tools.',
    skills: ['Cybersecurity', 'Network Security', 'Risk Assessment', 'SIEM'],
    benefits: ['401k plan', 'Health coverage'],
    industry: 'Security',
    postDate: new Date('2025-08-07T13:15:00Z'),
    applicants: [11],
    status: 'active',
    views: 170,
    matches: 88
  },
  {
    id: "job-13",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Financial Analyst',
    employer: 'CapitalEdge Advisors',
    description: 'Analyze financial data, prepare reports, and forecast company performance. Support decision-making with insights and recommendations.',
    location: 'Nairobi, Kenya',
    officeType: 'Hybrid',
    salary: 'KES 120,000 - 150,000',
    type: 'Full-Time',
    qualifications: 'Degree in Finance or Accounting. Proficiency in Excel and financial modeling.',
    skills: ['Financial Analysis', 'Budgeting', 'Forecasting', 'Excel'],
    benefits: ['Medical cover', 'Annual bonus'],
    industry: 'Finance',
    postDate: new Date('2025-08-09T11:45:00Z'),
    applicants: [12],
    status: 'active',
    views: 60,
    matches: 30
  },
  {
    id: "job-14",
    employerId: "68a21c5d52b4b2a5451368b1",
    title: 'Operations Manager',
    employer: 'SupplyChain Global',
    description: 'Oversee daily operations and ensure efficient supply chain management. Optimize workflows and lead operational improvement initiatives.',
    location: 'Singapore',
    officeType: 'On-site',
    salary: 'SGD 80,000 - 100,000',
    type: 'Full-Time',
    qualifications: 'Degree in Operations Management or similar. Experience in logistics preferred.',
    skills: ['Operations', 'Supply Chain', 'Leadership', 'Optimization'],
    benefits: ['Travel allowance', 'Health benefits'],
    industry: 'Logistics',
    postDate: new Date('2025-08-11T18:00:00Z'),
    applicants: [13, 14],
    status: 'active',
    views: 145,
    matches: 85
  }
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
    email: "jane.doe@example.com",
    phone: "+254 712 345 678",
    location: "Nairobi, Kenya"
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
    email: "john.smith@example.com",
    phone: "+254 723 456 789",
    location: "Mombasa, Kenya"
  },
];

// --- COMPONENTS ---
const DeleteConfirmationModal = ({ onConfirm, onCancel, title, message }) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const ApplicantsModal = ({ job, applicants, allStudents, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  const jobApplicants = applicants.map(applicantId =>
    allStudents.find(student => student.id === applicantId)
  ).filter(Boolean);

  const filteredApplicants = jobApplicants.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!job) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-white rounded-2xl p-6 max-w-6xl w-full mx-auto my-8 shadow-2xl max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>
        
        {!selectedApplicant ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Applicants for "{job.title}"</h2>
                <p className="text-gray-600">{filteredApplicants.length} applicants found</p>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {filteredApplicants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2">
                {filteredApplicants.map(student => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedApplicant(student)}
                    className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-lg group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img src={student.imageUrl} alt={student.name} className="w-16 h-16 rounded-full border-2 border-white shadow-md group-hover:border-blue-200 transition-colors" />
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.specialization}</p>
                        <p className="text-xs text-gray-400">{student.university}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {student.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Student' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {student.status}
                      </span>
                      <span className="text-sm text-gray-500">GPA: {student.gpa}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No applicants found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Applicant Profile</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
              {/* Profile Sidebar */}
              <div className="lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="text-center">
                  <img src={selectedApplicant.imageUrl} alt={selectedApplicant.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">{selectedApplicant.name}</h3>
                  <p className="text-blue-600 font-medium">{selectedApplicant.specialization}</p>
                  <p className="text-sm text-gray-500 mt-1">{selectedApplicant.university}</p>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedApplicant.status === 'Student' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {selectedApplicant.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">GPA</span>
                      <span className="text-sm font-medium text-gray-900">{selectedApplicant.gpa}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a href={selectedApplicant.resumeUrl} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download size={16} /> Resume
                    </a>
                    <a href={`mailto:${selectedApplicant.email}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <Mail size={16} /> Contact
                    </a>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">About</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedApplicant.bio}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Skills & Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplicant.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">{selectedApplicant.email}</p>
                      <p className="text-gray-600">{selectedApplicant.phone}</p>
                      <p className="text-gray-600">{selectedApplicant.location}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Education</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-900 font-medium">{selectedApplicant.university}</p>
                      <p className="text-gray-600">{selectedApplicant.specialization}</p>
                    </div>
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
    skills: "",
    benefits: "",
    industry: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const jobsPerPage = 6;

  useEffect(() => {
    if (editingJob) {
      setNewJob({
        ...editingJob,
        skills: editingJob.skills.join(', '),
        benefits: editingJob.benefits.join(', '),
      });
      setShowForm(true);
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
        postDate: new Date(),
        applicants: [],
        status: 'active',
        views: 0,
        matches: 0
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

  // Filter and search logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.employer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'closed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <>
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Briefcase className="w-8 h-8 text-blue-600" />
                Job Board
              </h1>
              <p className="text-gray-600 mt-1">Manage your job postings and applicants</p>
            </div>
            
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingJob(null);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {showForm ? <XCircle size={20} /> : <Plus size={20} />}
              {showForm ? 'Close Form' : 'Post New Job'}
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {showForm && (
          <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={newJob.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <input
                    type="text"
                    name="employer"
                    value={newJob.employer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={newJob.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="e.g., Remote, Nairobi, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary *</label>
                  <input
                    type="text"
                    name="salary"
                    value={newJob.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="e.g., $80,000 - $100,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Type</label>
                  <select
                    name="officeType"
                    value={newJob.officeType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                  <select
                    name="type"
                    value={newJob.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <input
                    type="text"
                    name="industry"
                    value={newJob.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="e.g., Technology, Healthcare, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={newJob.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications *</label>
                  <textarea
                    name="qualifications"
                    value={newJob.qualifications}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="List the required qualifications, education, and experience..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated) *</label>
                  <input
                    type="text"
                    name="skills"
                    value={newJob.skills}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="e.g., React, Node.js, Python, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (comma-separated)</label>
                  <input
                    type="text"
                    name="benefits"
                    value={newJob.benefits}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Health insurance, Remote work, etc."
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingJob ? 'Update Job' : 'Post Job'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingJob(null);
                  }}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.filter(j => j.status === 'active').length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">{jobs.reduce((acc, job) => acc + job.applicants.length, 0)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Match Rate</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {currentJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentJobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <p className="text-gray-600 flex items-center gap-1 mt-1">
                        <Building className="w-4 h-4" /> {job.employer}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" /> {job.salary}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" /> {job.type}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Posted {new Date(job.postDate).toLocaleDateString()}</span>
                    <div className="flex items-center gap-4">
                      <span>{job.views} views</span>
                      <span>{job.matches}% match</span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => handleViewApplicants(job)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    {job.applicants.length} applicants
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditJob(job)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(job.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search or create a new job posting</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          title="Delete Job Posting"
          message="Are you sure you want to delete this job posting? This action cannot be undone."
        />
      )}
    </>
  );
};

const JobBoard = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);

  const handleSaveJob = (jobData, jobId = null) => {
    if (jobId) {
      // Update existing job
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...jobData, id: jobId } : job
      ));
    } else {
      // Create new job
      const newJob = {
        ...jobData,
        id: `job-${Date.now()}`,
        employerId: "68a21c5d52b4b2a5451368b1"
      };
      setJobs(prev => [newJob, ...prev]);
    }
  };

  const handleDeleteJob = (jobId) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const handleViewApplicants = (job) => {
    setSelectedJob(job);
    setShowApplicantsModal(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <JobPostings
        jobs={jobs}
        handleSaveJob={handleSaveJob}
        handleDeleteJob={handleDeleteJob}
        handleViewApplicants={handleViewApplicants}
        handleEditJob={handleEditJob}
        editingJob={editingJob}
        setEditingJob={setEditingJob}
      />
      
      {showApplicantsModal && (
        <ApplicantsModal
          job={selectedJob}
          applicants={selectedJob?.applicants || []}
          allStudents={mockStudents}
          onClose={() => setShowApplicantsModal(false)}
        />
      )}
    </div>
  );
};

export default JobBoard;