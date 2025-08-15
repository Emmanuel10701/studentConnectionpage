"use client"
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, Search, Upload, LayoutDashboard, ChevronRight, X, Briefcase, Bell, Menu, FileText, Settings, LogOut, GraduationCap, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from "framer-motion";

// --- MOCK DATA ---
const mockJobs = [
    { id: 1, title: 'Software Engineer Intern', employer: 'Tech Innovations Inc.', location: 'Nairobi, Kenya', industry: 'Technology', description: 'Assist in developing and maintaining web applications using modern frameworks.' },
    { id: 2, title: 'Junior Financial Analyst', employer: 'Global Finance Group', location: 'London, UK', industry: 'Finance', description: 'Analyze financial data, prepare reports, and assist in client portfolio management.' },
    { id: 3, title: 'Marketing Assistant', employer: 'Creative Marketing Solutions', location: 'New York, USA', industry: 'Marketing', description: 'Support marketing campaigns, manage social media accounts, and create content.' },
    { id: 4, title: 'Environmental Research Associate', employer: 'Eco-Solutions Africa', location: 'Cape Town, South Africa', industry: 'Environmental', description: 'Conduct research on sustainable practices and assist in field work.' },
    { id: 5, title: 'Data Scientist Intern', employer: 'Innovate Med', location: 'Boston, USA', industry: 'Healthcare', description: 'Work with a team to analyze patient data and develop predictive models.' },
    { id: 6, title: 'Full Stack Developer', employer: 'FutureTech Solutions', location: 'San Francisco, USA', industry: 'Technology', description: 'Develop robust, scalable web applications from front to back-end.' },
    { id: 7, title: 'Renewable Energy Technician', employer: 'Green Energy Co.', location: 'Nairobi, Kenya', industry: 'Environmental', description: 'Install and maintain solar power systems for commercial clients.' },
    { id: 8, title: 'Business Analyst', employer: 'Data Insights Ltd.', location: 'London, UK', industry: 'Technology', description: 'Provide insights and recommendations based on market and company data.' },
    { id: 9, title: 'Portfolio Management Intern', employer: 'Capital Investments', location: 'New York, USA', industry: 'Finance', description: 'Support the investment team with market research and portfolio analysis.' },
];

const uniqueIndustries = [...new Set(mockJobs.map(job => job.industry))];
const uniqueLocations = [...new Set(mockJobs.map(job => job.location))];

// --- UTILITY COMPONENTS ---

/**
 * A reusable message box for displaying success or error messages.
 */
