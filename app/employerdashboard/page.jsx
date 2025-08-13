'use client';
import React, { useState } from 'react';
import { Mail, Phone, Globe, Users, Edit, Save, GraduationCap, Building2, Search, Bell, Settings, XCircle, Briefcase, LayoutDashboard, Menu, X } from 'lucide-react';

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


/**
 * This file contains commented examples for common API requests
 * in a student/employer application scenario.
 *
 * Each function demonstrates a different HTTP method:
 * - POST for creating new data (e.g., sending a new application).
 * - GET for retrieving data (e.g., getting a list of jobs or an application's details).
 * - PUT for updating existing data (e.g., editing an application's details).
 */

// Define the base URL for the API. In a real application, this would be
// configured dynamically (e.g., from an environment variable).
const BASE_URL = 'https://api.your-application.com';

// -------------------------------------------------------------------------
// 1. POST Request: Sending a new job application (or any new resource)
// -------------------------------------------------------------------------

/**
 * Sends a new job application to the backend.
 *
 * This function uses the **POST** method to create a new resource on the server.
 * The data to be sent is included in the request body as a JSON object.
 *
 * @param {object} applicationData - An object containing the application details.
 * @param {string} applicationData.studentId - The ID of the student.
 * @param {string} applicationData.jobId - The ID of the job they are applying for.
 * @param {string} applicationData.coverLetter - The student's cover letter.
 * @returns {Promise<object>} A promise that resolves to the created application object from the server.
 */
async function sendNewApplication(applicationData) {
  try {
    const response = await fetch(`${BASE_URL}/applications`, {
      method: 'POST', // The HTTP method to create a new resource.
      headers: {
        'Content-Type': 'application/json', // Specifies that we are sending JSON data.
        'Authorization': 'Bearer YOUR_AUTH_TOKEN', // A placeholder for user authentication.
      },
      body: JSON.stringify(applicationData), // Converts the JS object to a JSON string.
    });

    // Check if the response was successful (status code 200-299).
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response from the server.
    const result = await response.json();
    console.log('Successfully sent new application:', result);
    return result;
  } catch (error) {
    console.error('Failed to send new application:', error);
    // You might want to display a user-friendly error message here.
  }
}

// -------------------------------------------------------------------------
// 2. GET Requests: Retrieving data
// -------------------------------------------------------------------------

/**
 * Retrieves a list of all job applications for an employer.
 *
 * This function uses the **GET** method, which is the standard method for
 * requesting data from a specified resource. It typically doesn't have a body.
 *
 * @returns {Promise<Array<object>>} A promise that resolves to an array of application objects.
 */
