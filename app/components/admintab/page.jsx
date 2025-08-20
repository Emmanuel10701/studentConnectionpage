'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Mail, Users, GraduationCap, Calendar, Zap, LayoutDashboard,
  Send, ChevronRight, XCircle, User, Search, Briefcase,
  Settings, LogOut, Trash2, Eye, Edit, UserPlus,
  Plus, Newspaper, Video, Upload, Link, CheckCircle, ChevronLeft, ChevronRight as ChevronRightIcon,
  Crown, Book, Building, UserCheck, UserX, Square, CheckSquare, Info
} from 'lucide-react';
import { useForm } from 'react-hook-form';

// --- Reusable Modal Component ---
/**
 * A reusable modal component.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {string} props.title - The title of the modal.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 */
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
/**
 * Form for adding a new admin.
 * @param {object} props
 * @param {function} props.onAdd - Callback to add the new user.
 * @param {function} props.onCancel - Callback to cancel the form.
 */
const AddAdminForm = ({ onAdd, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    // Add role and created at timestamp before submitting
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

// --- Form for Editing Admin (Not Used, but Kept for Reference) ---
// Note: This component is not currently used in the main table UI.
const EditAdminForm = ({ admin, onUpdate, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: admin,
  });

  const onSubmit = (data) => {
    onUpdate({ ...admin, ...data });
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

// --- View Details Component ---
/**
 * A component to display user details in a clean, readable format.
 * @param {object} props
 * @param {object} props.user - The user object to display.
 */
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
    <div className="space-y-4 text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Full Name</p>
          <p className="font-semibold text-lg">{user.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Email</p>
          <p className="text-blue-600 font-semibold">{user.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Role</p>
          <p className="font-semibold">{user.role}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p className="font-semibold capitalize text-green-600">{user.status}</p>
        </div>
        {user.department && (
          <div>
            <p className="text-sm font-medium text-gray-500">Department</p>
            <p className="font-semibold">{user.department}</p>
          </div>
        )}
        {user.title && (
          <div>
            <p className="text-sm font-medium text-gray-500">Title/Position</p>
            <p className="font-semibold">{user.title}</p>
          </div>
        )}
        {user.accessLevel && (
          <div>
            <p className="text-sm font-medium text-gray-500">Access Level</p>
            <p className="font-semibold">{user.accessLevel}</p>
          </div>
        )}
        {user.phoneNumber && (
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="font-semibold">{user.phoneNumber}</p>
          </div>
        )}
        {(user.street || user.city || user.postalCode || user.country) && (
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Address</p>
            <p className="font-semibold">
              {user.street}, {user.city}, {user.postalCode}, {user.country}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500">Created On</p>
          <p className="font-semibold">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};


// --- UserManagementTable Component ---
/**
 * Main component for user management, including search, tabs, and modals.
 * @param {object} props
 * @param {object[]} props.users - The array of user objects.
 * @param {function} props.setUsers - State setter for the users array.
 */
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

  // Memoize filtered users to avoid re-calculating on every render
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

      // Determine the correct API endpoint based on the user's role
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

        // Filter the user from the local state after successful API deletion
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
    <div className="bg-white p-4 sm:p-8 rounded-3xl shadow-lg border border-gray-100 overflow-x-auto h-full flex flex-col font-serif">
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
                setCurrentPage(1);
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
                      ${user.role === 'Student' || user.role === 'Job Seeker' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'Employer' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'ADMIN' ? 'bg-gray-200 text-gray-800' :
                            user.role === 'Subscriber' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                        title="View User Details"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={`mailto:${user.email}`}
                        className="text-green-600 hover:text-green-900 transition-colors cursor-pointer"
                        title="Send Email"
                      >
                        <Mail size={18} />
                      </a>
                      {/* Only show the delete button for ADMIN role */}
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => handleDeleteUserConfirmation(user)}
                          className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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

      {/* View User Details Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="User Details">
        <UserDetails user={selectedUser} />
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
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Fetch data from all four endpoints
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

        // Map and normalize the data to a consistent user object format
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

  if (loading) return <div className="flex items-center justify-center min-h-screen font-serif text-lg text-gray-700">Loading user data...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen font-serif text-lg text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-serif">
      <UserManagementTable users={users} setUsers={setUsers} />
    </div>
  );
};

export default App;