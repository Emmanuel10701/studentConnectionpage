'use client';
import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  LayoutDashboard,
  Menu,
  X,
  Users,
  Building2,
  Search,
  GraduationCap,
  Plus,
  Trash2,
  Eye,
  CircleCheck,
  Edit,
  Save,
  Mail,
  Phone,
  Globe,
  XCircle
} from 'lucide-react';
import { createPortal } from 'react-dom';

// Mock data for the employer's company profile
const initialCompanyProfile = {
  name: "Tech Innovators Inc.",
  location: "Nairobi, Kenya",
  industry: "Software Development",
  description: "We are a leading technology company dedicated to creating innovative solutions that solve complex problems. Our team is passionate about mentorship and empowering the next generation of tech talent.",
  logoUrl: "https://placehold.co/128x128/E0E7FF/4F46E5?text=TI",
  companySize: "500+ employees",
  website: "https://www.techinnovators.com",
  contact: {
    email: "careers@techinnovators.com",
    phone: "+254 712 345 678",
  },
};

// Mock data for students with more details and a new 'status' property
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
  {
    id: 3,
    name: "Emily White",
    specialization: "Mechanical Engineering",
    university: "Jomo Kenyatta University",
    status: "Student",
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
    status: "Student",
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
    gpa: 3.9,
    bio: "Skilled in financial modeling and risk analysis. Eager to apply my analytical skills in an insurance or finance setting.",
    skills: ["Actuarial Science", "Statistics", "R", "SQL", "Risk Analysis"],
    resumeUrl: "#",
    imageUrl: "https://placehold.co/96x96/D1D5DB/1F2937?text=JL",
  },
];

// Mock data for job postings
const mockJobs = [
  {
    id: "job-1",
    title: "Junior Software Developer",
    description: "Develop and maintain web applications using modern technologies.",
    requirements: "Proficiency in React, Node.js, and a keen eye for detail. Bachelor's degree in Computer Science or related field.",
    applicants: [mockStudents[0], mockStudents[5], mockStudents[6]],
  },
  {
    id: "job-2",
    title: "Marketing Intern",
    description: "Assist the marketing team with content creation, social media management, and data analysis.",
    requirements: "Strong communication skills, familiarity with digital marketing tools, and a passion for creative storytelling.",
    applicants: [mockStudents[1], mockStudents[4]],
  },
  {
    id: "job-3",
    title: "Data Analyst",
    description: "Analyze large datasets to provide actionable insights and support business decisions.",
    requirements: "Experience with Python (Pandas), SQL, and data visualization tools. Strong analytical and problem-solving skills.",
    applicants: [mockStudents[3], mockStudents[7]],
  },
];

