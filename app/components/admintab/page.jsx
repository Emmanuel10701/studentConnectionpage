"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, Users, GraduationCap, Calendar, Zap, LayoutDashboard, 
  Send, ChevronRight, XCircle, User, Search, Briefcase, 
  Settings, LogOut, Trash2, Eye, Edit, UserPlus, Ban, 
  Plus, Newspaper, Video, Upload, Link, CheckCircle, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useForm } from 'react-hook-form';

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full m-4 border border-gray-200 animate-fade-in-down">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h4 className="text-xl font-bold text-gray-900">{title}</h4>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition-colors">
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

// --- Form Components ---
const AddUserForm = ({ onAdd, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    onAdd(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input 
          type="text" 
          {...register("name", { required: "Name is required" })} 
          className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          {...register("email", { required: "Email is required" })} 
          className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          {...register("role", { required: "Role is required" })}
          className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Role</option>
          <option value="Student">Student</option>
          <option value="Employer">Employer</option>
          <option value="Admin">Admin</option>
        </select>
        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors"
        >
          Add User
        </button>
      </div>
    </form>
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
      // Simulate an API call
      console.log('Simulating sending email:', data);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col transition-shadow hover:shadow-xl">
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
          className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
          <div className="flex items-center justify-center text-center p-4 bg-green-100 text-green-700 rounded-xl mt-auto transition-opacity duration-300 animate-fade-in">
            <span className="font-semibold">Email sent successfully!</span>
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center justify-center text-center p-4 bg-red-100 text-red-700 rounded-xl mt-auto transition-opacity duration-300 animate-fade-in">
            <span className="font-semibold">Failed to send email. Please try again.</span>
          </div>
        )}
      </form>
    </div>
  );
};

// --- Table Component ---
const UserManagementTable = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Memoize filtered users to avoid re-calculating on every render
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const lastUserIndex = currentPage * usersPerPage;
  const firstUserIndex = lastUserIndex - usersPerPage;
  const currentUsers = filteredUsers.slice(firstUserIndex, lastUserIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleManageUser = (user) => {
    setSelectedUser(user);
    setIsManageModalOpen(true);
  };
  
  const handleTerminateUser = (user) => {
    setUsers(prevUsers => 
        prevUsers.map(u => 
            u.id === user.id ? { ...u, role: 'Terminated', status: 'terminated' } : u
        )
    );
    setSelectedUser(null);
    setIsManageModalOpen(false);
  };
  
  const handleBlacklistUser = (user) => {
    setUsers(prevUsers =>
        prevUsers.map(u =>
            u.id === user.id ? { ...u, status: 'blacklisted' } : u
        )
    );
    setSelectedUser(null);
    setIsManageModalOpen(false);
  };

  const handleAddUser = (userData) => {
    setUsers(prevUsers => {
      const newId = Math.max(...prevUsers.map(u => u.id), 0) + 1;
      const newUser = {
        id: newId,
        ...userData,
        status: 'active'
      };
      return [...prevUsers, newUser];
    });
    setIsAddModalOpen(false);
  };
  
  const handleDeleteUserConfirmation = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 overflow-x-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">User Management</h3>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <UserPlus size={18} /> Add User
        </button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input 
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'Student' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Employer' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Admin' ? 'bg-gray-200 text-gray-800' :
                        'bg-red-100 text-red-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize 
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'blacklisted' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleManageUser(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Manage User"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUserConfirmation(user)}
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
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 rounded-xl">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
                  ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next <ChevronRightIcon size={16} />
          </button>
        </div>
      )}

      {/* Add User Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New User">
        <AddUserForm onAdd={handleAddUser} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Manage User Modal */}
      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Manage User">
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <User size={40} className="text-gray-500" />
              <div>
                <h4 className="text-xl font-bold">{selectedUser.name}</h4>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Current Role:</p>
                <p className="font-semibold capitalize">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Status:</p>
                <p className={`font-semibold capitalize text-sm ${selectedUser.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{selectedUser.status}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <p className="font-semibold text-gray-900">Admin Actions</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleTerminateUser(selectedUser)}
                  className="w-full sm:w-1/2 bg-red-100 text-red-700 hover:bg-red-200 transition-colors py-2 px-4 rounded-xl flex items-center justify-center gap-2"
                  disabled={selectedUser.role === 'Admin'}
                >
                  <Trash2 size={18} /> Terminate
                </button>
                <button
                  onClick={() => handleBlacklistUser(selectedUser)}
                  className="w-full sm:w-1/2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors py-2 px-4 rounded-xl flex items-center justify-center gap-2"
                  disabled={selectedUser.role === 'Admin'}
                >
                  <Ban size={18} /> Blacklist
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        {userToDelete && (
          <div className="space-y-4 text-center">
            <p className="text-gray-700">Are you sure you want to delete the user <span className="font-bold">{userToDelete.name}</span>?</p>
            <p className="text-sm text-red-500">This action cannot be undone.</p>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="px-6 py-2 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- Main App Component ---
// This component acts as the entry point and state manager.
const App = () => {
  const initialUsers = [
    { id: 1, name: 'Jane Doe', email: 'jane.d@example.com', role: 'Student', status: 'active' },
    { id: 2, name: 'John Smith', email: 'john.s@employer.com', role: 'Employer', status: 'active' },
    { id: 3, name: 'Emily White', email: 'emily.w@example.com', role: 'Student', status: 'active' },
    { id: 4, name: 'Alex Johnson', email: 'alex.j@admin.com', role: 'Admin', status: 'active' },
    { id: 5, name: 'Sarah Kim', email: 'sarah.k@employer.com', role: 'Employer', status: 'active' },
    { id: 6, name: 'Mike Ross', email: 'mike.r@example.com', role: 'Student', status: 'active' },
    { id: 7, name: 'Jessica Pearson', email: 'jessica.p@employer.com', role: 'Employer', status: 'active' },
    { id: 8, name: 'Harvey Specter', email: 'harvey.s@employer.com', role: 'Employer', status: 'active' },
    { id: 9, name: 'Rachel Zane', email: 'rachel.z@example.com', role: 'Student', status: 'active' },
    { id: 10, name: 'Donna Paulsen', email: 'donna.p@admin.com', role: 'Admin', status: 'active' },
    { id: 11, name: 'Louis Litt', email: 'louis.l@employer.com', role: 'Employer', status: 'active' },
    { id: 12, name: 'Katrina Bennett', email: 'katrina.b@example.com', role: 'Student', status: 'active' },
    { id: 13, name: 'Scottie Barnes', email: 'scottie.b@employer.com', role: 'Employer', status: 'active' },
    { id: 14, name: 'Anabel White', email: 'anabel.w@example.com', role: 'Student', status: 'active' },
    { id: 15, name: 'James Evans', email: 'james.e@example.com', role: 'Student', status: 'active' },
    { id: 16, name: 'Olivia Brown', email: 'olivia.b@employer.com', role: 'Employer', status: 'active' },
    { id: 17, name: 'Daniel Miller', email: 'daniel.m@example.com', role: 'Student', status: 'active' },
    { id: 18, name: 'Sophia Wilson', email: 'sophia.w@employer.com', role: 'Employer', status: 'active' },
  ];
  
  const [users, setUsers] = useState(initialUsers);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Manage users and send communications from a single place.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <EmailForm />
        <UserManagementTable users={users} setUsers={setUsers} />
      </div>
    </div>
  );
};

export default App;
