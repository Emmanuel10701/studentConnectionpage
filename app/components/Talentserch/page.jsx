'use client';
import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Users,
  GraduationCap,
  Mail,
  XCircle,
  Eye,
  Building2,
  Download,
  Filter,
  X
} from 'lucide-react';

// Helper function to get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to format experience from API data
const formatExperience = (experienceArray) => {
  if (!experienceArray || experienceArray.length === 0) return "Less than 1 year";
  
  const currentDate = new Date();
  let totalMonths = 0;
  
  experienceArray.forEach(exp => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.endDate ? new Date(exp.endDate) : currentDate;
    const diffTime = Math.abs(endDate - startDate);
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    totalMonths += diffMonths;
  });
  
  const totalYears = Math.floor(totalMonths / 12);
  
  if (totalYears < 1) return "Less than 1 year";
  if (totalYears === 1) return "1 year";
  if (totalYears === 2) return "2 years";
  if (totalYears <= 5) return "3-5 years";
  return "5+ years";
};

// Helper function to get education level from API data
const getEducationLevel = (educationArray) => {
  if (!educationArray || educationArray.length === 0) return "Not specified";
  
  // Find the highest education level
  const levels = educationArray.map(edu => {
    const degree = edu.degree || '';
    if (degree.toLowerCase().includes('phd') || degree.toLowerCase().includes('doctor')) return 'PhD';
    if (degree.toLowerCase().includes('master')) return 'Master\'s';
    if (degree.toLowerCase().includes('bachelor') || degree.toLowerCase().includes('bs') || degree.toLowerCase().includes('b.sc')) return 'Bachelor\'s';
    if (degree.toLowerCase().includes('diploma')) return 'Diploma';
    if (degree.toLowerCase().includes('certificate')) return 'Certificate';
    return 'Not specified';
  });
  
  // Return the highest level found
  if (levels.includes('PhD')) return 'PhD';
  if (levels.includes('Master\'s')) return 'Master\'s';
  if (levels.includes('Bachelor\'s')) return 'Bachelor\'s';
  if (levels.includes('Diploma')) return 'Diploma';
  if (levels.includes('Certificate')) return 'Certificate';
  
  return levels[0] || 'Not specified';
};

// Helper function to calculate GPA from education data (mock implementation)
const calculateGPA = (educationArray) => {
  // This is a mock implementation since GPA isn't in the API data
  return (3.5 + Math.random() * 0.5).toFixed(1);
};

// Transform API data to match the expected format
const transformApiData = (apiData) => {
  return apiData.map(student => ({
    id: student.id,
    name: student.name,
    specialization: student.education && student.education.length > 0 
      ? student.education[0].fieldOfStudy 
      : "Not specified",
    university: student.education && student.education.length > 0 
      ? student.education[0].school 
      : "Not specified",
    status: student.education && student.education.some(edu => edu.isCurrent) 
      ? "Student" 
      : "Alumni",
    experienceInYears: formatExperience(student.experience),
    educationLevel: getEducationLevel(student.education),
    gpa: calculateGPA(student.education),
    bio: student.bio || "No bio available",
    skills: student.skills || [],
    resumeUrl: student.resumePath || "#",
    email: student.email || "no-email@example.com", // Assuming email might be available in real API
    initials: getInitials(student.name)
  }));
};

const educationLevels = ["All", "Certificate", "Diploma", "Bachelor's", "Master's", "PhD"];
const experienceRanges = ["All", "Less than 1 year", "1-2 years", "3-5 years", "5+ years"];

// Helper function to check if experience matches the selected range
const matchesExperience = (studentExperience, filter) => {
  if (filter === "All") return true;
  if (filter === "Less than 1 year") return studentExperience === "Less than 1 year";
  
  if (filter.includes('+')) {
    return studentExperience === "5+ years";
  }
  
  if (filter.includes('-')) {
    const rangeText = filter === "1-2 years" ? "1-2 years" : "3-5 years";
    return studentExperience === rangeText;
  }
  
  return false;
};

// --- COMPONENTS ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-full font-bold transition-all ${
            currentPage === page
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-blue-100'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};

