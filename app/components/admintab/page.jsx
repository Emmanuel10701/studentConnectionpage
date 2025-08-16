'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Mail, Users, GraduationCap, Calendar, Zap, LayoutDashboard, 
  Send, ChevronRight, XCircle, User, Search, Briefcase, 
  Settings, LogOut, Trash2, Eye, Edit, UserPlus, Ban, 
  Plus, Newspaper, Video, Upload, Link, CheckCircle, ChevronLeft, ChevronRight as ChevronRightIcon,
  Crown, Book, Building, UserCheck, UserX, Square, CheckSquare
} from 'lucide-react';
import { useForm } from 'react-hook-form';

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef();

  // Effect to handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        ref={modalRef} 
        className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl max-w-2xl w-full m-4 border border-gray-200 animate-fade-in-down transition-transform duration-300"
      >
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
const AddAdminForm = ({ onAdd, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    // Add role and created at timestamp before submitting
    const newAdminData = {
      ...data,
      role: "Admin",
      status: "active",
      createdAt: new Date().toISOString()
    };
    onAdd(newAdminData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            {...register("password", { required: "Password is required" })} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input 
            type="tel" 
            {...register("phoneNumber")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input 
            type="text" 
            {...register("department")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title/Position</label>
          <input 
            type="text" 
            {...register("title")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Access Level</label>
          <input 
            type="text" 
            {...register("accessLevel")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input 
            type="text" 
            {...register("street")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input 
            type="text" 
            {...register("city")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input 
            type="text" 
            {...register("postalCode")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input 
            type="text" 
            {...register("country")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <input 
            type="text" 
            value="Admin"
            readOnly
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
          />
        </div>
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
          Add Admin
        </button>
      </div>
    </form>
  );
};

const EditAdminForm = ({ admin, onUpdate, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: admin,
  });

  const onSubmit = (data) => {
    // Only pass back the changed data
    onUpdate({ ...admin, ...data });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input 
            type="tel" 
            {...register("phoneNumber")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input 
            type="text" 
            {...register("department")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Title/Position</label>
          <input 
            type="text" 
            {...register("title")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Access Level</label>
          <input 
            type="text" 
            {...register("accessLevel")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Street</label>
          <input 
            type="text" 
            {...register("street")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input 
            type="text" 
            {...register("city")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Postal Code</label>
          <input 
            type="text" 
            {...register("postalCode")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input 
            type="text" 
            {...register("country")} 
            className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
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
          Update Admin
        </button>
      </div>
    </form>
  );
};

// --- Email Form Component ---
const SendEmailForm = ({ user, onSend, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = (data) => {
    onSend(user, data.subject, data.body);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-gray-700 text-lg font-semibold">To: <span className="font-bold text-gray-900">{user.email}</span></p>
      <div>
        <label className="block text-sm font-medium text-gray-700">Subject</label>
        <input 
          type="text" 
          {...register("subject", { required: "Subject is required" })} 
          className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <textarea 
          rows="5"
          {...register("body", { required: "Message body is required" })} 
          className="mt-1 w-full p-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body.message}</p>}
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
          className="bg-green-600 text-white font-bold py-2 px-4 rounded-full hover:bg-green-700 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Send size={18} /> Send Email
          </div>
        </button>
      </div>
    </form>
  );
};

// --- Table Component ---
const UserManagementTable = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('Admins'); // New state for tabs
  const usersPerPage = 10;

  const userRoles = {
    'Admins': 'Admin',
    'Subscribers': 'Subscriber',
    'Students/Job Seekers': 'Student',
    'Employers': 'Employer'
  };

  // Memoize filtered users to avoid re-calculating on every render
  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.role === userRoles[activeTab] &&
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm, activeTab]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const lastUserIndex = currentPage * usersPerPage;
  const firstUserIndex = lastUserIndex - usersPerPage;
  const currentUsers = filteredUsers.slice(firstUserIndex, lastUserIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm(''); // Reset search when changing tabs
    setCurrentPage(1); // Reset pagination when changing tabs
  };

  const handleSendEmail = (user) => {
    setSelectedUser(user);
    setIsEmailModalOpen(true);
  };

  const handleEmailSend = (user, subject, body) => {
    console.log(`Sending email to ${user.email} with subject "${subject}" and body: "${body}"`);
    alert(`Simulating email send to ${user.email}.`);
    setIsEmailModalOpen(false);
    setSelectedUser(null);
  };

  const handleManageUser = (user) => {
    setSelectedUser(user);
    if (user.role === 'Admin') {
      setIsEditAdminModalOpen(true);
    } else {
      setIsManageModalOpen(true);
    }
  };
  
  const handleUpdateAdmin = (updatedData) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === updatedData.id ? { ...u, ...updatedData } : u)
    );
    setIsEditAdminModalOpen(false);
    setSelectedUser(null);
  };

  const handleTerminateUser = (user) => {
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === user.id ? { ...u, status: 'terminated' } : u)
    );
    setSelectedUser(null);
    setIsManageModalOpen(false);
  };
  
  const handleBlockUser = (user) => {
    setUsers(prevUsers =>
      prevUsers.map(u => u.id === user.id ? { ...u, status: 'blocked' } : u)
    );
    setSelectedUser(null);
    setIsManageModalOpen(false);
  };
  
  const handleUndoTermination = (user) => {
    setUsers(prevUsers =>
      prevUsers.map(u => u.id === user.id ? { ...u, status: 'active' } : u)
    );
    setSelectedUser(null);
    setIsManageModalOpen(false);
  };

  const handleAddAdmin = (userData) => {
    setUsers(prevUsers => {
      const newId = Math.max(...prevUsers.map(u => u.id), 0) + 1;
      const newUser = {
        id: newId,
        ...userData
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
    <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-lg border border-gray-100 overflow-x-auto h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 pb-4 sm:pb-6 -mt-4 sm:-mt-8 -mx-4 sm:-mx-8 px-4 sm:px-8 pt-4 sm:pt-8 rounded-t-3xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">User Management</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={18} /> Add New Admin
            </button>
          </div>
        </div>
      
        {/* Tabs for user categories */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {Object.keys(userRoles).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-t-xl text-sm font-semibold transition-colors duration-200 ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input 
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()} by name or email...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-x-auto -mt-6">
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
                        user.role === 'Subscriber' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize 
                      ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'blocked' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <button 
                        onClick={() => handleSendEmail(user)}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Send Email"
                      >
                        <Mail size={18} />
                      </button>
                      <button 
                        onClick={() => handleManageUser(user)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Manage/Edit User"
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
                  No users found in this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-3 bg-gray-50 rounded-xl">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed mb-2 sm:mb-0"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="flex flex-wrap justify-center items-center space-x-2">
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
            className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed mt-2 sm:mt-0"
          >
            Next <ChevronRightIcon size={16} />
          </button>
        </div>
      )}

      {/* Add Admin Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Admin">
        <AddAdminForm onAdd={handleAddAdmin} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>
      
      {/* Edit Admin Modal */}
      <Modal isOpen={isEditAdminModalOpen} onClose={() => setIsEditAdminModalOpen(false)} title="Edit Admin Details">
        {selectedUser && <EditAdminForm admin={selectedUser} onUpdate={handleUpdateAdmin} onCancel={() => setIsEditAdminModalOpen(false)} />}
      </Modal>

      {/* Send Email Modal */}
      <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title="Send Email Notification">
        {selectedUser && <SendEmailForm user={selectedUser} onSend={handleEmailSend} onCancel={() => setIsEmailModalOpen(false)} />}
      </Modal>

      {/* Manage User Modal (for students/employers) */}
      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title={`Manage ${selectedUser?.role}`}>
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <User size={40} className="text-gray-500" />
              <div>
                <h4 className="text-xl font-bold">{selectedUser.name}</h4>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                <p className="text-sm text-gray-500 capitalize">Role: {selectedUser.role}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <p className="font-semibold text-gray-900">Admin Actions</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => handleTerminateUser(selectedUser)}
                  className="w-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors py-2 px-4 rounded-xl flex items-center justify-center gap-2"
                  disabled={selectedUser.status === 'terminated'}
                >
                  <UserX size={18} /> {selectedUser.status === 'terminated' ? 'Already Terminated' : 'Terminate'}
                </button>
                <button
                  onClick={() => handleBlockUser(selectedUser)}
                  className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors py-2 px-4 rounded-xl flex items-center justify-center gap-2"
                  disabled={selectedUser.status === 'blocked'}
                >
                  <Ban size={18} /> {selectedUser.status === 'blocked' ? 'Already Blocked' : 'Block'}
                </button>
                <button
                  onClick={() => handleUndoTermination(selectedUser)}
                  className="w-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors py-2 px-4 rounded-xl flex items-center justify-center gap-2"
                  disabled={selectedUser.status === 'active'}
                >
                  <UserCheck size={18} /> Undo Termination
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
    // Admins
    { id: 1, name: 'Alex Johnson', email: 'alex.j@admin.com', role: 'Admin', status: 'active', department: 'IT', title: 'Lead Administrator', accessLevel: 'Full', phoneNumber: '555-0101', street: '123 Admin Way', city: 'Admin City', postalCode: '90210', country: 'USA', createdAt: '2023-01-15T10:00:00Z' },
    { id: 2, name: 'Donna Paulsen', email: 'donna.p@admin.com', role: 'Admin', status: 'active', department: 'Operations', title: 'COO', accessLevel: 'Full', phoneNumber: '555-0102', street: '456 Operations Ave', city: 'Businessburg', postalCode: '10001', country: 'USA', createdAt: '2023-02-20T11:00:00Z' },
    // Subscribers
    { id: 3, name: 'Sarah Kim', email: 'sarah.k@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-01T12:00:00Z' },
    { id: 4, name: 'Mike Ross', email: 'mike.r@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-05T13:00:00Z' },
    { id: 11, name: 'Subbie One', email: 'sub.one@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-05T13:00:00Z' },
    { id: 12, name: 'Subbie Two', email: 'sub.two@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-05T13:00:00Z' },
    { id: 13, name: 'Subbie Three', email: 'sub.three@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-05T13:00:00Z' },
    { id: 14, name: 'Subbie Four', email: 'sub.four@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-05T13:00:00Z' },
    { id: 15, name: 'Subbie Five', email: 'sub.five@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-05T13:00:00Z' },
    { id: 16, name: 'Subbie Six', email: 'sub.six@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-05T13:00:00Z' },
    { id: 17, name: 'Subbie Seven', email: 'sub.seven@example.com', role: 'Subscriber', status: 'active', department: null, title: null, accessLevel: 'Basic', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-03-05T13:00:00Z' },
    // Students/Job Seekers
    { id: 5, name: 'Jane Doe', email: 'jane.d@example.com', role: 'Student', status: 'active', department: null, title: 'Job Seeker', accessLevel: 'User', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-04-10T14:00:00Z' },
    { id: 6, name: 'Emily White', email: 'emily.w@example.com', role: 'Student', status: 'active', department: null, title: 'Job Seeker', accessLevel: 'User', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-04-12T15:00:00Z' },
    { id: 7, name: 'Rachel Zane', email: 'rachel.z@example.com', role: 'Student', status: 'terminated', department: null, title: 'Job Seeker', accessLevel: 'User', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-04-15T16:00:00Z' },
    { id: 18, name: 'Student One', email: 'student.one@example.com', role: 'Student', status: 'active', department: null, title: 'Job Seeker', accessLevel: 'User', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-04-10T14:00:00Z' },
    { id: 19, name: 'Student Two', email: 'student.two@example.com', role: 'Student', status: 'active', department: null, title: 'Job Seeker', accessLevel: 'User', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-04-10T14:00:00Z' },
    { id: 20, name: 'Student Three', email: 'student.three@example.com', role: 'Student', status: 'active', department: null, title: 'Job Seeker', accessLevel: 'User', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-04-10T14:00:00Z' },
    { id: 21, name: 'Student Four', email: 'student.four@example.com', role: 'Student', status: 'active', department: null, title: 'Job Seeker', accessLevel: 'User', phoneNumber: null, street: null, city: null, postalCode: null, country: null, createdAt: '2023-04-10T14:00:00Z' },
    // Employers
    { id: 8, name: 'John Smith', email: 'john.s@employer.com', role: 'Employer', status: 'active', department: 'Hiring', title: 'Hiring Manager', accessLevel: 'User', phoneNumber: '555-0200', street: '789 Business Blvd', city: 'Corp City', postalCode: '20002', country: 'USA', createdAt: '2023-05-01T17:00:00Z' },
    { id: 9, name: 'Jessica Pearson', email: 'jessica.p@employer.com', role: 'Employer', status: 'active', department: 'Legal', title: 'CEO', accessLevel: 'User', phoneNumber: '555-0201', street: '101 Legal St', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-05T18:00:00Z' },
    { id: 10, name: 'Harvey Specter', email: 'harvey.s@employer.com', role: 'Employer', status: 'blocked', department: 'Legal', title: 'Senior Partner', accessLevel: 'User', phoneNumber: '555-0202', street: '111 Fifth Ave', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-10T19:00:00Z' },
    { id: 22, name: 'Employer One', email: 'employer.one@employer.com', role: 'Employer', status: 'active', department: 'Hiring', title: 'Hiring Manager', accessLevel: 'User', phoneNumber: '555-0200', street: '789 Business Blvd', city: 'Corp City', postalCode: '20002', country: 'USA', createdAt: '2023-05-01T17:00:00Z' },
    { id: 23, name: 'Employer Two', email: 'employer.two@employer.com', role: 'Employer', status: 'active', department: 'Legal', title: 'CEO', accessLevel: 'User', phoneNumber: '555-0201', street: '101 Legal St', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-05T18:00:00Z' },
    { id: 24, name: 'Employer Three', email: 'employer.three@employer.com', role: 'Employer', status: 'blocked', department: 'Legal', title: 'Senior Partner', accessLevel: 'User', phoneNumber: '555-0202', street: '111 Fifth Ave', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-10T19:00:00Z' },
     { id: 9, name: 'Jessica Pearson', email: 'jessica.p@employer.com', role: 'Employer', status: 'active', department: 'Legal', title: 'CEO', accessLevel: 'User', phoneNumber: '555-0201', street: '101 Legal St', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-05T18:00:00Z' },
    { id: 10, name: 'Harvey Specter', email: 'harvey.s@employer.com', role: 'Employer', status: 'blocked', department: 'Legal', title: 'Senior Partner', accessLevel: 'User', phoneNumber: '555-0202', street: '111 Fifth Ave', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-10T19:00:00Z' },
    { id: 22, name: 'Employer One', email: 'employer.one@employer.com', role: 'Employer', status: 'active', department: 'Hiring', title: 'Hiring Manager', accessLevel: 'User', phoneNumber: '555-0200', street: '789 Business Blvd', city: 'Corp City', postalCode: '20002', country: 'USA', createdAt: '2023-05-01T17:00:00Z' },
    { id: 23, name: 'Employer Two', email: 'employer.two@employer.com', role: 'Employer', status: 'active', department: 'Legal', title: 'CEO', accessLevel: 'User', phoneNumber: '555-0201', street: '101 Legal St', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-05T18:00:00Z' },
    { id: 24, name: 'Employer Three', email: 'employer.three@employer.com', role: 'Employer', status: 'blocked', department: 'Legal', title: 'Senior Partner', accessLevel: 'User', phoneNumber: '555-0202', street: '111 Fifth Ave', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-10T19:00:00Z' },
   { id: 9, name: 'Jessica Pearson', email: 'jessica.p@employer.com', role: 'Employer', status: 'active', department: 'Legal', title: 'CEO', accessLevel: 'User', phoneNumber: '555-0201', street: '101 Legal St', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-05T18:00:00Z' },
    { id: 10, name: 'Harvey Specter', email: 'harvey.s@employer.com', role: 'Employer', status: 'blocked', department: 'Legal', title: 'Senior Partner', accessLevel: 'User', phoneNumber: '555-0202', street: '111 Fifth Ave', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-10T19:00:00Z' },
    { id: 22, name: 'Employer One', email: 'employer.one@employer.com', role: 'Employer', status: 'active', department: 'Hiring', title: 'Hiring Manager', accessLevel: 'User', phoneNumber: '555-0200', street: '789 Business Blvd', city: 'Corp City', postalCode: '20002', country: 'USA', createdAt: '2023-05-01T17:00:00Z' },
    { id: 23, name: 'Employer Two', email: 'employer.two@employer.com', role: 'Employer', status: 'active', department: 'Legal', title: 'CEO', accessLevel: 'User', phoneNumber: '555-0201', street: '101 Legal St', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-05T18:00:00Z' },
    { id: 24, name: 'Employer Three', email: 'employer.three@employer.com', role: 'Employer', status: 'blocked', department: 'Legal', title: 'Senior Partner', accessLevel: 'User', phoneNumber: '555-0202', street: '111 Fifth Ave', city: 'Lawton', postalCode: '30003', country: 'USA', createdAt: '2023-05-10T19:00:00Z' },

  ];
  
  const [users, setUsers] = useState(initialUsers);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
      <div className="sticky top-0 bg-gray-50 z-20 pb-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage user accounts from a single place.</p>
      </div>
      
      <UserManagementTable users={users} setUsers={setUsers} />
    </div>
  );
};

export default App;