const MessageBox = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = type === 'success' ? (
        <CheckCircle size={24} />
    ) : (
        <X size={24} />
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-xl text-white shadow-lg flex items-center gap-3 ${bgColor}`}
        >
            {icon}
            <span>{message}</span>
            <button onClick={onClose} className="ml-auto text-white opacity-70 hover:opacity-100">
                <X size={20} />
            </button>
        </motion.div>
    );
};

/**
 * Generates initials for a user's name.
 */
const getInitials = (name) => {
    if (!name) return '??';
    const parts = name.split(' ');
    let initials = parts.map(part => part.charAt(0)).join('').toUpperCase();
    if (initials.length > 2) {
        initials = initials.substring(0, 2);
    }
    return initials;
};

/**
 * A reusable back button component.
 */
const BackButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6"
        >
            <ArrowLeft size={20} className="mr-2" />
            Back
        </button>
    );
};

// --- MAIN CONTENT VIEWS ---

const DashboardHome = ({ onNavigate }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4">
                    <Briefcase className="text-blue-500 bg-blue-50 p-3 rounded-full" size={50} />
                    <div>
                        <p className="text-sm text-gray-500">Jobs Found</p>
                        <h4 className="text-3xl font-bold text-gray-900">{mockJobs.length}</h4>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center gap-4">
                    <Upload className="text-green-500 bg-green-50 p-3 rounded-full" size={50} />
                    <div>
                        <p className="text-sm text-gray-500">Resume Status</p>
                        <h4 className="text-3xl font-bold text-gray-900">Uploaded</h4>
                    </div>
                </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Job Postings</h3>
                    <button
                        onClick={() => onNavigate('jobs')}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                    >
                        View All <ChevronRight size={16} />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockJobs.slice(0, 3).map(job => (
                        <div key={job.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h4 className="font-semibold text-lg text-gray-900">{job.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">Employer: {job.employer}</p>
                            <p className="text-sm text-gray-600">Location: {job.location}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StudentProfile = ({ profile, setProfile, onGoBack, resumeFile, setResumeFile }) => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: profile
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [profilePic, setProfilePic] = useState(profile.profilePic || null);
    const [message, setMessage] = useState(null);
    const resumeInputRef = useRef(null);

    const onSubmit = async (data) => {
        setIsUpdating(true);
        try {
            // Mock API call to update profile
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProfile(prevProfile => ({ ...prevProfile, ...data }));
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleResumeUpload = () => {
        if (!resumeInputRef.current.files[0]) {
            setMessage({ type: 'error', text: 'Please select a file to upload.' });
            return;
        }

        const file = resumeInputRef.current.files[0];
        setResumeFile(file);
        setMessage({ type: 'success', text: `Resume '${file.name}' uploaded successfully!` });
    };

    const handleProfilePicUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                setMessage({ type: 'success', text: `Profile picture updated!` });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleCloseMessage = () => {
        setMessage(null);
    };

    return (
        <div>
            <BackButton onClick={onGoBack} />
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                <h3 className="flex items-center text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    <User className="mr-3 text-blue-600" /> My Profile
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 mb-8">
                    <div className="relative w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-600 overflow-hidden shrink-0">
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            getInitials(profile.name)
                        )}
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Change Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicUpload}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                        />
                    </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                {...register("name", { required: "Name is required" })} 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                placeholder="Your full name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                {...register("email", { required: "Email is required" })} 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                placeholder="your-email@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                        </div>
                
                        <div>
                            <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                            <input 
                                type="text" 
                                id="institution" 
                                {...register("institution", { required: "Institution is required" })} 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                placeholder="Your university/college"
                            />
                            {errors.institution && <p className="mt-1 text-sm text-red-500">{errors.institution.message}</p>}
                        </div>
                
                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">Course of Study</label>
                            <input 
                                type="text" 
                                id="course" 
                                {...register("course", { required: "Course is required" })} 
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                                placeholder="e.g., Computer Science"
                            />
                            {errors.course && <p className="mt-1 text-sm text-red-500">{errors.course.message}</p>}
                        </div>
                
                        <div>
                            <label htmlFor="yearOfStudy" className="block text-sm font-medium text-gray-700 mb-2">Year of Study</label>
                            <select
                                id="yearOfStudy"
                                {...register("yearOfStudy", { required: "Year of study is required" })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            >
                                <option value="">Select year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                                <option value="5">5th Year</option>
                                <option value="6">6th Year</option>
                                <option value="alumni">Alumni</option>
                            </select>
                            {errors.yearOfStudy && <p className="mt-1 text-sm text-red-500">{errors.yearOfStudy.message}</p>}
                        </div>
                    </div>
                
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                        <textarea
                            id="bio" 
                            rows="4"
                            {...register("bio")} 
                            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            placeholder="Tell us about yourself and your aspirations..."
                        />
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="bg-blue-600 text-white font-medium py-2 px-5 rounded-full shadow hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isUpdating ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
                
                <div className="mt-8 border-t border-gray-200 pt-6">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                        <FileText className="mr-2 text-green-600" size={20} /> Upload Resume
                    </h4>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <input 
                            type="file" 
                            id="resume" 
                            accept=".pdf,.doc,.docx"
                            ref={resumeInputRef}
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-50 file:text-green-700
                                hover:file:bg-green-100"
                        />
                        <button
                            onClick={handleResumeUpload}
                            className="w-full md:w-auto bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={!resumeInputRef.current?.files[0]}
                        >
                            Upload
                        </button>
                    </div>
                    {resumeFile && (
                        <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-500"/>
                            <span>Resume uploaded: <b>{resumeFile.name}</b></span>
                        </div>
                    )}
                </div>
                <AnimatePresence>
                    {message && <MessageBox message={message.text} type={message.type} onClose={handleCloseMessage} />}
                </AnimatePresence>
            </div>
        </div>
    );
};

const JobPostings = ({ onGoBack, onApply }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const filteredJobs = useMemo(() => {
        return mockJobs.filter(job => {
            const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.employer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesIndustry = selectedIndustry === '' || job.industry === selectedIndustry;
            const matchesLocation = selectedLocation === '' || job.location === selectedLocation;
            return matchesSearchTerm && matchesIndustry && matchesLocation;
        });
    }, [searchTerm, selectedIndustry, selectedLocation]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedIndustry('');
        setSelectedLocation('');
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
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map(job => (
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
            </div>
        </div>
    );
};

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
            
            setMessage({ type: 'success', text: 'Your application has been sent! The employer will review it soon.' });
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
                        {isApplying ? "Sending..." : "Submit Application"}
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

/**
 * Main application component. Manages state and renders different views.
 */
export default function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const profileMenuRef = useRef(null);
    
    // Using a ref for the sidebar to handle clicks outside of it
    const sidebarRef = useRef(null);

    const [studentProfile, setStudentProfile] = useState({
        name: 'Emmanuel Manaku',
        email: 'emmanuel.manaku@example.com',
        institution: 'Kirinyaga University',
        course: 'Computer Science',
        yearOfStudy: '3',
        bio: 'A passionate student looking for opportunities in the technology sector.',
        profilePic: null,
    });
    const [resumeFile, setResumeFile] = useState(null);

    // Close profile menu if user clicks outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close sidebar on small screens when a navigation item is clicked
    const handleNavigate = (view) => {
        setActiveView(view);
        if (window.innerWidth < 768) { // md breakpoint in Tailwind
            setIsSidebarOpen(false);
        }
    }

    const handleNavigateToJobs = (job) => {
        setSelectedJob(job);
        setActiveView('jobDetails');
    };
    
    const handleJobApplied = () => {
        setSelectedJob(null);
        setActiveView('dashboard');
    };

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <DashboardHome onNavigate={handleNavigate} />;
            case 'profile':
                return <StudentProfile 
                    profile={studentProfile} 
                    setProfile={setStudentProfile} 
                    onGoBack={() => handleNavigate('dashboard')} 
                    resumeFile={resumeFile}
                    setResumeFile={setResumeFile}
                />;
            case 'jobs':
                return <JobPostings onGoBack={() => handleNavigate('dashboard')} onApply={handleNavigateToJobs} />;
            case 'jobDetails':
                return <JobDetails 
                    job={selectedJob} 
                    profile={studentProfile} 
                    resumeFile={resumeFile}
                    onGoBack={() => handleNavigate('jobs')} 
                    onJobApplied={handleJobApplied}
                />;
            default:
                return <DashboardHome onNavigate={handleNavigate} />;
        }
    };
    
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, view: 'dashboard' },
        { name: 'Job Postings', icon: Briefcase, view: 'jobs' },
        { name: 'My Profile', icon: User, view: 'profile' },
        { name: 'Resume', icon: Upload, view: 'resume' },
        { name: 'Settings', icon: Settings, view: 'settings' },
    ];
    
    const NavItem = ({ name, icon: Icon, isActive, onClick }) => (
        <button
            onClick={onClick}
            className={`flex items-center w-full p-3 rounded-xl transition-colors duration-200 
                ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}
        >
            <Icon size={20} className="mr-4" />
            <span className="font-medium">{name}</span>
        </button>
    );

    return (
        <div className="bg-gray-100 min-h-screen font-inter text-gray-800 flex">
            {/* Overlay for mobile sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Component */}
            <motion.div
                ref={sidebarRef}
                initial={{ x: '-100%' }}
                animate={{ x: isSidebarOpen ? '0%' : '-100%' }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed inset-y-0 left-0 bg-white shadow-lg w-64 p-6 z-50 transform md:relative md:translate-x-0 md:min-h-screen md:flex-shrink-0 md:flex md:flex-col"
            >
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center">
                        <GraduationCap size={32} className="text-blue-600" />
                        <h1 className="ml-2 text-xl font-bold text-gray-900">Student Jobs</h1>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-1 space-y-2">
                    {navItems.map(item => (
                        <NavItem
                            key={item.name}
                            name={item.name}
                            icon={item.icon}
                            isActive={activeView === item.view}
                            onClick={() => handleNavigate(item.view)}
                        />
                    ))}
                </nav>
                <div className="border-t border-gray-200 mt-6 pt-6">
                    <button className="flex items-center w-full p-3 rounded-xl text-red-600 hover:bg-red-100 transition-colors">
                        <LogOut size={20} className="mr-4" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Header */}
                <header className="sticky top-0 bg-white shadow-sm p-4 z-30">
                    <div className="flex justify-between items-center">
                        {/* Menu for mobile */}
                        <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 md:hidden">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 md:pl-6 hidden md:block">
                            {navItems.find(item => item.view === activeView)?.name || "Dashboard"}
                        </h2>
                        {/* Profile and Notifications */}
                        <div className="flex items-center space-x-4">
                            <button className="relative text-gray-600 hover:text-blue-600 transition-colors">
                                <Bell size={24} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                            </button>
                            <div className="relative" ref={profileMenuRef}>
                                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                                        {studentProfile.profilePic ? (
                                            <img src={studentProfile.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            getInitials(studentProfile.name)
                                        )}
                                    </div>
                                    <span className="hidden md:inline font-medium text-gray-900">{studentProfile.name}</span>
                                </button>
                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 origin-top-right"
                                        >
                                            <button onClick={() => { handleNavigate('profile'); setIsProfileMenuOpen(false); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <User size={16} className="mr-2" /> My Profile
                                            </button>
                                            <button onClick={() => setIsProfileMenuOpen(false)} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                <Settings size={16} className="mr-2" /> Settings
                                            </button>
                                            <div className="border-t border-gray-100 my-1" />
                                            <button onClick={() => setIsProfileMenuOpen(false)} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                                <LogOut size={16} className="mr-2" /> Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {renderView()}
                </main>
            </div>
        </div>
    );
}
