import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Search, Mail, ArrowLeft, X, User, CheckCircle } from 'lucide-react';

// Main App component that manages the state and page views
export default function App() {
  // State for managing which page is currently displayed
  const [currentPage, setCurrentPage] = useState('profile');
  // State to hold the job object when a job is selected
  const [selectedJob, setSelectedJob] = useState(null);
  // State for the student's profile information
  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.edu',
    institution: 'University of Nairobi',
  });
  // State for the "uploaded" resume file
  const [resumeFile, setResumeFile] = useState(null);

  // Function to handle navigating to the job details page
  const handleApply = (job) => {
    setSelectedJob(job);
    setCurrentPage('job-details');
  };

  // Function to handle a completed application and navigate back to job postings
  const handleJobApplied = () => {
    // You could also navigate back to a success page here
    setCurrentPage('job-postings');
  };

  // Function to handle uploading a resume file
  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  // Render the appropriate component based on the current page state
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans antialiased text-gray-800 flex justify-center items-start">
      <div className="w-full max-w-4xl">
        {currentPage === 'profile' && (
          <MyProfile
            profile={profile}
            resumeFile={resumeFile}
            onStartJobSearch={() => setCurrentPage('job-postings')}
            onResumeUpload={handleResumeUpload}
          />
        )}
        {currentPage === 'job-postings' && (
          <JobPostings
            onGoBack={() => setCurrentPage('profile')}
            onApply={handleApply}
          />
        )}
        {currentPage === 'job-details' && (
          <JobDetails
            job={selectedJob}
            profile={profile}
            resumeFile={resumeFile}
            onGoBack={() => setCurrentPage('job-postings')}
            onJobApplied={handleJobApplied}
          />
        )}
      </div>
    </div>
  );
}

// Simple BackButton component for navigation
const BackButton = ({ onClick }) => (
  <button 
    onClick={onClick} 
    className="mb-4 flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
  >
    <ArrowLeft size={20} /> Back
  </button>
);

// Simple MessageBox component to display feedback
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

// Component for the student's profile and resume upload
const MyProfile = ({ profile, resumeFile, onStartJobSearch, onResumeUpload }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <h3 className="flex items-center text-xl md:text-2xl font-bold text-gray-900 mb-6">
        <User className="mr-3 text-purple-600" /> My Profile
      </h3>
      <div className="space-y-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-sm">Name</p>
          <p className="font-semibold">{profile.name}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-sm">Email</p>
          <p className="font-semibold">{profile.email}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-sm">Institution</p>
          <p className="font-semibold">{profile.institution}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-sm">Resume</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-sm md:text-base">
              {resumeFile ? resumeFile.name : 'No resume uploaded'}
            </span>
            <label className="cursor-pointer bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-purple-700 transition-colors">
              {resumeFile ? 'Change Resume' : 'Upload Resume'}
              <input type="file" onChange={onResumeUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>
      <button 
        onClick={onStartJobSearch}
        className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        Start Job Search <Search size={20} />
      </button>
    </div>
  );
};

