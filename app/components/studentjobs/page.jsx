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

// Main App component which manages the overall application state and routing
export default function App() {
  // State to manage the current page ('job-postings' or 'job-details')
  const [currentPage, setCurrentPage] = useState('job-postings');
  // State to manage the active tab on the job board ('jobs' or 'applied')
  const [activeTab, setActiveTab] = useState('jobs');
  // State to store the details of the currently selected job
  const [selectedJob, setSelectedJob] = useState(null);
  // State to store the IDs of jobs the user has applied for
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  // Mock user profile data
  const [profile] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.edu',
    institution: 'University of Nairobi',
  });

  // Mock job data using useMemo for performance optimization
  const mockJobs = useMemo(() => [
    { id: 1, employerId: '68a21c5d52b4b2a5451368aa', title: 'Full Stack Developer', employer: 'Tech Innovations Inc.', description: 'We are looking for a talented Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining robust web applications, from server-side logic to client-side UI. This role requires a strong understanding of modern web technologies and a passion for creating seamless user experiences. You will collaborate with cross-functional teams to design, develop, and deploy new features, as well as ensure the performance and scalability of our existing platforms. This is a fast-paced environment where innovation is highly valued, and you\'ll have the opportunity to work on exciting new projects that impact millions of users.', location: 'Nairobi, Kenya', officeType: 'Onsite', salary: '2,000-3,000 USD', type: 'Full-Time', qualifications: 'BSc in Computer Science, or a related field. Proven experience in web development is a must. You should have a strong portfolio showcasing your projects. Experience with Agile/Scrum methodologies is a plus.', skills: ['React', 'Node.js', 'Prisma', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'REST APIs', 'Git'], benefits: 'Comprehensive health insurance, Remote work options, Paid time off, Professional development budget, Annual bonus', industry: 'Technology', postDate: new Date('2025-08-15T10:00:00Z') },
    { id: 2, employerId: '68a21c5d52b4b2a5451368ab', title: 'Junior Financial Analyst', employer: 'Global Finance Group', description: 'Join our team as a Junior Financial Analyst and contribute to our client portfolio management. You will perform in-depth financial data analysis, assist in preparing detailed reports, and support senior analysts in various financial modeling tasks. This role is a great opportunity for a recent graduate to gain hands-on experience in the finance industry. You will be exposed to a wide range of financial instruments and market dynamics, and receive mentorship from seasoned professionals. Strong analytical skills and a meticulous attention to detail are key to success in this position.', location: 'London, UK', officeType: 'Hybrid', salary: '2,500-3,500 GBP', type: 'Full-Time', qualifications: 'Bachelor\'s degree in Finance, Economics, or a quantitative field. Prior internship experience in a financial role is highly preferred. Proficiency in financial software and tools is a plus.', skills: ['Financial Analysis', 'Excel', 'Data Modeling', 'Reporting', 'Market Research', 'SQL'], benefits: 'Competitive salary, Performance-based bonus, Pension plan, Health and dental coverage', industry: 'Finance', postDate: new Date('2025-08-14T15:30:00Z') },
    { id: 3, employerId: '68a21c5d52b4b2a5451368ac', title: 'Marketing Assistant', employer: 'Creative Marketing Solutions', description: 'We are seeking a creative and enthusiastic Marketing Assistant to support our team in developing and executing marketing campaigns. You will play a crucial role in managing our social media presence, creating engaging content, and analyzing campaign performance. This position offers a hands-on learning experience and the chance to contribute to impactful marketing strategies. You should be passionate about brand storytelling and audience engagement. We value fresh ideas and a collaborative spirit, so bring your creativity and willingness to learn!', location: 'New York, USA', officeType: 'Remote', salary: '1,500-2,500 USD', type: 'Internship', qualifications: 'Pursuing or holding a degree in Marketing, Communications, or a related field. Strong writing and communication skills are essential. Experience with social media platforms and content creation tools is a plus.', skills: ['Social Media Management', 'Content Creation', 'SEO', 'Email Marketing', 'Analytics', 'Copywriting'], benefits: 'Flexible work schedule, Remote-first culture, Mentorship program, Networking opportunities', industry: 'Marketing', postDate: new Date('2025-08-13T09:45:00Z') },
    { id: 4, employerId: '68a21c5d52b4b2a5451368ad', title: 'Environmental Research Associate', employer: 'Eco-Solutions Africa', description: 'As an Environmental Research Associate, you will conduct cutting-edge research on sustainable practices and environmental conservation. Your responsibilities will include data collection, analysis, and report writing, as well as assisting with field work. This role is ideal for a dedicated individual who wants to make a real-world impact. You will work on projects focused on renewable energy, waste management, and biodiversity preservation. The ideal candidate has a strong academic background and a deep commitment to environmental stewardship.', location: 'Cape Town, South Africa', officeType: 'Onsite', salary: '1,800-2,800 ZAR', type: 'Full-Time', qualifications: 'Master\'s degree in Environmental Science or a related discipline. Experience with research methods and statistical analysis is required. Must be comfortable with fieldwork.', skills: ['Research', 'Data Analysis', 'Fieldwork', 'Environmental Policy', 'Report Writing'], benefits: 'Field allowance, Health insurance, Opportunities for international conferences, Collaborative work environment', industry: 'Environmental', postDate: new Date('2025-08-12T11:20:00Z') },
    { id: 5, employerId: '68a21c5d52b4b2a5451368ae', title: 'Data Scientist Intern', employer: 'Innovate Med', description: 'Join our team as a Data Scientist Intern and contribute to the future of healthcare. You will work with a team of experts to analyze patient data, develop predictive models, and extract valuable insights to improve patient outcomes. This internship provides a unique opportunity to apply your skills in a high-impact setting. You will be responsible for cleaning and preprocessing data, building and validating machine learning models, and presenting your findings to the team. A solid foundation in statistics, programming, and machine learning concepts is crucial.', location: 'Boston, USA', officeType: 'Hybrid', salary: '25-30 USD/hour', type: 'Internship', qualifications: 'Currently enrolled in a Bachelor\'s or Master\'s program in Data Science, Statistics, Computer Science, or a related field. Experience with Python/R and data science libraries is required.', skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Predictive Modeling', 'Data Visualization'], benefits: 'Flexible hours, Mentorship, Access to cutting-edge technology, Possibility of full-time offer upon completion', industry: 'Healthcare', postDate: new Date('2025-08-11T14:10:00Z') },
    { id: 6, employerId: '68a21c5d52b4b2a5451368af', title: 'Full Stack Developer', employer: 'FutureTech Solutions', description: 'Develop robust, scalable web applications from front to back-end. You will work on a variety of projects, from internal tools to public-facing applications. We are looking for a creative problem-solver who can handle all aspects of the development lifecycle. The ideal candidate is self-motivated and passionate about writing clean, efficient, and well-documented code. You will work in a collaborative environment with other talented engineers, and will be expected to contribute ideas and solutions to complex technical challenges.', location: 'San Francisco, USA', officeType: 'Onsite', salary: '120,000-150,000 USD', type: 'Full-Time', qualifications: 'At least 3 years of professional experience in full-stack development. Strong command of multiple programming languages and frameworks. Experience with cloud platforms like AWS or Azure is highly desirable.', skills: ['React', 'Angular', 'Java', 'Spring Boot', 'SQL', 'CI/CD'], benefits: 'Unlimited paid time off, 401(k) matching, Stock options, Free meals and snacks, On-site gym', industry: 'Technology', postDate: new Date('2025-08-10T16:00:00Z') },
    { id: 7, employerId: '68a21c5d52b4b2a5451368b0', title: 'Renewable Energy Technician', employer: 'Green Energy Co.', description: 'We are looking for a skilled Renewable Energy Technician to install and maintain solar power systems for our commercial and residential clients. This is a hands-on role that requires technical expertise and a strong commitment to safety. You will be responsible for system installation, troubleshooting, and repairs. The job involves working outdoors and at heights, so physical fitness is essential. We provide comprehensive training and all necessary equipment to ensure you can perform your job safely and effectively. Join us and help power the future!', location: 'Nairobi, Kenya', officeType: 'Onsite', salary: '1,200-1,800 USD', type: 'Full-Time', qualifications: 'Technical diploma or certification in electrical systems, solar technology, or a related field. Prior experience in solar installation or a similar trade is required. Must be a valid driver\'s license.', skills: ['Solar Panel Installation', 'Electrical Systems', 'Troubleshooting', 'Safety Protocols', 'Maintenance'], benefits: 'Fieldwork bonuses, All tools provided, Paid training, Health and life insurance', industry: 'Environmental', postDate: new Date('2025-08-09T08:00:00Z') },
    { id: 8, employerId: '68a21c5d52b4b2a5451368b1', title: 'Business Analyst', employer: 'Data Insights Ltd.', description: 'As a Business Analyst, you will be the bridge between our business and technical teams. You will be responsible for gathering and documenting requirements, analyzing data to provide actionable insights, and making recommendations to improve business processes. This role requires a blend of strong communication skills, analytical thinking, and technical knowledge. You will work closely with stakeholders to understand their needs and translate them into clear specifications. We are looking for someone who is a natural problem-solver and can think critically about business challenges.', location: 'London, UK', officeType: 'Hybrid', salary: '45,000-55,000 GBP', type: 'Full-Time', qualifications: 'Bachelor\'s degree in Business, IT, or a related field. At least 2 years of experience as a business analyst. Proficiency in data analysis tools like Tableau or Power BI is a plus.', skills: ['Business Analysis', 'Requirements Gathering', 'Data Analysis', 'SQL', 'Process Mapping'], benefits: 'Generous holiday allowance, Flexible working hours, Professional development support, Company pension scheme', industry: 'Technology', postDate: new Date('2025-08-08T12:00:00Z') },
    { id: 9, employerId: '68a21c5d52b4b2a5451368b2', title: 'Portfolio Management Intern', employer: 'Capital Investments', description: 'This internship is an excellent entry point into the world of investment management. You will support our investment team with market research, financial modeling, and portfolio analysis. You will be exposed to real-world investment decisions and gain a deep understanding of capital markets. This role requires a strong quantitative aptitude and a genuine interest in finance. You will be assigned a mentor who will guide you through various projects and help you build a solid foundation for a career in finance. We are looking for proactive and driven individuals who are eager to learn.', location: 'New York, USA', officeType: 'Onsite', salary: '20 USD/hour', type: 'Internship', qualifications: 'Currently enrolled in a Bachelor\'s or Master\'s program in Finance, Business, or a related field. Strong analytical skills and proficiency in Excel are essential. Must be a self-starter.', skills: ['Financial Modeling', 'Market Research', 'Excel', 'Valuation', 'Financial Statement Analysis'], benefits: 'Mentorship program, Networking events, Subway pass, Flexible schedule', industry: 'Finance', postDate: new Date('2025-08-07T13:30:00Z') },
  ], []);
  
  // Generates mock applicant data for a given job post
  const generateMockApplicants = (count) => {
    const applicantNames = ['John Smith', 'Emily Chen', 'David Garcia', 'Sarah Brown', 'Michael Kim', 'Jessica Lee', 'Chris Evans', 'Olivia Wilson', 'Daniel Johnson', 'Amanda Martinez', 'Brian Adams', 'Lisa Rodriguez', 'Kevin Baker', 'Ashley Green', 'Mark Davis', 'Nicole King', 'Justin Hall', 'Rachel Perez', 'Thomas Moore', 'Hannah Wright'];
    const institutions = ['University of Nairobi', 'Harvard University', 'Stanford University', 'MIT', 'University of Oxford', 'Cambridge University', 'Makerere University', 'University of Cape Town'];
    const applicants = [];
    for (let i = 0; i < count; i++) {
      const name = applicantNames[Math.floor(Math.random() * applicantNames.length)];
      const institution = institutions[Math.floor(Math.random() * institutions.length)];
      applicants.push({
        id: i,
        name,
        institution,
        profileSummary: 'A highly motivated and enthusiastic candidate with a passion for problem-solving.'
      });
    }
    return applicants;
  };

  // Handles the click on a job card to show job details
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setCurrentPage('job-details');
  };

  // Callback function after a job has been successfully applied for
  const handleJobApplied = (jobId) => {
    setAppliedJobIds(prevIds => [...prevIds, jobId]);
    setCurrentPage('job-postings');
  };

  // The main application layout with conditional rendering for different pages
  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 md:p-8 font-sans antialiased text-gray-800">
      <div className="w-full max-w-7xl mx-auto">
        {currentPage === 'job-postings' && (
          <JobPostings
            onApply={handleApplyClick}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            appliedJobIds={appliedJobIds}
            mockJobs={mockJobs}
          />
        )}
        {currentPage === 'job-details' && (
          <JobDetails
            job={selectedJob}
            profile={profile}
            onGoBack={() => setCurrentPage('job-postings')}
            onJobApplied={handleJobApplied}
            generateMockApplicants={generateMockApplicants}
          />
        )}
      </div>
    </div>
  );
}

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

