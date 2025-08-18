'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Briefcase, Bell, Info, Globe, ChevronLeft, ChevronRight, Clock, Link, Calendar, MapPin, CheckCircle } from 'lucide-react';

// Utility function to format dates as "time ago" strings
// This helps the user quickly see how recent a post is.
const formatTimeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) { return Math.floor(interval) + " years ago"; }
  interval = seconds / 2592000;
  if (interval > 1) { return Math.floor(interval) + " months ago"; }
  interval = seconds / 86400;
  if (interval > 1) { return Math.floor(interval) + " days ago"; }
  interval = seconds / 3600;
  if (interval > 1) { return Math.floor(interval) + " hours ago"; }
  interval = seconds / 60;
  if (interval > 1) { return Math.floor(interval) + " minutes ago"; }
  return "just now";
};

// Component for displaying success or error messages
const MessageBox = ({ message, type, onClose }) => {
  const color = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  const icon = type === 'success' ? (
    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
  ) : (
    <X size={20} className="text-red-500 flex-shrink-0" />
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed inset-x-4 top-4 md:inset-x-auto md:w-96 ${color} p-4 rounded-xl shadow-lg flex items-start gap-3 z-50`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <p className="flex-1">{message}</p>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// Component for event registration/interest form for employers
const EmployerRegistration = ({ postId, isRegistered, onRegister }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    onRegister(postId, email);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {isRegistered ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center p-3 rounded-xl bg-green-100 text-green-700 font-semibold"
        >
          <CheckCircle size={20} className="mr-2" />
          Registered!
        </motion.div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to register"
            className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </div>
      )}
    </form>
  );
};

// New component for displaying post details in a modal
const PostDetailsModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to the backdrop
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
          <X size={24} className="text-gray-500" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-600 mb-4">{post.description}</p>
        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex items-center gap-2"><Calendar size={16} /> <strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
          <p className="flex items-center gap-2"><MapPin size={16} /> <strong>Location:</strong> {post.location}</p>
          <p className="flex items-center gap-2"><Briefcase size={16} /> <strong>Type:</strong> {post.type}</p>
          {post.infoLink && (
            <p className="flex items-center gap-2">
              <Link size={16} /> <strong>Link:</strong> 
              <a href={post.infoLink} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline break-all">
                {post.infoLink}
              </a>
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main App component for the Employer Portal
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostType, setSelectedPostType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [message, setMessage] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null); // New state for the modal
  const postsPerPage = 4;

  // Mock data for upcoming events and news specifically for employers
  // This data would typically be fetched from a database.
  const mockPosts = useMemo(() => [
    {
      id: 1,
      title: 'Job Fair: Fall 2025',
      description: 'Find qualified candidates and showcase your company culture. Booth registration is now open.',
      date: new Date('2025-09-01T10:00:00Z'),
      location: 'Main Convention Center',
      type: 'Job Fair',
      infoLink: 'https://example.com/employer-info/job-fair'
    },
    {
      id: 2,
      title: 'Hiring News: Tech Sector',
      description: 'Report highlights a 15% growth in tech job openings for Q3. Explore our resources to attract top talent.',
      date: new Date('2025-08-28T14:00:00Z'),
      location: 'Online',
      type: 'News',
      infoLink: 'https://example.com/employer-info/tech-hiring-news'
    },
    {
      id: 3,
      title: 'Recruitment Best Practices Webinar',
      description: 'Join our webinar to learn about the latest strategies for attracting and retaining talent in a competitive market.',
      date: new Date('2025-09-15T17:30:00Z'),
      location: 'Virtual',
      type: 'Webinar',
      infoLink: 'https://example.com/employer-info/recruitment-webinar'
    },
    {
      id: 4,
      title: 'Company Info Session: Innovate Co.',
      description: 'Innovate Co. is hosting an information session for employers interested in partnering on a new campus initiative.',
      date: new Date('2025-10-05T11:00:00Z'),
      location: 'Innovation Hub',
      type: 'Information Session',
      infoLink: 'https://example.com/employer-info/innovate-co'
    },
    {
      id: 5,
      title: 'Policy Update: Remote Work',
      description: 'New guidelines for managing remote employees have been released. Access the full document for details.',
      date: new Date('2025-08-20T08:00:00Z'),
      location: 'Online',
      type: 'News',
      infoLink: 'https://example.com/employer-info/remote-work-policy'
    },
    {
      id: 6,
      title: 'Campus Partnership Program Launch',
      description: 'The new Campus Partnership Program is now live, offering new ways for employers to engage with students and faculty.',
      date: new Date('2025-08-15T09:00:00Z'),
      location: 'Online',
      type: 'News',
      infoLink: 'https://example.com/employer-info/partnership-program'
    },
    {
      id: 7,
      title: 'Recruitment Session: Software Engineers',
      description: 'A dedicated session for companies looking to hire software engineers for full-time and internship roles.',
      date: new Date('2025-09-29T18:00:00Z'),
      location: 'Computer Science Building',
      type: 'Recruitment Session',
      infoLink: 'https://example.com/employer-info/engineering-recruitment'
    },
    {
      id: 8,
      title: 'Market Analysis Report',
      description: 'Download our latest report on market trends affecting hiring in the next year.',
      date: new Date('2025-11-10T15:00:00Z'),
      location: 'Online',
      type: 'Report',
      infoLink: 'https://example.com/employer-info/market-report'
    },
    {
      id: 9,
      title: 'Data Science Workshop',
      description: 'A hands-on workshop for employers to learn about integrating data science into their hiring process.',
      date: new Date('2025-10-25T12:00:00Z'),
      location: 'Innovation Hub',
      type: 'Workshop',
      infoLink: 'https://example.com/employer-info/data-science-workshop'
    },
  ], []);

  // Sort events by date in descending order (latest first)
  const sortedPosts = useMemo(() => {
    return [...mockPosts].sort((a, b) => b.date - a.date);
  }, [mockPosts]);

  // Filter posts based on search term and selected type
  const filteredPosts = useMemo(() => {
    return sortedPosts.filter(post => {
      const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || post.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPostType = selectedPostType === '' || post.type === selectedPostType;
      return matchesSearchTerm && matchesPostType;
    });
  }, [searchTerm, selectedPostType, sortedPosts]);

  // Pagination logic to display a limited number of posts per page
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [currentPage, filteredPosts, postsPerPage]);

  // Reset page to 1 whenever the filters or search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPostType]);

  const handleRegistration = (postId, email) => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setRegisteredEvents(prev => ({
      ...prev,
      [postId]: true,
    }));
    setMessage({ type: 'success', text: 'You have been successfully registered for this event!' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Get a list of unique post types for the filter dropdown
  const uniquePostTypes = [...new Set(mockPosts.map(post => post.type))];
  
  // Mapping of post types to Lucide React icons for visual appeal
  const PostTypeIconMap = {
    'Job Fair': Briefcase,
    'Webinar': Globe,
    'Workshop': Briefcase,
    'News': Bell,
    'Information Session': Info,
    'Report': Briefcase,
    'Recruitment Session': Briefcase,
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased text-gray-800">
      <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
        <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm md:text-left text-center">Employer Hub</h1>
            </div>
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-28 pb-8 px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Filters and Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 p-4 rounded-3xl bg-white shadow-lg border border-gray-200">
            <select
              value={selectedPostType}
              onChange={(e) => setSelectedPostType(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="">All Types</option>
              {uniquePostTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              onClick={() => { setSearchTerm(''); setSelectedPostType(''); }}
              className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>

          {/* Posts Feed */}
          <AnimatePresence mode="wait">
            <motion.div
              key={paginatedPosts.length > 0 ? 'results' : 'no-results'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map(post => {
                  const IconComponent = PostTypeIconMap[post.type] || Info;
                  const isRegistered = registeredEvents[post.id];
                  
                  return (
                    <motion.div 
                      key={post.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg flex flex-col gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600 flex-shrink-0">
                          <IconComponent size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900">{post.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock size={16} /> {formatTimeAgo(post.date)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{post.description}</p>
                      <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} /> {new Date(post.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={16} /> {post.location}
                        </span>
                      </div>
                      
                      {(post.type !== 'News' && post.type !== 'Report') && (
                        <EmployerRegistration 
                          postId={post.id} 
                          isRegistered={isRegistered} 
                          onRegister={handleRegistration}
                        />
                      )}
                      
                      {/* Changed from <a> to <button> to trigger the modal */}
                      {post.infoLink && (
                         <button 
                           onClick={() => setSelectedPost(post)}
                           className="mt-4 px-6 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors text-center"
                         >
                           View Details
                         </button>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-500 col-span-full text-center py-8"
                >
                  No posts match your search criteria.
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full font-semibold transition-all ${currentPage === page ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
        {selectedPost && <PostDetailsModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
      </AnimatePresence>
    </div>
  );
}