// The JobPostings component with added pagination and sorting
const JobPostings = ({ onGoBack, onApply }) => {
    // Mock data for job postings with added postDate for sorting
    const mockJobs = [
      { id: 1, title: 'Software Engineer Intern', employer: 'Tech Innovations Inc.', location: 'Nairobi, Kenya', industry: 'Technology', description: 'Assist in developing and maintaining web applications using modern frameworks.', postDate: new Date('2025-08-15') },
      { id: 2, title: 'Junior Financial Analyst', employer: 'Global Finance Group', location: 'London, UK', industry: 'Finance', description: 'Analyze financial data, prepare reports, and assist in client portfolio management.', postDate: new Date('2025-08-14') },
      { id: 3, title: 'Marketing Assistant', employer: 'Creative Marketing Solutions', location: 'New York, USA', industry: 'Marketing', description: 'Support marketing campaigns, manage social media accounts, and create content.', postDate: new Date('2025-08-13') },
      { id: 4, title: 'Environmental Research Associate', employer: 'Eco-Solutions Africa', location: 'Cape Town, South Africa', industry: 'Environmental', description: 'Conduct research on sustainable practices and assist in field work.', postDate: new Date('2025-08-12') },
      { id: 5, title: 'Data Scientist Intern', employer: 'Innovate Med', location: 'Boston, USA', industry: 'Healthcare', description: 'Work with a team to analyze patient data and develop predictive models.', postDate: new Date('2025-08-11') },
      { id: 6, title: 'Full Stack Developer', employer: 'FutureTech Solutions', location: 'San Francisco, USA', industry: 'Technology', description: 'Develop robust, scalable web applications from front to back-end.', postDate: new Date('2025-08-10') },
      { id: 7, title: 'Renewable Energy Technician', employer: 'Green Energy Co.', location: 'Nairobi, Kenya', industry: 'Environmental', description: 'Install and maintain solar power systems for commercial clients.', postDate: new Date('2025-08-09') },
      { id: 8, title: 'Business Analyst', employer: 'Data Insights Ltd.', location: 'London, UK', industry: 'Technology', description: 'Provide insights and recommendations based on market and company data.', postDate: new Date('2025-08-08') },
      { id: 9, title: 'Portfolio Management Intern', employer: 'Capital Investments', location: 'New York, USA', industry: 'Finance', description: 'Support the investment team with market research and portfolio analysis.', postDate: new Date('2025-08-07') },
    ];
    // Get unique industries and locations from the mock data for the filters
    const uniqueIndustries = [...new Set(mockJobs.map(job => job.industry))];
    const uniqueLocations = [...new Set(mockJobs.map(job => job.location))];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 4; // Display 4 jobs per page

    // Filter and sort the jobs based on the current search and filter criteria
    const filteredAndSortedJobs = useMemo(() => {
        // First, filter the jobs
        const filtered = mockJobs.filter(job => {
            const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.employer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesIndustry = selectedIndustry === '' || job.industry === selectedIndustry;
            const matchesLocation = selectedLocation === '' || job.location === selectedLocation;
            return matchesSearchTerm && matchesIndustry && matchesLocation;
        });

        // Then, sort the filtered jobs by postDate from latest to oldest
        return filtered.sort((a, b) => b.postDate - a.postDate);
    }, [searchTerm, selectedIndustry, selectedLocation]);

    // Calculate the jobs to display on the current page
    const totalPages = Math.ceil(filteredAndSortedJobs.length / jobsPerPage);
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredAndSortedJobs.slice(indexOfFirstJob, indexOfLastJob);

    // Function to clear all filter selections
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedIndustry('');
        setSelectedLocation('');
        setCurrentPage(1); // Reset to the first page when filters are cleared
    };

    // Render page numbers for pagination
    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                        currentPage === i ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {i}
                </button>
            );
        }
        return pageNumbers;
    };

    return (
        <div>
            <BackButton onClick={onGoBack} />
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="flex items-center text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    <Briefcase className="mr-3 text-purple-600" /> Job Postings
                </h3>
                
                <div className="mb-6 space-y-4">
                    <div className="flex items-center border border-gray-300 rounded-xl p-2 focus-within:ring-2 focus-within:ring-purple-500 transition-shadow">
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
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
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
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            >
                                <option value="">All Locations</option>
                                {uniqueLocations.map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>
                        <button 
                            onClick={handleClearFilters}
                            className="w-full md:w-auto px-6 py-3 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isLoading && <p className="col-span-full text-center py-8">Loading jobs...</p>}
                    {error && <p className="text-red-500 col-span-full text-center py-8">Error: {error}</p>}
                    {!isLoading && !error && (
                        <AnimatePresence>
                            {currentJobs.length > 0 ? (
                                currentJobs.map(job => (
                                    <motion.div 
                                        key={job.id} 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => onApply(job)}
                                    >
                                        <h4 className="font-semibold text-lg text-gray-900">{job.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">Employer: {job.employer}</p>
                                        <p className="text-sm text-gray-600">Location: {job.location}</p>
                                        <p className="text-xs text-blue-500 mt-2">Click to Apply</p>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-500 col-span-full text-center py-8"
                                >
                                    No jobs found matching your criteria.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {/* Pagination Controls */}
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

// The JobDetails component
const JobDetails = ({ job, profile, resumeFile, onGoBack, onJobApplied }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [message, setMessage] = useState(null);

    const handleApply = async () => {
        if (!resumeFile) {
            setMessage({ type: 'error', text: 'Please upload your resume in the "My Profile" section before applying.' });
            return;
        }

        setIsApplying(true);
        
        try {
            // Mock API call to simulate sending an application email
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            console.log("Simulating email application send...");
            console.log("To:", job.employer);
            console.log("From:", profile.email);
            console.log("Resume:", resumeFile.name);
            console.log("Student Profile:", profile);
            
            setMessage({ type: 'success', text: `Your application for ${job.title} has been sent! The employer will review it soon.` });
            onJobApplied(); // Navigate back or show success state
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to send application. Please try again.' });
        } finally {
            setIsApplying(false);
        }
    };
    
    const handleCloseMessage = () => {
        setMessage(null);
    };

    return (
        <div>
            <BackButton onClick={onGoBack} />
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex items-start mb-6">
                    <Briefcase size={28} className="mr-4 text-blue-600 flex-shrink-0" />
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-lg text-gray-700">{job.employer}</p>
                        <p className="text-md text-gray-500">{job.location} | {job.industry}</p>
                    </div>
                </div>
                
                <p className="text-gray-600 mb-6">{job.description}</p>
                
                <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Application Details</h4>
                    <p className="text-gray-600 mb-4">
                        You are about to submit an application using the following information from your profile and your uploaded resume:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 pl-4">
                        <li>Name: {profile.name}</li>
                        <li>Email: {profile.email}</li>
                        <li>Institution: {profile.institution}</li>
                        <li>Resume: {resumeFile ? resumeFile.name : <span className="text-red-500 font-bold">Not Uploaded! Please upload in My Profile.</span>}</li>
                    </ul>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleApply}
                        disabled={isApplying || !resumeFile}
                        className="bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isApplying ? "Applying..." : "Apply"}
                        <Mail size={20} />
                    </button>
                </div>
                
                <AnimatePresence>
                    {message && <MessageBox message={message.text} type={message.type} onClose={handleCloseMessage} />}
                </AnimatePresence>
            </div>
        </div>
    );
};