// Map to select the correct icon for each job industry
const IndustryIconMap = {
  'Technology': Code,
  'Finance': DollarSign,
  'Marketing': Megaphone,
  'Environmental': Leaf,
  'Healthcare': HeartPulse
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
const JobPostings = ({ onApply, activeTab, setActiveTab, appliedJobIds, mockJobs }) => {
  const uniqueIndustries = [...new Set(mockJobs.map(job => job.industry))];
  const uniqueLocations = [...new Set(mockJobs.map(job => job.location))];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isLoading] = useState(false);
  const [error] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // Memoized function to filter and sort jobs based on user input
  const filteredAndSortedJobs = useMemo(() => {
    const jobsToDisplay = activeTab === 'jobs' ? mockJobs.filter(job => !appliedJobIds.includes(job.id)) : mockJobs.filter(job => appliedJobIds.includes(job.id));
    const filtered = jobsToDisplay.filter(job => {
      const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.employer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = selectedIndustry === '' || job.industry === selectedIndustry;
      const matchesLocation = selectedLocation === '' || job.location === selectedLocation;
      return matchesSearchTerm && matchesIndustry && matchesLocation;
    });
    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return b.postDate - a.postDate;
      } else {
        return a.postDate - b.postDate;
      }
    });
    return sorted;
  }, [searchTerm, selectedIndustry, selectedLocation, activeTab, appliedJobIds, mockJobs, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredAndSortedJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Function to clear all search and filter options
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('');
    setSelectedLocation('');
    setCurrentPage(1);
  };

  // Renders the pagination buttons
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

  // Renders the list of jobs based on the active tab
  const renderJobs = () => {
    if (activeTab === 'jobs') {
      return (
        <AnimatePresence>
          {currentJobs.length > 0 ? (
            currentJobs.map(job => {
              const IconComponent = IndustryIconMap[job.industry] || Briefcase;
              const isApplied = appliedJobIds.includes(job.id);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
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
                </motion.div>
              );
            })
          ) : (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 col-span-full text-center py-8">
              No new jobs found matching your criteria.
            </motion.p>
          )}
        </AnimatePresence>
      );
    } else {
      const appliedJobs = mockJobs.filter(job => appliedJobIds.includes(job.id));
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
        {renderJobs()}
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
const JobDetails = ({ job, profile, onGoBack, onJobApplied, generateMockApplicants }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [message, setMessage] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);

  useEffect(() => {
    // We no longer need to generate mock applicants, but we'll keep the function for now
    // and just set the applicants state to an empty array.
    setApplicants([]);
  }, [generateMockApplicants]);

  // Handle the "Apply Now" button click to show the cover letter modal
  const handleApplyClick = () => {
    setShowCoverLetterModal(true);
  };

  // Handle the final application submission with the cover letter
  const handleFinalApplication = (coverLetter) => {
    setIsApplying(true);
    setShowCoverLetterModal(false);

    // Simulate an API call with a delay
    setTimeout(() => {
      setIsApplying(false);
      setMessage({ type: 'success', text: 'Application submitted successfully!' });
      // Call the parent function to update the applied jobs list
      onJobApplied(job.id);
    }, 2000);
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
      {message && (
        <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />
      )}
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
        <div className="flex items-center gap-2 text-gray-700">
          <Building2 size={18} />
          <span className="font-medium">{job.officeType}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={18} />
          <span className="font-medium">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <CircleDollarSign size={18} />
          <span className="font-medium">{job.salary}</span>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Job Description</h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Qualifications</h3>
          <p className="text-gray-700 leading-relaxed">{job.qualifications}</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Skills Required</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map(skill => (
              <span key={skill} className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Benefits</h3>
        <ul className="list-disc list-inside text-gray-700">
          {job.benefits.split(',').map(benefit => (
            <li key={benefit.trim()}>{benefit.trim()}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Our Commitment to Diversity
        </h3>
        <p className="text-gray-700 leading-relaxed">
          At {job.employer}, we believe a diverse team is a stronger team. We are committed to fostering an inclusive environment that values unique perspectives and experiences. We encourage applications from all qualified candidates, regardless of background, race, ethnicity, religion, or gender identity.
        </p>
      </div>

      <button
        onClick={handleApplyClick}
        disabled={isApplying}
        className="w-fit mx-auto md:w-80 py-4 px-6 rounded-2xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-colors shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isApplying ? (
          <>
            <Fingerprint size={20} className="animate-pulse" />
            Submitting...
          </>
        ) : (
          <>
            <NotebookPen size={20} />
            Apply Now
          </>
        )}
      </button>

      <AnimatePresence>
        {showCoverLetterModal && (
          <CoverLetterModal
            onClose={() => setShowCoverLetterModal(false)}
            onSubmit={handleFinalApplication}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// New Modal component for the cover letter input
const CoverLetterModal = ({ onClose, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState('');

  const handleSubmit = () => {
    if (coverLetter.trim()) {
      onSubmit(coverLetter);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors">
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ClipboardList size={24} className="text-purple-600" />
          Your Cover Letter
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Please write or paste your cover letter below. This will be sent with your application.
        </p>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Start writing your cover letter here..."
          rows="10"
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow mb-4 text-sm"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-semibold rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!coverLetter.trim()}
            className="px-6 py-3 text-sm font-semibold rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckSquare size={18} />
            Send Application
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
