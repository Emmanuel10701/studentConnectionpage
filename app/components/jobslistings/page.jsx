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
import { useSession } from 'next-auth/react';

// --- COMPONENTS ---

// NEW COMPONENT FOR JOB DETAILS
// Add this line inside the JobPostings component
const JobDetailsModal = ({ job, onClose }) => {
  if (!job) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-white rounded-2xl p-6 max-w-4xl w-full mx-auto my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h2>
            <p className="text-xl text-blue-600 font-semibold">{job.company?.name || 'Company'}</p>
          </div>

          {/* Job Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-5 h-5 text-gray-500" />
              <span>{job.salaryRange}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>{job.type} ({job.officeType})</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span>Posted {new Date(job.createdAt || job.postDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Job Description</h3>
              <p className="text-gray-700 leading-relaxed">{job.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Qualifications</h3>
              <p className="text-gray-700 leading-relaxed">{job.qualifications}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skills & Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(job.skills) && job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {job.benefits && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Benefits</h3>
                <p className="text-gray-700 leading-relaxed">{job.benefits}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

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
  setEditingJob,
  setSelectedviewJob, // Add this prop
  loading
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    officeType: "Onsite",
    salaryRange: "",
    type: "Full-time",
    qualifications: "",
    skills: "",
    benefits: "",
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
        title: editingJob.title || "",
        description: editingJob.description || "",
        location: editingJob.location || "",
        officeType: editingJob.officeType || "Onsite",
        salaryRange: editingJob.salaryRange || "",
        type: editingJob.type || "Full-time",
        qualifications: editingJob.qualifications || "",
        skills: Array.isArray(editingJob.skills) ? editingJob.skills.join(', ') : editingJob.skills || "",
        benefits: editingJob.benefits || "",
      });
      setShowForm(true);
    }
  }, [editingJob]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (newJob.title && newJob.description) {
      const jobData = {
        ...newJob,
        skills: newJob.skills.split(',').map(s => s.trim()),
        companyId: editingJob?.companyId || null
      };
      
      await handleSaveJob(jobData, editingJob ? editingJob.id : null);
      setNewJob({
        title: "",
        description: "",
        location: "",
        officeType: "Onsite",
        salaryRange: "",
        type: "Full-time",
        qualifications: "",
        skills: "",
        benefits: "",
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
                         (job.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={newJob.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="e.g., Nairobi, Kenya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range *</label>
                  <input
                    type="text"
                    name="salaryRange"
                    value={newJob.salaryRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="e.g., KSh 150,000 - 220,000"
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
                    <option value="Onsite">On-site</option>
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
                    <option value="Full-time">Full-Time</option>
                    <option value="Part-time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Stats Overview */}
        {!loading && (
          <>
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
                    <p className="text-2xl font-bold text-gray-900">{jobs.reduce((acc, job) => acc + (job.applicants || []).length, 0)}</p>
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
                    <h3
                      onClick={() => setSelectedviewJob(job)}
                      className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {job.title}
                    </h3>
                          <p className="text-gray-600 flex items-center gap-1 mt-1">
                            <Building className="w-4 h-4" /> {job.company?.name || 'Company'}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status || 'active')}`}>
                          {job.status || 'active'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" /> {job.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4" /> {job.salaryRange}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" /> {job.type}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-3">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(job.skills) && job.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {skill}
                          </span>
                        ))}
                        {Array.isArray(job.skills) && job.skills.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                            +{job.skills.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Posted {new Date(job.createdAt || job.postDate).toLocaleDateString()}</span>
                        <div className="flex items-center gap-4">
                          <span>{job.views || 0} views</span>
                          <span>{job.matches || 0}% match</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                      <button
                        onClick={() => handleViewApplicants(job)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        {(job.applicants || []).length} applicants
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
          </>
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
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [companyData, setCompanyData] = useState(null); // ✅ Store fetched company
  const { data: session } = useSession();
  const [selectedviewJob, setSelectedviewJob] = useState(null);


  // Fetch jobs from API
  useEffect(() => {
    fetchCompanyJobs();
  }, [session]);

  const fetchCompanyJobs = async () => {
    try {
      setLoading(true);
      if (!session?.user?.id) return;

      // 1️⃣ Get employee ID
      const employerRes = await fetch(`/api/employerId/user/${session.user.id}`);
      const employerData = await employerRes.json();
      if (!employerData.success) return;
      const employeeId = employerData.employee.id;

      // 2️⃣ Fetch company using employee ID
      const companyRes = await fetch(`/api/company/employee/${employeeId}`);
      const companyJson = await companyRes.json();
      if (!companyJson.success) return;

      setCompanyData(companyJson.company); // ✅ Store company in state
      const companyId = companyJson.company.id;

      // 3️⃣ Fetch jobs for this company
      const jobsRes = await fetch(`/api/companyjobs/${companyId}/jobs`);
      if (jobsRes.ok) {
        const data = await jobsRes.json();
        setJobs(data);
      } else {
        console.error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobData, jobId = null) => {
    try {
      const url = jobId ? `/api/jobs/${jobId}` : '/api/jobs';
      const method = jobId ? 'PUT' : 'POST';

      const formattedJobData = {
        ...jobData,
        skills: Array.isArray(jobData.skills) ? jobData.skills.join(', ') : jobData.skills,
      };

      // ✅ Use company ID from state when creating a new job
      if (!jobId) {
        if (!companyData?.id) {
          console.error("Cannot save job: company not found");
          alert("Cannot save job: company not found.");
          return;
        }
        formattedJobData.companyId = companyData.id;
      }

      console.log("Sending job data:", formattedJobData);

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedJobData),
      });

      if (response.ok) {
        await fetchCompanyJobs(); // Refresh jobs
        alert(jobId ? "Job updated successfully!" : "Job created successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to save job:", errorData.message);
        alert(`Failed to save job: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error saving job: " + error.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
      if (response.ok) {
        setJobs(prev => prev.filter(job => job.id !== jobId));
      } else {
        console.error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
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
        loading={loading}
        setSelectedviewJob={setSelectedviewJob} // Add this prop

      />

      {showApplicantsModal && (
        <ApplicantsModal
          job={selectedJob}
          applicants={selectedJob?.applicants || []}
          allStudents={[]} // fetch real applicants data if needed
          onClose={() => setShowApplicantsModal(false)}
        />
      )}
      {/* At the very end of the return statement, after the `ApplicantsModal` if it's there */}
     {selectedviewJob && <JobDetailsModal job={selectedviewJob} onClose={() => setSelectedviewJob(null)} />}
    </div>
  );
};


export default JobBoard;