const StudentProfile = ({ student, onClose }) => {
  if (!student) return null;

  const handleResumeDownload = () => {
    // In a real app, this would be the actual resume URL from the API
    const link = document.createElement('a');
    link.href = student.resumeUrl;
    link.download = `${student.name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${student.email}?subject=Interest in Your Profile`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
          <XCircle size={28} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg">
            {student.initials}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">{student.name}</h2>
          <p className="text-md text-blue-600 font-semibold">{student.specialization}</p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
            <div className="flex items-center gap-3 text-gray-700 mb-2">
              <GraduationCap size={20} />
              <p className="text-lg font-semibold">Education</p>
            </div>
            <p className="text-gray-600">{student.university}</p>
            <p className="text-sm font-medium text-gray-500 mt-1">Level: <span className="text-gray-700 font-bold">{student.educationLevel}</span></p>
            <p className="text-sm font-medium text-gray-500 mt-1">GPA: <span className="text-gray-700 font-bold">{student.gpa}</span></p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
            <h3 className="flex items-center gap-3 text-gray-700 mb-2">
              <Briefcase size={20} />
              <p className="text-lg font-semibold">About Me</p>
            </h3>
            <p className="text-gray-600 leading-relaxed">{student.bio}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {student.skills.map(skill => (
                <span key={skill} className="bg-blue-100 text-blue-800 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex gap-4 flex-col sm:flex-row">
          <button 
            onClick={handleResumeDownload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Download Resume <Download size={18} />
          </button>
          <button 
            onClick={handleEmailClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-sm font-medium rounded-full shadow-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors"
          >
            Contact <Mail size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterBar = ({ 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter, 
  experienceFilter, 
  setExperienceFilter, 
  specializationFilter, 
  setSpecializationFilter, 
  educationLevelFilter, 
  setEducationLevelFilter, 
  specializations, 
  handleClearFilters,
  isFilterOpen,
  setIsFilterOpen
}) => {
  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          <Users className="inline-block mr-2 text-blue-600" size={28} />Find Talent
        </h2>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="p-2 rounded-lg bg-blue-100 text-blue-600"
        >
          <Filter size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name, specialization, university, or skills..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-shadow duration-300"
        />
        <Search className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Filter Section - Always visible on desktop, collapsible on mobile */}
      <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block mb-8`}>
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Status Filter (Student/Alumni) */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Status</label>
            <div className="flex gap-2 bg-gray-100 p-2 rounded-full">
              <button
                onClick={() => setStatusFilter("All")}
                className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${statusFilter === "All" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("Student")}
                className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${statusFilter === "Student" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
              >
                <GraduationCap size={18} /> Students
              </button>
              <button
                onClick={() => setStatusFilter("Alumni")}
                className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${statusFilter === "Alumni" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
              >
                <Building2 size={18} /> Alumni
              </button>
            </div>
          </div>

          {/* Experience in Years Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Experience</label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full py-3 px-4 rounded-full font-semibold transition-all bg-white text-gray-700 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {experienceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Specialization Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Specialization</label>
            <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
              className="w-full py-3 px-4 rounded-full font-semibold transition-all bg-white text-gray-700 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Education Level Filter */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Education Level</label>
            <select
              value={educationLevelFilter}
              onChange={(e) => setEducationLevelFilter(e.target.value)}
              className="w-full py-3 px-4 rounded-full font-semibold transition-all bg-white text-gray-700 border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {educationLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Clear Filters Button */}
        <div className="flex justify-end">
          <button
            onClick={handleClearFilters}
            className="py-2 px-4 rounded-full font-semibold transition-all flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <X size={18} /> Clear Filters
          </button>
        </div>
      </div>
    </>
  );
};

const StudentCard = ({ student, setSelectedStudent }) => {
  return (
    <div
      className="bg-white p-6 rounded-2xl text-center shadow-md border-2 border-gray-50 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
      onClick={() => setSelectedStudent(student)}
    >
      <div className="w-24 h-24 mx-auto rounded-full mb-4 bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
        {student.initials}
      </div>
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{student.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{student.specialization} at {student.university}</p>
      <p className="text-xs text-gray-400 mb-4 line-clamp-2">{student.bio}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {student.skills.slice(0, 4).map(skill => (
          <span key={skill} className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            {skill}
          </span>
        ))}
        {student.skills.length > 4 && (
          <span className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
            +{student.skills.length - 4}
          </span>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-600 font-medium">
        <span className="text-blue-600 font-bold">Status:</span> {student.status} • <span className="text-blue-600 font-bold">Experience:</span> {student.experienceInYears} • <span className="text-blue-600 font-bold">GPA:</span> {student.gpa}
      </div>
    </div>
  );
};

// Main App Component
export default function TalentSearchApp() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [educationLevelFilter, setEducationLevelFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  // Fetch data from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would use your actual API endpoint
        const response = await fetch('/api/studententireprofile');
        const data = await response.json();
        
        // For demo purposes, we'll use a timeout to simulate API call
        setTimeout(() => {
          // Transform API data to match our component's expected format
          const transformedData = transformApiData(data);
          setStudents(transformedData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching student data:', error);
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const specializations = [...new Set(students.map(student => student.specialization))].sort();

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setExperienceFilter('All');
    setSpecializationFilter('All');
    setEducationLevelFilter('All');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'All' ||
      student.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesExperienceRange = matchesExperience(student.experienceInYears, experienceFilter);
    
    const matchesSpecialization =
      specializationFilter === 'All' ||
      student.specialization.toLowerCase() === specializationFilter.toLowerCase();
    
    const matchesEducationLevel =
      educationLevelFilter === 'All' ||
      student.educationLevel.toLowerCase() === educationLevelFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesExperienceRange && matchesSpecialization && matchesEducationLevel;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, experienceFilter, specializationFilter, educationLevelFilter]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-gray-100">
          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            experienceFilter={experienceFilter}
            setExperienceFilter={setExperienceFilter}
            specializationFilter={specializationFilter}
            setSpecializationFilter={setSpecializationFilter}
            educationLevelFilter={educationLevelFilter}
            setEducationLevelFilter={setEducationLevelFilter}
            specializations={specializations}
            handleClearFilters={handleClearFilters}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map(student => (
                    <StudentCard 
                      key={student.id} 
                      student={student} 
                      setSelectedStudent={setSelectedStudent} 
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No students found matching your search.</p>
                    <p className="text-gray-400">Try adjusting your filters or search query.</p>
                  </div>
                )}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {selectedStudent && (
        <StudentProfile student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}