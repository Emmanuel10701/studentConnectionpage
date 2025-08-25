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
  HeartHandshake,

  User,
 
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';



// --- FILTER COMPONENTS ---
const EducationLevelFilter = ({ value, onChange }) => {
  const educationLevels = [
    "Certificate",
    "Diploma", 
    "Bachelor's",
    "Master's",
    "PhD"
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <GraduationCap size={16} />
        Education Level
      </h4>
      <div className="space-y-2">
        {educationLevels.map(level => (
          <label key={level} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(level)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...value, level]);
                } else {
                  onChange(value.filter(l => l !== level));
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{level}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const ExperienceFilter = ({ value, onChange }) => {
  const experienceRanges = [
    "Less than 1 year",
    "1-2 years",
    "3-5 years", 
    "5+ years"
  ];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Briefcase size={16} />
        Experience
      </h4>
      <div className="space-y-2">
        {experienceRanges.map(range => (
          <label key={range} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(range)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...value, range]);
                } else {
                  onChange(value.filter(r => r !== range));
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{range}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const StatusFilter = ({ value, onChange }) => {
  const statuses = ["Student", "Alumni"];

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <User size={16} />
        Status
      </h4>
      <div className="space-y-2">
        {statuses.map(status => (
          <label key={status} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(status)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...value, status]);
                } else {
                  onChange(value.filter(s => s !== status));
                }
              }}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{status}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

const FilterSidebar = ({ isOpen, onClose, filters, onFilterChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-l-xl shadow-2xl w-80 h-full max-h-[calc(100vh-4rem)] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Filter size={18} />
            Filters
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <EducationLevelFilter
            value={filters.educationLevel}
            onChange={(value) => onFilterChange('educationLevel', value)}
          />
          
          <ExperienceFilter
            value={filters.experience}
            onChange={(value) => onFilterChange('experience', value)}
          />
          
          <StatusFilter
            value={filters.status}
            onChange={(value) => onFilterChange('status', value)}
          />
          
          <button
            onClick={() => onFilterChange('reset')}
            className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate experience from experience array
const calculateExperienceRange = (experienceArray) => {
  if (!experienceArray || experienceArray.length === 0) {
    return "Less than 1 year";
  }

  // Calculate total months of experience
  let totalMonths = 0;
  
  experienceArray.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.isCurrent ? new Date() : new Date(exp.endDate);
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                  (endDate.getMonth() - startDate.getMonth());
    totalMonths += Math.max(0, months);
  });

  // Convert to years and categorize
  const totalYears = totalMonths / 12;
  
  if (totalYears < 1) return "Less than 1 year";
  if (totalYears <= 2) return "1-2 years";
  if (totalYears <= 5) return "3-5 years";
  return "5+ years";
};
// --- COMPONENTS ---
const ApplicantDetailsModal = ({ applicant, onClose, onEmail }) => {
  if (!applicant) return null;

  const applicantExperience = calculateExperienceRange(applicant.student.experience);

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
          {/* Applicant Header */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{applicant.student.name}</h2>
              <p className="text-gray-600">{applicant.student.email}</p>
              
              {/* Education, Experience, and Status Badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {applicant.student.educationLevel && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                    <GraduationCap size={14} className="inline mr-1" />
                    {applicant.student.educationLevel}
                  </span>
                )}
                {applicantExperience && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    <Briefcase size={14} className="inline mr-1" />
                    {applicantExperience}
                  </span>
                )}
                {applicant.student.studentStatus && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    <User size={14} className="inline mr-1" />
                    {applicant.student.studentStatus}
                  </span>
                )}
              </div>
              
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="font-bold">Address:</span>
                <span className="italic text-gray-700">
                  {`, ${applicant.student.address.ward}, ${applicant.student.address.subCounty}, ${applicant.student.address.county}`}
                </span>
              </span>
            </div>
            <button
              onClick={() => onEmail(applicant.student.email)}
              className="ml-auto p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Mail size={20} />
            </button>
          </div>

          {/* Cover Letter */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Cover Letter</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">{applicant.coverLetter}</p>
            </div>
          </div>

          {/* Student Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Summary:</span> {applicant.student.summary || 'Not provided'}</p>
                <p><span className="font-medium">Education Level:</span> {applicant.student.educationLevel || 'Not specified'}</p>
                <p><span className="font-medium">Status:</span> {applicant.student.studentStatus || 'Not specified'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {applicant.student.skills && applicant.student.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience Section */}
          {applicant.student.experience && applicant.student.experience.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Work Experience</h3>
              <div className="space-y-3">
                {applicant.student.experience.map((exp, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900">{exp.title} at {exp.company}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {applicant.student.education && applicant.student.education.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
              <div className="space-y-3">
                {applicant.student.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h4>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-600">Graduated: {edu.graduationYear}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resume */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Resume</h3>
            <a 
              href={`http://localhost:3000${applicant.student.resumePath}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Paperclip size={16} />
              View Resume
            </a>
          </div>

          {/* Application Date */}
          <div className="text-sm text-gray-500">
            Applied on {new Date(applicant.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


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

const ApplicantsModal = ({ job, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    educationLevel: [],
    experience: [],
    status: []
  });

  // Filter applicants based on search term and filters
  const filteredApplicants = job.applicants.filter(applicant => {
    // Search filter
    const matchesSearch = 
      applicant.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Education level filter - using educationLevel from student profile
    const matchesEducation = filters.educationLevel.length === 0 || 
      (applicant.student.educationLevel && 
       filters.educationLevel.includes(applicant.student.educationLevel));
    
    // Experience filter - calculate from experience array
    const applicantExperience = calculateExperienceRange(applicant.student.experience);
    const matchesExperience = filters.experience.length === 0 || 
      filters.experience.includes(applicantExperience);
    
    // Status filter - using studentStatus from student profile
    const matchesStatus = filters.status.length === 0 || 
      (applicant.student.studentStatus && 
       filters.status.includes(applicant.student.studentStatus));
    
    return matchesSearch && matchesEducation && matchesExperience && matchesStatus;
  });

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'reset') {
      setFilters({
        educationLevel: [],
        experience: [],
        status: []
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-white rounded-2xl p-6 max-w-6xl w-full mx-auto my-8 shadow-2xl max-h-[90vh] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-1 right-1 z-10 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} />
        </button>
        
        {!selectedApplicant ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Applicants for "{job.title}"</h2>
                <p className="text-gray-600">
                  {filteredApplicants.length} applicant{filteredApplicants.length !== 1 ? 's' : ''} found
                  {getActiveFilterCount() > 0 && ` (${getActiveFilterCount()} filter${getActiveFilterCount() !== 1 ? 's' : ''} active)`}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
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
                
                <button
                  onClick={() => setShowFilters(true)}
                  className="relative p-2.5 mt-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Filter size={18} />
                  {getActiveFilterCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Applicant Cards */}
            {filteredApplicants.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 overflow-y-auto pr-2">
                {filteredApplicants.map(applicant => {
                  const applicantExperience = calculateExperienceRange(applicant.student.experience);
                  
                  return (
                    <div
                      key={applicant.id}
                      onClick={() => setSelectedApplicant(applicant)}
                      className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {applicant.student.name}
                          </h3>
                          <p className="text-sm text-gray-600">{applicant.student.email}</p>
                          
                          {/* Display education, experience, and status badges */}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {applicant.student.educationLevel && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                {applicant.student.educationLevel}
                              </span>
                            )}
                            {applicantExperience && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                {applicantExperience}
                              </span>
                            )}
                            {applicant.student.studentStatus && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                {applicant.student.studentStatus}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-400 mt-1">
                            Applied {new Date(applicant.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Applied
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-4">
                        <p className="line-clamp-2">{applicant.coverLetter}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {applicant.student.skills && applicant.student.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEmail(applicant.student.email);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                        >
                          <Mail size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {getActiveFilterCount() > 0 || searchTerm 
                    ? "No applicants match your filters. Try adjusting your search criteria." 
                    : "No applicants found"}
                </p>
                {(getActiveFilterCount() > 0 || searchTerm) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        educationLevel: [],
                        experience: [],
                        status: []
                      });
                    }}
                    className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-700"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <ApplicantDetailsModal 
            applicant={selectedApplicant} 
            onClose={() => setSelectedApplicant(null)}
            onEmail={handleEmail}
          />
        )}
        
        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
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
      <div className="sticky top-0  bg-white/90 backdrop-blur-md border-b border-gray-200 p-6">
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

         // 4️⃣ For each job, fetch its applicants
      const jobsWithApplicants = await Promise.all(
        data.map(async (job) => {
          try {
            const applicantsRes = await fetch(`/api/getapplicants/${job.id}`);
            if (applicantsRes.ok) {
              const applicantsData = await applicantsRes.json();
              return { ...job, applicants: applicantsData };
            }
          } catch (error) {
            console.error(`Error fetching applicants for job ${job.id}:`, error);
          }
          return { ...job, applicants: [] };
        })
      );
      
      setJobs(jobsWithApplicants);
      
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
      const savedJob = await response.json();
      
      // If it's a NEW job posting (not an edit), send email notifications to students
      if (!jobId) {
        // Run this in the background without blocking the UI
        sendJobNotificationEmails(savedJob).catch(error => {
          console.error('Email notification error:', error);
          // Don't show error to user since this is a background task
        });
      }
      
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

// NEW FUNCTION: Send email notifications to students
// NEW FUNCTION: Send email notifications to students in the required format
const sendJobNotificationEmails = async (newJob) => {
  try {
    console.log('Starting email notification process for new job:', newJob.id);
    
    // 1. Fetch all students
    const studentsResponse = await fetch('/api/student');
    
    if (!studentsResponse.ok) {
      throw new Error('Failed to fetch students');
    }
    
    const studentsData = await studentsResponse.json();
    const students = studentsData.students || studentsData || [];
    
    if (students.length === 0) {
      console.log('No students found to notify');
      return;
    }
    
    // 2. Format the data exactly as required
    const notificationData = {
      newJob: {
        id: newJob.id,
        title: newJob.title,
        companyName: companyData?.name || 'Not Available',
        location: newJob.location,
        jobType: newJob.type,
        salaryRange: newJob.salaryRange
      },
      students: students.map(student => ({
        name: student.name,
        email: student.email,
        educationLevel: student.educationLevel || 'Not specified',
        experienceRange: student.experience || 'Not specified',
        skills: student.skills || []
      }))
    };
    
    console.log('Sending notification data:', notificationData);
    
    // 3. Send the formatted data to the notification endpoint
    const emailResponse = await fetch('/api/notifyjobseekers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notificationData),
    });
    
    if (emailResponse.ok) {
      console.log(`Successfully sent job notifications to ${students.length} students`);
    } else {
      const errorData = await emailResponse.json();
      throw new Error(errorData.message || 'Failed to send email notifications');
    }
    
  } catch (error) {
    console.error('Error in sending job notifications:', error);
    // Don't re-throw - this is a background task
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