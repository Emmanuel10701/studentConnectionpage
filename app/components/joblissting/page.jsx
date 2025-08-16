'use client';
import React, { useState } from 'react';
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
  Phone,
  Paperclip,
  Bookmark,
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


// --- COMPONENTS ---
const DeleteConfirmationModal = ({ onConfirm, onCancel, title, message }) => {
  return createPortal(
    <div className="fixed inset-0 z-[102] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full m-auto shadow-2xl transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
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

const ApplicantsModal = ({ job, applicants, onClose, setSelectedStudent }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplicants = applicants.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.university.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!job || !applicants) return null;

  return createPortal(
    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
      <div className="relative bg-white rounded-3xl p-8 max-w-4xl w-full m-auto shadow-2xl transform transition-all duration-300 scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <XCircle size={32} />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Applicants for "{job.title}"</h3>
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search applicants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {filteredApplicants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2">
            {filteredApplicants.map(student => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                className="bg-gray-50 p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-100"
              >
                <img src={student.imageUrl} alt={student.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-500 truncate">{student.specialization} at {student.university}</p>
                  <p className="text-xs font-medium text-gray-400 mt-1">{student.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No matching applicants found.</p>
        )}
      </div>
    </div>,
    document.body
  );
};


// Main Component for Job Postings View
const JobPostings = ({ jobs, handlePostJob, handleDeleteJob, handleViewApplicants }) => {
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
    <>
      <div className="sticky top-0 z-10 bg-gray-100 bg-opacity-90 backdrop-blur-sm p-4 md:p-8 rounded-b-3xl shadow-xl flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          <Bookmark size={32} className="inline-block mr-2 text-blue-600" /> Job Postings
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex-shrink-0 flex items-center gap-2 font-bold py-3 px-6 rounded-full shadow-md transform transition-all duration-300 text-sm
            ${showForm ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          {showForm ? <><XCircle size={18} /> Close Form</> : <><Plus size={18} /> Post a New Job</>}
        </button>
      </div>

      <div className="bg-gray-100 p-4 md:p-8">
        {showForm && (
          <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-2xl mb-8 border border-gray-200 shadow-inner">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-gray-500" /> Create a New Job Listing
            </h3>
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

        <div className="flex flex-col gap-6">
          {jobs.length > 0 ? (
            jobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Bookmark size={20} className="text-gray-400" />{job.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-600">{job.applicants.length} Applicants</span>
                      <Users size={20} className="text-gray-400" />
                    </div>
                  </div>
                  <p className="text-base text-gray-600">{job.description}</p>
                  <div className="text-sm text-gray-500 space-y-2">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                      <Paperclip size={16} className="text-gray-400" /> Requirements:
                    </h4>
                    <p>{job.requirements}</p>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
                  <button
                    onClick={() => handleViewApplicants(job)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={18} /> View Applicants
                  </button>
                  <button
                    onClick={() => openDeleteModal(job.id)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-sm font-medium rounded-full shadow-md text-red-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 size={18} /> Delete
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
      </div>
    </>
  );
};


// Main App Component
export default function App() {
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handlePostJob = (newJob) => {
    const jobId = `job-${jobs.length + 1}`;
    const jobWithId = { ...newJob, id: jobId, applicants: [] };
    setJobs(prevJobs => [...prevJobs, jobWithId]);
  };

  const handleDeleteJob = (jobId) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };

  const handleViewApplicants = (job) => {
    setSelectedJobApplicants({ job: job, applicants: job.applicants });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Tailwind CSS Script for JIT compilation */}
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="w-full max-w-7xl mx-auto">
        <JobPostings
          jobs={jobs}
          handlePostJob={handlePostJob}
          handleDeleteJob={handleDeleteJob}
          handleViewApplicants={handleViewApplicants}
        />
      </div>

      {/* Render modals if active */}
      {selectedJobApplicants && (
        <ApplicantsModal
          job={selectedJobApplicants.job}
          applicants={selectedJobApplicants.applicants}
          onClose={() => setSelectedJobApplicants(null)}
          setSelectedStudent={setSelectedStudent}
        />
      )}

      {selectedStudent && (
        <StudentProfile student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}
