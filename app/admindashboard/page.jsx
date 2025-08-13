"use client";
import React, { useState, useEffect } from 'react';
import { 
  Mail, Users, GraduationCap, Calendar, Zap, LayoutDashboard, 
  Send, ChevronRight, XCircle, User, Search, Briefcase, 
  Settings, LogOut, Trash2, Eye, Edit
} from 'lucide-react';
import { useForm } from 'react-hook-form';

// --- MOCK DATA ---
const dashboardMetrics = [
  { id: 1, title: 'Total Students', value: 2500, icon: GraduationCap, color: 'bg-blue-100 text-blue-600' },
  { id: 2, title: 'Total Employers', value: 150, icon: Briefcase, color: 'bg-purple-100 text-purple-600' },
  { id: 3, title: 'Upcoming Events', value: 5, icon: Calendar, color: 'bg-green-100 text-green-600' },
  { id: 4, title: 'Notifications Sent', value: 789, icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
];

const mockUsers = [
  { id: 1, name: 'Jane Doe', email: 'jane.d@example.com', role: 'Student' },
  { id: 2, name: 'John Smith', email: 'john.s@employer.com', role: 'Employer' },
  { id: 3, name: 'Emily White', email: 'emily.w@example.com', role: 'Student' },
  { id: 4, name: 'Alex Johnson', email: 'alex.j@admin.com', role: 'Admin' },
  { id: 5, name: 'Sarah Kim', email: 'sarah.k@employer.com', role: 'Employer' },
  { id: 6, name: 'Mike Ross', email: 'mike.r@example.com', role: 'Student' },
  { id: 7, name: 'Jessica Pearson', email: 'jessica.p@employer.com', role: 'Employer' },
];

const recentActivity = [
  { id: 1, text: 'Jane Doe registered as a new student.', time: '2 hours ago' },
  { id: 2, text: 'John Smith updated their company profile.', time: '4 hours ago' },
  { id: 3, text: 'New career fair event "Tech Horizons" created.', time: '1 day ago' },
  { id: 4, text: 'Emily White submitted her resume for review.', time: '2 days ago' },
];

// --- COMPONENTS ---

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full m-4 border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h4 className="text-xl font-bold text-gray-900">{title}</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

const EmailForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null);

  const onSubmit = async (data) => {
    setIsSending(true);
    setStatus(null);
    try {
      // API call to a hypothetical backend endpoint for sending emails
      const response = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      console.log('Email API response:', result);
      setStatus('success');
      reset();
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Send Email to Users</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-grow flex flex-col">
        <div>
          <label htmlFor="audience" className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
          <select 
            id="audience"
            {...register("audience", { required: "Please select an audience" })} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          >
            <option value="">Select an audience...</option>
            <option value="all">All Users</option>
            <option value="students">Students</option>
            <option value="employers">Employers</option>
          </select>
          {errors.audience && <p className="mt-1 text-sm text-red-500">{errors.audience.message}</p>}
        </div>
        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">From</label>
          <input 
            type="email" 
            id="from" 
            {...register("from", { required: "Sender's email is required" })} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            placeholder="sender@example.com"
          />
          {errors.from && <p className="mt-1 text-sm text-red-500">{errors.from.message}</p>}
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input 
            type="text" 
            id="subject" 
            {...register("subject", { required: "Email subject is required" })} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            placeholder="e.g., Important System Update"
          />
          {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
        </div>
        <div className="flex-grow">
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            id="message" 
            rows="5"
            {...register("message", { required: "Message is required" })} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow flex-grow resize-y"
            placeholder="Write your email message here..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
        </div>
        <button 
          type="submit" 
          disabled={isSending}
          className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <Send size={18} /> Send Email
            </>
          )}
        </button>
        {status === 'success' && (
          <div className="flex items-center justify-center text-center p-4 bg-green-100 text-green-700 rounded-xl mt-auto">
            <span className="font-semibold">Email sent successfully!</span>
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center justify-center text-center p-4 bg-red-100 text-red-700 rounded-xl mt-auto">
            <span className="font-semibold">Failed to send email. Please try again.</span>
          </div>
        )}
      </form>
    </div>
  );
};

const UserManagementTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    // A more complete implementation would have a state for the delete modal
    console.log(`Simulating delete for user ID: ${userId}`);
    // Here you would typically open a custom confirmation modal
    // instead of using window.confirm
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 overflow-x-auto h-full flex flex-col">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">User Management</h3>
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input 
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'Student' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Employer' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="User Details">
        {selectedUser && (
          <div className="space-y-4 text-gray-700">
            <p><strong className="font-semibold text-gray-900">Name:</strong> {selectedUser.name}</p>
            <p><strong className="font-semibold text-gray-900">Email:</strong> {selectedUser.email}</p>
            <p><strong className="font-semibold text-gray-900">Role:</strong> {selectedUser.role}</p>
            <p className="mt-4 text-sm text-gray-500">
              This is a simulated view. In a real application, more details like registration date, activity log, etc., would be displayed here.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

const DashboardOverview = () => (
  <>
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Dashboard Overview</h1>
    </header>
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {dashboardMetrics.map(metric => (
        <div key={metric.id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between transition-transform duration-200 hover:scale-105">
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">{metric.title}</p>
            <h2 className="text-3xl font-bold text-gray-900">{metric.value}</h2>
          </div>
          <div className={`p-3 rounded-full ${metric.color}`}>
            <metric.icon size={28} />
          </div>
        </div>
      ))}
    </section>
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <EmailForm />
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <ul className="space-y-4">
          {recentActivity.map(activity => (
            <li key={activity.id} className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <div>
                <p className="text-gray-800">{activity.text}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
);

export default function CareerConnectApp() {
  const [view, setView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: Users },
  ];

  const renderContent = () => {
    switch(view) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'user-management':
        return (
          <>
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">User Management</h1>
            </header>
            <UserManagementTable />
          </>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 flex flex-col md:flex-row">
      {/* Sidebar - Mobile Toggle */}
      <div className="p-4 md:hidden flex justify-between items-center bg-white shadow-sm">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="text-blue-600" size={24} />
          <span className="text-xl font-extrabold text-blue-600">Admin Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-blue-600">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile View */}
      <aside className={`${isSidebarOpen ? 'block' : 'hidden'} md:block w-64 bg-white p-6 shadow-xl md:rounded-r-3xl md:sticky top-0 h-screen overflow-y-auto`}>
        <div className="flex items-center space-x-2 mb-8">
          <LayoutDashboard className="text-blue-600" size={32} />
          <span className="text-2xl font-extrabold text-blue-600">
            Admin Portal
          </span>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500 hover:text-gray-900 ml-auto transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            {navigationItems.map(item => (
              <li key={item.id}>
                <a 
                  href="#"
                  onClick={() => { setView(item.id); setIsSidebarOpen(false); }}
                  className={`flex items-center p-3 rounded-xl font-semibold transition-colors
                    ${view === item.id ? 'text-white bg-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <item.icon className="mr-3" size={20} />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-end items-center mb-8 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <img
                            src="https://placehold.co/40x40/D1D5DB/1F2937?text=AD"
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                        />
                        <span className="font-semibold text-sm hidden md:block">Admin User</span>
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10 transition-opacity duration-200">
                            <div className="py-2">
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    <User size={16} className="mr-2" /> Profile
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    <Settings size={16} className="mr-2" /> Settings
                                </a>
                                <div className="border-t border-gray-100 my-2"></div>
                                <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <LogOut size={16} className="mr-2" /> Logout
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