const StudentProfileModal = ({ student, onClose }) => {
  // Use createPortal to render the modal outside the main component's DOM hierarchy
  // This helps with layering and z-index issues.
  if (!student) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl p-8 max-w-lg w-full m-auto shadow-2xl transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-200"
        >
          <XCircle size={32} />
        </button>

        <div className="flex flex-col items-center text-center">
          <img
            src={student.imageUrl}
            alt={`${student.name}`}
            className="w-32 h-32 rounded-full mb-4 border-4 border-white shadow-lg"
          />
          <h2 className="text-3xl font-extrabold text-gray-900">{student.name}</h2>
          <p className="text-sm font-semibold text-blue-600 mt-1">{student.specialization} • {student.university}</p>
        </div>

        <div className="mt-6 text-gray-700">
          <p className="text-sm leading-relaxed text-gray-500 italic">"{student.bio}"</p>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Key Details</h3>
            <ul className="text-sm space-y-1 text-gray-600">
              <li><span className="font-semibold text-gray-800">Status:</span> {student.status}</li>
              <li><span className="font-semibold text-gray-800">GPA:</span> {student.gpa}</li>
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {student.skills.map(skill => (
                <span key={skill} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={student.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
            >
              View Resume
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};


const CompanyProfile = ({ profile, isEditing, handleProfileChange, setIsEditing }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900">About Company</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 font-bold py-2 px-6 rounded-full shadow-md transform transition-all duration-300 text-sm
            ${isEditing ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {isEditing ? <><Save size={18} /> Save</> : <><Edit size={18} /> Edit</>}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img
          src={profile.logoUrl}
          alt={`${profile.name} logo`}
          className="w-24 h-24 rounded-full border-4 border-white shadow-xl mx-auto"
        />

        <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
          {isEditing ? (
            <div className="space-y-4 text-sm">
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full text-lg font-bold p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleProfileChange}
                className="w-full text-gray-600 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Location"
              />
              <input
                type="text"
                name="industry"
                value={profile.industry}
                onChange={handleProfileChange}
                className="w-full text-gray-600 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Industry"
              />
              <input
                type="text"
                name="companySize"
                value={profile.companySize}
                onChange={handleProfileChange}
                className="w-full text-gray-600 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Company Size"
              />
              <input
                type="url"
                name="website"
                value={profile.website}
                onChange={handleProfileChange}
                className="w-full text-gray-600 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Website URL"
              />
              <input
                type="email"
                name="contact.email"
                value={profile.contact.email}
                onChange={handleProfileChange}
                className="w-full text-gray-600 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Contact Email"
              />
              <input
                type="tel"
                name="contact.phone"
                value={profile.contact.phone}
                onChange={handleProfileChange}
                className="w-full text-gray-600 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Contact Phone"
              />
              <textarea
                name="description"
                value={profile.description}
                onChange={handleProfileChange}
                className="w-full text-gray-500 mt-2 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
                rows="5"
                placeholder="Company Description"
              />
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2"><Globe size={16} /> {profile.location} • {profile.industry}</p>
              <p className="text-gray-500 mt-4 leading-relaxed text-sm">{profile.description}</p>
              <div className="mt-4 text-xs text-gray-600 space-y-2">
                <p className="flex items-center gap-2"><Users size={14} /> {profile.companySize}</p>
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline"><Globe size={14} /> {profile.website}</a>
                <p className="flex items-center gap-2"><Mail size={14} /> {profile.contact.email}</p>
                <p className="flex items-center gap-2"><Phone size={14} /> {profile.contact.phone}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


const TalentSearch = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredStudents, setSelectedStudent }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
        Find Talent
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
        <button
          onClick={() => setStatusFilter("All")}
          className={`py-2 px-6 rounded-full font-semibold transition-all flex items-center gap-2 ${statusFilter === "All" ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
        >
          All
        </button>
        <button
          onClick={() => setStatusFilter("Student")}
          className={`py-2 px-6 rounded-full font-semibold transition-all flex items-center gap-2 ${statusFilter === "Student" ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
        >
          <GraduationCap size={18} /> Students
        </button>
        <button
          onClick={() => setStatusFilter("Alumni")}
          className={`py-2 px-6 rounded-full font-semibold transition-all flex items-center gap-2 ${statusFilter === "Alumni" ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
        >
          <Building2 size={18} /> Alumni
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length > 0 ? (
          filteredStudents.map(student => (
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
                <span className="text-blue-600 font-bold">Status:</span> {student.status} • <span className="text-blue-600 font-bold">GPA:</span> {student.gpa}
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

const DeleteConfirmationModal = ({ onConfirm, onCancel, title, message }) => {
  return createPortal(
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-full hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};


const ApplicantsModal = ({ job, applicants, onClose, setSelectedStudent }) => {
  if (!job || !applicants) return null;

  return createPortal(
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-3xl p-8 max-w-3xl w-full m-auto shadow-2xl transform transition-all duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <XCircle size={32} />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Applicants for "{job.title}"</h3>
        {applicants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {applicants.map(student => (
              <div
                key={student.id}
                className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedStudent(student)}
              >
                <img src={student.imageUrl} alt={student.name} className="w-12 h-12 rounded-full border-2 border-white" />
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.specialization} at {student.university}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No applicants yet. Keep an eye out!</p>
        )}
      </div>
    </div>,
    document.body
  );
};


const JobPostings = ({ jobs, handlePostJob, handleDeleteJob, handleViewApplicants, selectedJobApplicants, setSelectedStudent, setSelectedJobApplicants }) => {
  const [showForm, setShowForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    requirements: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (newJob.title && newJob.description && newJob.requirements) {
      handlePostJob(newJob);
      setNewJob({ title: "", description: "", requirements: "" });
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

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Job Postings
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 font-bold py-2 px-6 rounded-full shadow-md transform transition-all duration-300 text-sm
            ${showForm ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {showForm ? <><X size={18} /> Close Form</> : <><Plus size={18} /> Post a New Job</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Create a New Job Listing</h3>
          <div className="space-y-4">
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
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={newJob.requirements}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <CircleCheck size={20} className="mr-2" /> Post Job
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="bg-gray-50 p-6 rounded-2xl shadow-md border-2 border-gray-100 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                <div className="text-xs text-gray-500">
                  <h4 className="font-semibold text-gray-700 mb-1">Requirements:</h4>
                  <p>{job.requirements}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-between">
                <button
                  onClick={() => handleViewApplicants(job)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <Eye size={16} /> View Applicants ({job.applicants.length})
                </button>
                <button
                  onClick={() => openDeleteModal(job.id)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full py-12">You haven't posted any jobs yet.</p>
        )}
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          title="Delete Job Post"
          message="Are you sure you want to delete this job post? This action cannot be undone."
        />
      )}

      {selectedJobApplicants && (
        <ApplicantsModal
          job={selectedJobApplicants.job}
          applicants={selectedJobApplicants.applicants}
          onClose={() => setSelectedJobApplicants(null)}
          setSelectedStudent={setSelectedStudent}
        />
      )}
    </div>
  );
};


const Dashboard = ({ students, jobs, totalStudents, totalAlumni, totalJobs }) => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Students</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{totalStudents}</p>
          </div>
          <GraduationCap size={48} className="text-blue-500 opacity-20" />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Alumni</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{totalAlumni}</p>
          </div>
          <Building2 size={48} className="text-green-500 opacity-20" />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Job Postings</p>
            <p className="text-4xl font-bold text-gray-900 mt-1">{totalJobs}</p>
          </div>
          <Briefcase size={48} className="text-purple-500 opacity-20" />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Students</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {students.slice(0, 4).map(student => (
            <div key={student.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl shadow-sm">
              <img src={student.imageUrl} alt={student.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-gray-900">{student.name}</p>
                <p className="text-xs text-gray-500">{student.specialization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Job Postings</h2>
        <ul className="space-y-4">
          {jobs.slice(0, 3).map(job => (
            <li key={job.id} className="bg-gray-50 p-4 rounded-2xl shadow-sm">
              <p className="font-semibold text-gray-900">{job.title}</p>
              <p className="text-sm text-gray-500">{job.description.substring(0, 70)}...</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const App = () => {
  const [companyProfile, setCompanyProfile] = useState(initialCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState(mockStudents);
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompanyProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setCompanyProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePostJob = (newJob) => {
    const newId = `job-${jobs.length + 1}`;
    setJobs(prevJobs => [...prevJobs, { ...newJob, id: newId, applicants: [] }]);
  };

  const handleDeleteJob = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const handleViewApplicants = (job) => {
    setSelectedJobApplicants({ job, applicants: job.applicants });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard
          students={students}
          jobs={jobs}
          totalStudents={students.length}
          totalAlumni={students.filter(s => s.status === 'Alumni').length}
          totalJobs={jobs.length}
        />;
      case 'Find Talent':
        return <TalentSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredStudents={filteredStudents}
          setSelectedStudent={setSelectedStudent}
        />;
      case 'Job Postings':
        return <JobPostings
          jobs={jobs}
          handlePostJob={handlePostJob}
          handleDeleteJob={handleDeleteJob}
          handleViewApplicants={handleViewApplicants}
          selectedJobApplicants={selectedJobApplicants}
          setSelectedStudent={setSelectedStudent}
          setSelectedJobApplicants={setSelectedJobApplicants}
        />;
      case 'Company Profile':
        return <CompanyProfile
          profile={companyProfile}
          isEditing={isEditing}
          handleProfileChange={handleProfileChange}
          setIsEditing={setIsEditing}
        />;
      default:
        return <div>Select a section from the sidebar.</div>;
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Find Talent', icon: Users },
    { name: 'Job Postings', icon: Briefcase },
    { name: 'Company Profile', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans antialiased text-gray-800">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 text-gray-600 hover:text-gray-900 transition-colors"
      >
        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 w-64 bg-white p-6 shadow-xl z-40 transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src={companyProfile.logoUrl} alt="Logo" className="h-10 w-10 rounded-full" />
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.name}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.name);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200
                    ${activeSection === item.name ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Modals are rendered as portals to ensure they appear on top of everything */}
      {selectedStudent && (
        <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
};

export default App;
