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
} from 'lucide-react';
import { createPortal } from 'react-dom';

// --- MOCK DATA ---
const mockStudents = [
  {
    id: 1,
    name: "Jane Doe",
    specialization: "Computer Science",
    university: "Kirinyaga University",
    status: "Student",
    experienceInYears: "Less than 1 year",
    educationLevel: "Bachelor's",
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
    experienceInYears: "3 years",
    educationLevel: "Master's",
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
    experienceInYears: "Less than 1 year",
    educationLevel: "Bachelor's",
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
    experienceInYears: "Less than 1 year",
    educationLevel: "Master's",
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
    experienceInYears: "2 years",
    educationLevel: "Bachelor's",
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
    status: "Alumni",
    experienceInYears: "4 years",
    educationLevel: "PhD",
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
    experienceInYears: "Less than 1 year",
    educationLevel: "Bachelor's",
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
    experienceInYears: "5 years",
    educationLevel: "Master's",
    gpa: 3.9,
    bio: "Skilled in financial modeling and risk analysis. Eager to apply my analytical skills in an insurance or finance setting.",
    skills: ["Actuarial Science", "Statistics", "R", "SQL", "Risk Analysis"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=JL",
  },
  {
    id: 9,
    name: "Robert Brown",
    specialization: "Finance",
    university: "Strathmore University",
    status: "Alumni",
    experienceInYears: "6 years",
    educationLevel: "Bachelor's",
    gpa: 3.7,
    bio: "Financial analyst with expertise in market research and investment strategy.",
    skills: ["Finance", "Accounting", "Excel", "Data Analysis", "Investments"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=RB",
  },
  {
    id: 10,
    name: "Anna Lopez",
    specialization: "Human Resources",
    university: "University of Nairobi",
    status: "Student",
    experienceInYears: "Less than 1 year",
    educationLevel: "Bachelor's",
    gpa: 3.5,
    bio: "Aspiring HR professional with a focus on talent acquisition and employee relations.",
    skills: ["HR", "Recruitment", "Communication", "Employee Relations"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=AL",
  },
  {
    id: 11,
    name: "Brian Wilson",
    specialization: "Civil Engineering",
    university: "Jomo Kenyatta University",
    status: "Student",
    experienceInYears: "Less than 1 year",
    educationLevel: "Diploma",
    gpa: 3.2,
    bio: "Skilled in structural design and project management. Eager to contribute to infrastructure projects.",
    skills: ["AutoCAD", "Structural Analysis", "Project Management", "Civil Engineering"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=BW",
  },
  {
    id: 12,
    name: "Chloe Davis",
    specialization: "Biomedical Engineering",
    university: "Jomo Kenyatta University",
    status: "Alumni",
    experienceInYears: "1 year",
    educationLevel: "Master's",
    gpa: 3.9,
    bio: "Biomedical engineer with research experience in medical device development.",
    skills: ["Biomedical Engineering", "Medical Devices", "Lab Work", "Research"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=CD",
  },
];

const educationLevels = ["All", "Certificate", "Diploma", "Bachelor's", "Master's", "PhD"];
const experienceRanges = ["All", "Less than 1 year", "1-2 years", "3-5 years", "5+ years"];

// Helper function to check if experience matches the selected range
const matchesExperience = (studentExperience, filter) => {
  if (filter === "All") return true;
  if (filter === "Less than 1 year") return studentExperience === "Less than 1 year";
  const [min, max] = filter.split('-').map(str => parseInt(str));
  const studentYears = parseInt(studentExperience);
  if (filter.includes('+')) {
    return studentYears >= 5;
  }
  return studentYears >= min && studentYears <= max;
};

// --- COMPONENTS ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
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

  return createPortal(
    <div className="fixed inset-0 z-[102] flex justify-end p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative bg-white rounded-l-3xl p-8 max-w-lg w-full h-full overflow-y-auto transform transition-transform duration-300 translate-x-0">
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-gray-700 transition-colors">
          <XCircle size={28} />
        </button>
        <div className="flex flex-col items-center text-center">
          <img src={student.imageUrl} alt={student.name} className="w-24 h-24 rounded-full border-4 border-blue-100 mb-4 shadow-lg" />
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
        <div className="mt-8 flex gap-4">
          <a href={student.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            View Resume <Eye size={18} />
          </a>
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-sm font-medium rounded-full shadow-lg text-gray-700 bg-white hover:bg-gray-100 transition-colors">
            Contact <Mail size={18} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// The TalentSearch component provided by the user
const TalentSearch = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, experienceFilter, setExperienceFilter, specializationFilter, setSpecializationFilter, educationLevelFilter, setEducationLevelFilter, specializations, paginatedStudents, setSelectedStudent, handleClearFilters }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
        <Users className="inline-block mr-2 text-blue-600" size={36} />Find Talent
      </h2>
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

      <div className="flex flex-wrap gap-3 mb-8 justify-center sm:justify-start">
        {/* Status Filter (Student/Alumni) */}
        <div className="flex flex-wrap gap-2 items-center p-2 rounded-full bg-gray-100">
          <span className="text-sm font-semibold text-gray-600 ml-2">Status:</span>
          <button
            onClick={() => setStatusFilter("All")}
            className={`py-2 px-4 rounded-full font-semibold transition-all flex items-center gap-2 ${statusFilter === "All" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("Student")}
            className={`py-2 px-4 rounded-full font-semibold transition-all flex items-center gap-2 ${statusFilter === "Student" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
          >
            <GraduationCap size={18} /> Students
          </button>
          <button
            onClick={() => setStatusFilter("Alumni")}
            className={`py-2 px-4 rounded-full font-semibold transition-all flex items-center gap-2 ${statusFilter === "Alumni" ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
          >
            <Building2 size={18} /> Alumni
          </button>
        </div>

        {/* Experience in Years Filter */}
        <div className="flex flex-wrap gap-2 items-center p-2 rounded-full bg-gray-100">
          <span className="text-sm font-semibold text-gray-600 ml-2">Experience:</span>
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="py-2 px-4 rounded-full font-semibold transition-all bg-white text-gray-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {experienceRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        {/* Specialization Filter */}
        <div className="flex flex-wrap gap-2 items-center p-2 rounded-full bg-gray-100">
          <span className="text-sm font-semibold text-gray-600 ml-2">Specialization:</span>
          <select
            value={specializationFilter}
            onChange={(e) => setSpecializationFilter(e.target.value)}
            className="py-2 px-4 rounded-full font-semibold transition-all bg-white text-gray-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        {/* Education Level Filter */}
        <div className="flex flex-wrap gap-2 items-center p-2 rounded-full bg-gray-100">
          <span className="text-sm font-semibold text-gray-600 ml-2">Education Level:</span>
          <select
            value={educationLevelFilter}
            onChange={(e) => setEducationLevelFilter(e.target.value)}
            className="py-2 px-4 rounded-full font-semibold transition-all bg-white text-gray-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {educationLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        
        {/* Clear Filters Button */}
        <div className="flex flex-wrap gap-2 items-center p-2 rounded-full bg-gray-100">
          <button
            onClick={handleClearFilters}
            className="py-2 px-4 rounded-full font-semibold transition-all flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <XCircle size={18} /> Clear Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedStudents.length > 0 ? (
          paginatedStudents.map(student => (
            <div
              key={student.id}
              className="bg-white p-6 rounded-2xl text-center shadow-md border-2 border-gray-50 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedStudent(student)}
            >
              <img src={student.imageUrl} alt={`${student.name}`} className="w-24 h-24 mx-auto rounded-full mb-4 border-4 border-white shadow-md" />
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{student.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{student.specialization} at {student.university}</p>
              <p className="text-xs text-gray-400 mb-4 italic">{student.bio}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {student.skills.map(skill => (
                  <span key={skill} className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 font-medium">
                <span className="text-blue-600 font-bold">Status:</span> {student.status} • <span className="text-blue-600 font-bold">Experience:</span> {student.experienceInYears} • <span className="text-blue-600 font-bold">GPA:</span> {student.gpa}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full py-12">No students found matching your search. Try a different query!</p>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [educationLevelFilter, setEducationLevelFilter] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const specializations = [...new Set(mockStudents.map(student => student.specialization))].sort();

  useEffect(() => {
    setStudents(mockStudents);
  }, []);

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
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 p-8">
      <script src="https://cdn.tailwindcss.com"></script>
      
      <div className="w-full max-w-7xl mx-auto">
        <TalentSearch
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
          paginatedStudents={paginatedStudents}
          setSelectedStudent={setSelectedStudent}
          handleClearFilters={handleClearFilters}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedStudent && (
        <StudentProfile student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}
