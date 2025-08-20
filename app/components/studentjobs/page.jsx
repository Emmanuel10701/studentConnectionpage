'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Search, Mail, X, CheckCircle, ArrowLeft, Code, DollarSign, Megaphone, Leaf, HeartPulse, ListChecks, Calendar, Building2, MapPin, NotebookPen, CircleDollarSign, Fingerprint, LucideBriefcase, User, Users, ClipboardList, CheckSquare } from 'lucide-react';

// Utility function to format the time since a job was posted
const formatTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  return 'just now';
};

// Map to select the correct icon for each job industry
const IndustryIconMap = {
  'Technology': Code,
  'Finance': DollarSign,
  'Marketing': Megaphone,
  'Environmental': Leaf,
  'Healthcare': HeartPulse
};

// Reusable Back Button component
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
  >
    <ArrowLeft size={20} />
    Back
  </button>
);

// Reusable Message Box component for notifications
const MessageBox = ({ message, type, onClose }) => {
  const color = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  const icon = type === 'success' ? (
    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
  ) : (
    <X size={20} className="text-red-500 flex-shrink-0" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed inset-x-4 top-4 md:inset-x-auto md:w-96 ${color} p-4 rounded-xl shadow-lg flex items-start gap-3 z-50`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <p className="flex-1">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// Component to display the list of applied jobs
const AppliedJobs = ({ appliedJobs }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {appliedJobs.length > 0 ? (
        appliedJobs.map(job => {
          const IconComponent = IndustryIconMap[job.industry] || Briefcase;
          return (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-50 p-6 rounded-3xl border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <IconComponent size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.employer}</p>
                </div>
              </div>
              <p className="text-xs text-green-500 mt-4 font-semibold flex items-center gap-1">
                <CheckCircle size={16} />
                Applied
              </p>
            </motion.div>
          );
        })
      ) : (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 col-span-full text-center py-8">
          You haven't applied for any jobs yet.
        </motion.p>
      )}
    </motion.div>
  );
};

// Component that displays the main job board with search and filters
const JobPostings = ({ onApply, activeTab, setActiveTab, appliedJobIds, jobs, isLoading, error }) => {
  const uniqueIndustries = useMemo(() => [...new Set(jobs.map(job => job.industry))], [jobs]);
  const uniqueLocations = useMemo(() => [...new Set(jobs.map(job => job.location))], [jobs]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const filteredAndSortedJobs = useMemo(() => {
    const jobsToDisplay = activeTab === 'jobs' ? jobs.filter(job => !appliedJobIds.includes(job.id)) : jobs.filter(job => appliedJobIds.includes(job.id));
    const filtered = jobsToDisplay.filter(job => {
      const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.employer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = selectedIndustry === '' || job.industry === selectedIndustry;
      const matchesLocation = selectedLocation === '' || job.location === selectedLocation;
      return matchesSearchTerm && matchesIndustry && matchesLocation;
    });
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return b.postDate.getTime() - a.postDate.getTime();
      } else {
        return a.postDate.getTime() - b.postDate.getTime();
      }
    });
    return sorted;
  }, [searchTerm, selectedIndustry, selectedLocation, activeTab, appliedJobIds, jobs, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredAndSortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('');
    setSelectedLocation('');
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            currentPage === i ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const renderJobs = () => {
    if (isLoading) {
      return <p className="text-center py-8 text-gray-500">Loading jobs...</p>;
    }
    if (error) {
      return <p className="text-center py-8 text-red-500">Error: {error}</p>;
    }
    if (activeTab === 'jobs') {
      return (
        <>
          {currentJobs.length > 0 ? (
            currentJobs.map(job => {
              const IconComponent = IndustryIconMap[job.industry] || Briefcase;
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-gray-50 p-6 rounded-3xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => onApply(job)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                        <IconComponent size={24} />
                      </div>
                      <h4 className="font-bold text-lg text-gray-900">{job.title}</h4>
                    </div>
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      {formatTimeAgo(job.postDate)}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Employer: {job.employer}</p>
                  <p className="text-sm text-gray-600">Location: {job.location}</p>
                  <p className="text-xs text-blue-500 mt-4 font-semibold">
                    {isApplied ? (
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <CheckCircle size={14} /> Applied
                      </span>
                    ) : (
                      'Click for details & Apply'
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 col-span-full text-center py-8">
              No new jobs found matching your criteria.
            </motion.p>
          )}
        </>
      );
    } else {
      const appliedJobs = jobs.filter(job => appliedJobIds.includes(job.id));
      return <AppliedJobs appliedJobs={appliedJobs} />;
    }
  };

  return (
    <div>
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-xl md:text-2xl font-bold text-gray-900">
            <Briefcase className="mr-3 text-purple-600" /> Job Board
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-4 rounded-full font-semibold transition-colors ${activeTab === 'jobs' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Jobs
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`py-2 px-4 rounded-full font-semibold transition-colors ${activeTab === 'applied' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Applied
            </button>
          </div>
        </div>
        {activeTab === 'jobs' && (
          <div className="mb-6 space-y-4">
            <div className="flex items-center border border-gray-300 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-purple-500 transition-shadow">
              <Search className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by job title or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-2 text-gray-800 bg-transparent focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="industry-filter" className="sr-only">Filter by Industry</label>
                <select
                  id="industry-filter"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                >
                  <option value="">All Industries</option>
                  {uniqueIndustries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="location-filter" className="sr-only">Filter by Location</label>
                <select
                  id="location-filter"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label htmlFor="sort-by-filter" className="sr-only">Sort by Date</label>
                <select
                  id="sort-by-filter"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
              <button
                onClick={handleClearFilters}
                className="w-full md:w-auto px-6 py-3 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderJobs()}
        </div>
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft size={20} className="rotate-180" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Component that displays the detailed view of a single job
const JobDetails = ({ job, profile, onGoBack, onJobApplied }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState(null);
  const [applicantCount, setApplicantCount] = useState(0);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [applicantsLoading, setApplicantsLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantCount = async () => {
      if (!job || !job.id) return;
      setApplicantsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/applied?jobId=${job.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch applicant count');
        }
        const data = await response.json();
        setApplicantCount(data.length);
      } catch (err) {
        console.error('Error fetching applicant count:', err);
        setApplicantCount(0); // Default to 0 on error
      } finally {
        setApplicantsLoading(false);
      }
    };
    fetchApplicantCount();
  }, [job]);

  const handleApplyClick = () => {
    setShowCoverLetterModal(true);
  };

  const handleFinalApplication = async (coverLetter) => {
    setIsApplying(true);
    setShowCoverLetterModal(false);

    try {
      const response = await fetch(`http://localhost:3000/api/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId: job.id,
          applicantName: profile.name,
          email: profile.email,
          coverLetter: coverLetter
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      onJobApplied(job.id);
    } catch (err) {
      setMessage({ type: 'error', text: 'Error submitting application. Please try again.' });
    } finally {
      setIsApplying(false);
    }
  };

  const IconComponent = IndustryIconMap[job.industry] || Briefcase;

  return (
    <motion.div
      key={job.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
    >
      <BackButton onClick={onGoBack} />
      <AnimatePresence>
        {message && (
          <MessageBox
            message={message.text}
            type={message.type}
            onClose={() => setMessage(null)}
          />
        )}
      </AnimatePresence>
      <div className="flex items-center gap-4 mb-4">
        <div className="p-4 bg-purple-100 rounded-xl text-purple-600">
          <IconComponent size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
          <p className="text-sm text-gray-600">{job.employer}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="flex items-center gap-3">
          <MapPin size={20} className="text-gray-500" />
          <p className="text-gray-700">{job.location}</p>
        </div>
        <div className="flex items-center gap-3">
          <Building2 size={20} className="text-gray-500" />
          <p className="text-gray-700">{job.officeType}</p>
        </div>
        <div className="flex items-center gap-3">
          <CircleDollarSign size={20} className="text-gray-500" />
          <p className="text-gray-700">{job.salary}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="flex items-center gap-2 font-medium text-gray-800 mb-2"><NotebookPen size={18} /> Qualifications</h4>
            <p className="text-sm text-gray-600">{job.qualifications}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="flex items-center gap-2 font-medium text-gray-800 mb-2"><ListChecks size={18} /> Skills</h4>
            <p className="text-sm text-gray-600">{Array.isArray(job.skills) ? job.skills.join(', ') : job.skills}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h4 className="flex items-center gap-2 font-medium text-gray-800 mb-2"><HeartPulse size={18} /> Benefits</h4>
            <p className="text-sm text-gray-600">{Array.isArray(job.benefits) ? job.benefits.join(', ') : job.benefits}</p>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 bg-purple-50 rounded-2xl border border-purple-200 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="p-3 rounded-full bg-white text-purple-600 shadow-sm flex-shrink-0">
          <Fingerprint size={24} />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-purple-800">Your Profile</h4>
          <p className="text-purple-700">Name: <span className="font-medium">{profile.name}</span></p>
          <p className="text-purple-700">Institution: <span className="font-medium">{profile.institution}</span></p>
        </div>
        <motion.button
          onClick={handleApplyClick}
          disabled={isApplying}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-auto w-full md:w-auto px-8 py-3 bg-purple-600 text-white rounded-full font-bold shadow-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isApplying ? 'Applying...' : 'Apply Now'}
        </motion.button>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} /> Applicants for this Job
        </h3>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-600">
            Total applicants: {applicantsLoading ? 'Loading...' : applicantCount}
          </p>
        </div>
      </div>

      {showCoverLetterModal && (
        <CoverLetterModal
          profile={profile}
          job={job}
          onClose={() => setShowCoverLetterModal(false)}
          onApply={handleFinalApplication}
        />
      )}
    </motion.div>
  );
};

// Component for the cover letter modal
const CoverLetterModal = ({ profile, job, onClose, onApply }) => {
  const [coverLetter, setCoverLetter] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(coverLetter);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Apply for {job.title}</h3>
        <p className="text-sm text-gray-600 mb-6">Employer: {job.employer}</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Your Information</label>
            <div className="p-4 bg-gray-100 rounded-xl space-y-2">
              <p className="text-gray-800 flex items-center gap-2"><User size={16} /> Name: {profile.name}</p>
              <p className="text-gray-800 flex items-center gap-2"><Mail size={16} /> Email: {profile.email}</p>
              <p className="text-gray-800 flex items-center gap-2"><Building2 size={16} /> Institution: {profile.institution}</p>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="coverLetter" className="block text-gray-700 font-semibold mb-2">Cover Letter</label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="6"
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow text-gray-800"
              placeholder="Write a compelling cover letter here..."
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 text-sm font-semibold rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-md"
            >
              Submit Application
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Main App component which manages the overall application state and routing
export default function App() {
  const [currentPage, setCurrentPage] = useState('job-postings');
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [profile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.edu',
    institution: 'University of Nairobi',
  });

  const [apiJobs, setApiJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/jobs/');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        const formattedJobs = data.map(job => ({
          id: job.id,
          title: job.title,
          employer: job.company?.name || 'N/A',
          description: job.description,
          location: job.location,
          officeType: job.officeType,
          salary: job.salaryRange,
          type: job.type,
          qualifications: job.qualifications,
          skills: job.skills,
          benefits: job.benefits,
          industry: job.company?.industry || 'N/A',
          postDate: new Date(job.createdAt)
        }));
        setApiJobs(formattedJobs);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setCurrentPage('job-details');
  };

  const handleJobApplied = (jobId) => {
    setAppliedJobIds(prevIds => [...prevIds, jobId]);
    setCurrentPage('job-postings');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-8 font-sans antialiased text-gray-800">
      <div className="w-full max-w-7xl mx-auto">
        {currentPage === 'job-postings' && (
          <JobPostings
            onApply={handleApplyClick}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            appliedJobIds={appliedJobIds}
            jobs={apiJobs}
            isLoading={isLoading}
            error={error}
          />
        )}
        {currentPage === 'job-details' && (
          <JobDetails
            job={selectedJob}
            profile={profile}
            onGoBack={() => setCurrentPage('job-postings')}
            onJobApplied={handleJobApplied}
          />
        )}
      </div>
    </div>
  );
}