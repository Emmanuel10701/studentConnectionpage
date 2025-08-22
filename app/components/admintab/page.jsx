'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Mail, Users, GraduationCap, Calendar, Zap, LayoutDashboard,
  Send, ChevronRight, XCircle, User, Search, Briefcase,
  Settings, LogOut, Trash2, Eye, Edit, UserPlus,
  Plus, Newspaper, Video, Upload, Link, CheckCircle, ChevronLeft, ChevronRight as ChevronRightIcon,
  Crown, Book, Building, UserCheck, UserX, Square, CheckSquare, Info,
  Filter, MoreVertical, Download, RefreshCw
} from 'lucide-react';
import { useForm } from 'react-hook-form';

// --- Custom Fonts ---
const customFonts = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
`;

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef();

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
        className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-2xl w-full m-4 border border-gray-200 animate-fade-in-down transition-transform duration-300 font-sans"
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h4 className="text-xl font-bold text-gray-900 font-display">{title}</h4>
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
    const newAdminData = {
      ...data,
      role: "ADMIN",
      status: "active",
      createdAt: new Date().toISOString()
    };
    onAdd(newAdminData);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Full Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Phone Number</label>
          <input
            type="tel"
            {...register("phoneNumber")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Department</label>
          <input
            type="text"
            {...register("department")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Title/Position</label>
          <input
            type="text"
            {...register("title")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Access Level</label>
          <select
            {...register("accessLevel")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="Basic">Basic</option>
            <option value="Moderate">Moderate</option>
            <option value="Full">Full</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Street</label>
          <input
            type="text"
            {...register("street")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">City</label>
          <input
            type="text"
            {...register("city")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Postal Code</label>
          <input
            type="text"
            {...register("postalCode")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Country</label>
          <input
            type="text"
            {...register("country")}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-display">Role</label>
          <input
            type="text"
            value="Admin"
            readOnly
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Add Admin
        </button>
      </div>
    </form>
  );
};

// --- View Details Component ---
const UserDetails = ({ user }) => {
  if (!user) {
    return <p>No user selected.</p>;
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-4 text-gray-800 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1 font-display">Full Name</p>
          <p className="font-semibold text-lg">{user.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1 font-display">Email</p>
          <p className="text-blue-600 font-semibold">{user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1 font-display">Role</p>
          <p className="font-semibold">{user.role}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1 font-display">Status</p>
          <p className="font-semibold capitalize text-green-600">{user.status}</p>
        </div>
        {user.department && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1 font-display">Department</p>
            <p className="font-semibold">{user.department}</p>
          </div>
        )}
        {user.title && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1 font-display">Title/Position</p>
            <p className="font-semibold">{user.title}</p>
          </div>
        )}
        {user.accessLevel && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1 font-display">Access Level</p>
            <p className="font-semibold">{user.accessLevel}</p>
          </div>
        )}
        {user.phoneNumber && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1 font-display">Phone Number</p>
            <p className="font-semibold">{user.phoneNumber}</p>
          </div>
        )}
        {(user.street || user.city || user.postalCode || user.country) && (
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm font-medium text-gray-500 mb-1 font-display">Address</p>
            <p className="font-semibold">
              {user.street}, {user.city}, {user.postalCode}, {user.country}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1 font-display">Created On</p>
          <p className="font-semibold">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};

// --- UserManagementTable Component ---
const UserManagementTable = ({ users, setUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditAdminModalOpen, setIsEditAdminModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('Admins');
  const usersPerPage = 10;

  const userRoles = {
    'Admins': 'ADMIN',
    'Subscribers': 'Subscriber',
    'Students/Job Seekers': ['Student', 'Job Seeker'],
    'Employers': 'Employer'
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const roleFilter = userRoles[activeTab];
      const isCorrectRole = Array.isArray(roleFilter)
        ? roleFilter.includes(user.role)
        : user.role === roleFilter;

      return isCorrectRole &&
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [users, searchTerm, activeTab]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const lastUserIndex = currentPage * usersPerPage;
  const firstUserIndex = lastUserIndex - usersPerPage;
  const currentUsers = filteredUsers.slice(firstUserIndex, lastUserIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleAddAdmin = async (userData) => {
    try {
      const response = await fetch('http://localhost:3000/api/adminregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Failed to add admin.');
      }

      const newAdmin = await response.json();
      setUsers(prevUsers => [...prevUsers, { ...newAdmin, role: 'ADMIN' }]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Failed to add new admin. Please try again.');
    }
  };

  const handleDeleteUserConfirmation = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      const { id, role } = userToDelete;
      let endpoint;

      switch (role) {
        case 'ADMIN':
          endpoint = `http://localhost:3000/api/adminregister/${id}`;
          break;
        case 'Subscriber':
          endpoint = `http://localhost:3000/api/subscriber/${id}`;
          break;
        case 'Employer':
          endpoint = `http://localhost:3000/api/employer/${id}`;
          break;
        case 'Student':
        case 'Job Seeker':
          endpoint = `http://localhost:3000/api/student/${id}`;
          break;
        default:
          console.error("Unknown user role:", role);
          alert("Cannot delete user with unknown role.");
          setIsDeleteModalOpen(false);
          return;
      }

      try {
        const response = await fetch(endpoint, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete the user.');
        }

        setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-x-auto h-full flex flex-col font-sans">
      <style jsx global>{customFonts}</style>
      
      <div className="sticky top-0 bg-white z-10 pb-6 -mt-6 -mx-6 px-6 pt-6 rounded-t-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1 font-display">User Management</h3>
            <p className="text-gray-500 text-sm">Manage all users across your platform</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button className="w-full sm:w-auto bg-white text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
              <Filter size={16} />
              Filter
            </button>
            <button className="w-full sm:w-auto bg-white text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
              <Download size={16} />
              Export
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full sm:w-auto bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <UserPlus size={16} /> Add New Admin
            </button>
          </div>
        </div>

        {/* Tabs for user categories */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {Object.keys(userRoles).map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-3 rounded-t-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              } font-display`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search ${activeTab.toLowerCase()} by name or email...`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow font-sans"
            />
          </div>
          <button className="bg-white text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-x-auto -mt-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-display">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-display">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-display">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-display">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-display">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 font-display">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.role === 'Student' || user.role === 'Job Seeker' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Employer' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'ADMIN' ? 'bg-gray-200 text-gray-800' :
                            user.role === 'Subscriber' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-yellow-100 text-yellow-800'} font-display`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize bg-green-100 text-green-800 font-display">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer p-1 rounded hover:bg-gray-100"
                        title="View User Details"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-green-600 hover:text-green-900 transition-colors cursor-pointer p-1 rounded hover:bg-gray-100"
                        title="Send Email"
                      >
                        <Mail size={18} />
                      </a>
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUserConfirmation(user)}
                          className="text-red-600 hover:text-red-900 transition-colors cursor-pointer p-1 rounded hover:bg-gray-100"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer p-1 rounded hover:bg-gray-100">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Users size={48} className="mb-3 opacity-50" />
                    <p className="font-medium">No users found in this category.</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-4 py-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-semibold">{firstUserIndex + 1}</span> to <span className="font-semibold">
              {Math.min(lastUserIndex, filteredUsers.length)}
            </span> of <span className="font-semibold">{filteredUsers.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                    ${currentPage === index + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-all"
            >
              Next <ChevronRightIcon size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Admin">
        <AddAdminForm onAdd={handleAddAdmin} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* View User Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="User Details">
        <UserDetails user={selectedUser} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        {userToDelete && (
          <div className="space-y-4 text-center font-sans">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 font-display">Delete User</h3>
            <p className="text-gray-700">Are you sure you want to delete the user <span className="font-bold">{userToDelete.name}</span>?</p>
            <p className="text-sm text-red-500">This action cannot be undone.</p>
            <div className="flex justify-center gap-4 mt-6">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all font-medium">
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all shadow-md hover:shadow-lg">
                Delete User
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- Main App Component ---
const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const [adminRes, subscriberRes, employerRes, studentRes] = await Promise.all([
          fetch('http://localhost:3000/api/adminregister'),
          fetch('http://localhost:3000/api/subscriber'),
          fetch('http://localhost:3000/api/employer'),
          fetch('http://localhost:3000/api/student')
        ]);

        if (!adminRes.ok || !subscriberRes.ok || !employerRes.ok || !studentRes.ok) {
          throw new Error('Failed to fetch data from one or more APIs');
        }

        const admins = await adminRes.json();
        const subscribers = await subscriberRes.json();
        const employerData = await employerRes.json();
        const students = await studentRes.json();
        const employers = employerData.employers;

        const allUsers = [
          ...admins.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            department: user.department,
            title: user.title,
            accessLevel: user.accessLevel,
            phoneNumber: user.phoneNumber,
            street: user.street,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
            createdAt: user.createdAt,
          })),
          ...subscribers.map(user => ({
            id: user.id,
            name: user.email.split('@')[0],
            email: user.email,
            role: 'Subscriber',
            status: 'active',
            department: null,
            title: null,
            accessLevel: 'Basic',
            phoneNumber: null,
            street: null,
            city: null,
            postalCode: null,
            country: null,
            createdAt: user.createdAt,
          })),
          ...employers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'Employer',
            status: 'active',
            department: user.employerProfile?.industry,
            title: user.employerProfile?.position,
            accessLevel: 'Premium',
            phoneNumber: user.employerProfile?.phone,
            street: user.employerProfile?.company?.street,
            city: user.employerProfile?.company?.city,
            postalCode: user.employerProfile?.company?.postalCode,
            country: user.employerProfile?.company?.country,
            createdAt: user.createdAt,
          })),
          ...students.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.studentProfile?.studentStatus || 'Student',
            status: 'active',
            department: user.studentProfile?.fieldOfStudy,
            title: user.studentProfile?.studentStatus,
            accessLevel: 'Basic',
            phoneNumber: user.studentProfile?.phone,
            street: null,
            city: null,
            postalCode: null,
            country: null,
            createdAt: user.createdAt,
          }))
        ];

        setUsers(allUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-700 font-display">Loading user data...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <XCircle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-red-800 font-display">Error Loading Data</h3>
        <p className="mt-2 text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <style jsx global>{customFonts}</style>
      <UserManagementTable users={users} setUsers={setUsers} />
    </div>
  );
};

export default App;