async function getAllApplications() {
  try {
    const response = await fetch(`${BASE_URL}/applications`, {
      method: 'GET', // The HTTP method to retrieve a resource.
      headers: {
        'Authorization': 'Bearer YOUR_AUTH_TOKEN',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const applications = await response.json();
    console.log('Successfully retrieved all applications:', applications);
    return applications;
  } catch (error) {
    console.error('Failed to get applications:', error);
  }
}

/**
 * Retrieves the details for a single job application by its ID.
 *
 * This also uses the **GET** method, but with a specific ID in the URL path.
 *
 * @param {string} applicationId - The unique ID of the application to retrieve.
 * @returns {Promise<object>} A promise that resolves to the specific application object.
 */
async function getApplicationById(applicationId) {
  try {
    const response = await fetch(`${BASE_URL}/applications/${applicationId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_AUTH_TOKEN',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const application = await response.json();
    console.log(`Successfully retrieved application ${applicationId}:`, application);
    return application;
  } catch (error) {
    console.error(`Failed to get application ${applicationId}:`, error);
  }
}

// -------------------------------------------------------------------------
// 3. PUT Request: Updating an existing job application
// -------------------------------------------------------------------------

/**
 * Updates an existing job application.
 *
 * This function uses the **PUT** method to replace or update a resource.
 * The `applicationId` is used to specify which resource to update, and the
 * `updatedData` is sent in the body to replace the old data.
 *
 * Note: Some APIs use **PATCH** for partial updates, but **PUT** is commonly
 * used to replace the entire resource with the new data provided.
 *
 * @param {string} applicationId - The unique ID of the application to update.
 * @param {object} updatedData - An object with the new application data.
 * @param {string} updatedData.status - The new status of the application (e.g., 'Reviewed', 'Rejected').
 * @returns {Promise<object>} A promise that resolves to the updated application object.
 */
async function updateApplicationStatus(applicationId, updatedData) {
  try {
    const response = await fetch(`${BASE_URL}/applications/${applicationId}`, {
      method: 'PUT', // The HTTP method to update a resource.
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_AUTH_TOKEN',
      },
      body: JSON.stringify(updatedData), // The data to update with.
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Successfully updated application ${applicationId}:`, result);
    return result;
  } catch (error) {
    console.error(`Failed to update application ${applicationId}:`, error);
  }
}



// Student Profile Modal component - remains unchanged
const StudentProfileModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
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
    </div>
  );
};

// Company Profile component - Extracted to a new component for clarity
const CompanyProfile = ({ profile, isEditing, handleProfileChange, setIsEditing }) => {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          About Company
        </h1>
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

// Student Search and List component - Extracted for clarity
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


// Main App component for the employer dashboard
export default function App() {
  const [profile, setProfile] = useState(initialCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activePage, setActivePage] = useState('talentSearch'); // New state for page navigation
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  // Function to handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    // Handle nested contact object
    if (name === 'contact.email' || name === 'contact.phone') {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  // Filter students based on search query and status filter
  const filteredStudents = mockStudents.filter(student => {
    const matchesStatus = statusFilter === "All" || student.status === statusFilter;
    const matchesQuery =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col lg:flex-row">
      {/* Sidebar for navigation */}
      <aside className={`fixed lg:sticky top-0 h-full w-64 bg-white p-6 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between mb-8">
          <span className="text-2xl font-extrabold text-blue-600">FreeDash</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-blue-600">
            <X size={24} />
          </button>
        </div>
        <nav className="space-y-4">
          <button
            onClick={() => { setActivePage('talentSearch'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 p-3 rounded-xl font-semibold transition-all ${activePage === 'talentSearch' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Search size={20} /> Talent Search
          </button>
          <button
            onClick={() => { setActivePage('companyProfile'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 p-3 rounded-xl font-semibold transition-all ${activePage === 'companyProfile' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Briefcase size={20} /> My Company
          </button>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation Bar */}
        <header className="bg-white p-4 md:p-6 shadow-md rounded-b-3xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Mobile menu button and Logo */}
            <div className="flex items-center space-x-2">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-blue-600 mr-2">
                <Menu size={24} />
              </button>
              <span className="text-xl md:text-2xl font-extrabold text-blue-600 lg:hidden">FreeDash</span>
            </div>

            {/* Search bar and icons */}
            <div className="flex items-center space-x-4 md:space-x-6 w-full justify-end lg:justify-between">
              <div className="relative hidden md:block lg:w-96">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex items-center space-x-4 md:space-x-6">
                <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                  <Bell size={24} />
                </button>
                <button className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                  <Settings size={24} />
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm hidden sm:block">Hello, Jane Doe</span>
                  <img
                    src="https://placehold.co/40x40/D1D5DB/1F2937?text=JD"
                    alt="User Profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Main content based on active page */}
          <div className="max-w-7xl mx-auto">
            {activePage === 'talentSearch' && (
              <div className="grid grid-cols-1 gap-8">
                <TalentSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  filteredStudents={filteredStudents}
                  setSelectedStudent={setSelectedStudent}
                />
              </div>
            )}
            {activePage === 'companyProfile' && (
              <div className="grid grid-cols-1 gap-8">
                <CompanyProfile
                  profile={profile}
                  isEditing={isEditing}
                  handleProfileChange={handleProfileChange}
                  setIsEditing={setIsEditing}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Student Profile Modal */}
      <StudentProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
    </div>
  );
}
