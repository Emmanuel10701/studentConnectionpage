'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, Briefcase, Bell, Film, CheckCircle, Calendar, MapPin, ChevronLeft, ChevronRight, Clock, Link as LinkIcon, Sparkles } from 'lucide-react';
import { CircularProgress } from '@mui/material';

// --- Utility Functions ---
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

// --- Reusable Components ---
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-lg border border-gray-200">
    <CircularProgress 
      size={60} 
      thickness={4}
      sx={{ color: '#7c3aed' }} 
      className="mb-4"
    />
    <p className="text-lg font-medium text-gray-800">Loading employer opportunities...</p>
  </div>
);

const NoResultsFound = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="col-span-full text-center py-12"
  >
    <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <Search size={40} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-medium text-gray-700 mb-2">No opportunities found</h3>
    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
  </motion.div>
);

const PostTypeIconMap = {
  'Event': Briefcase,
  'News': Bell,
  'Video': Film,
};

const PostCard = ({ post, onRegister }) => {
  const IconComponent = PostTypeIconMap[post.type] || Briefcase;
  const displayDate = post.date || post.createdAt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg flex flex-col gap-4 hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-purple-100 rounded-full text-purple-600 flex-shrink-0">
          <IconComponent size={24} />
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{post.title}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Clock size={16} /> {formatTimeAgo(new Date(displayDate))}
          </p>
        </div>
      </div>
      <p className="text-gray-700 line-clamp-3">{post.description}</p>
      <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
        {post.location && (
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {post.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar size={16} /> {new Date(displayDate).toLocaleDateString()}
        </span>
      </div>

      {post.type === 'Event' && (
        <EmployerRegistration post={post} onRegister={onRegister} />
      )}

      {post.type !== 'Event' && post.url && (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 px-6 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors text-center inline-block"
        >
          View Details
        </a>
      )}
    </motion.div>
  );
};

const EmployerRegistration = ({ post, onRegister }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onRegister(post.id, email);
    setIsRegistered(true);
    setIsSubmitting(false);
  };

  if (isRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-3 rounded-xl bg-green-100 text-green-700 font-semibold"
      >
        <CheckCircle size={20} className="mr-2" />
        Registered!
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
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
    </form>
  );
};

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

// --- Main Component ---
export default function EmployerEvents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPostType, setSelectedPostType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsData, setEventsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [videosData, setVideosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const postsPerPage = 4;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const [eventsResponse, newsResponse, videosResponse] = await Promise.all([
          fetch('http://localhost:3000/api/events'),
          fetch('http://localhost:3000/api/new'),
          fetch('http://localhost:3000/api/video'),
        ]);

        const events = await eventsResponse.json();
        const news = await newsResponse.json();
        const videos = await videosResponse.json();

        setEventsData(Array.isArray(events) ? events : [events]);
        setNewsData(Array.isArray(news) ? news : [news]);
        setVideosData(Array.isArray(videos) ? videos : [videos]);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const combinedData = useMemo(() => {
    const formattedEvents = eventsData.map(item => ({ ...item, type: 'Event', date: new Date(item.date) }));
    const formattedNews = newsData.map(item => ({ ...item, type: 'News', date: new Date(item.date) }));
    const formattedVideos = videosData.map(item => ({ ...item, type: 'Video', date: new Date(item.createdAt) }));
    return [...formattedEvents, ...formattedNews, ...formattedVideos];
  }, [eventsData, newsData, videosData]);

  const sortedPosts = useMemo(() => {
    return [...combinedData].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  }, [combinedData]);
  
  const filteredPosts = useMemo(() => {
    return sortedPosts.filter(post => {
      const matchesSearchTerm = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || post.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPostType = selectedPostType === '' || post.type === selectedPostType;
      return matchesSearchTerm && matchesPostType;
    });
  }, [searchTerm, selectedPostType, sortedPosts]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [currentPage, filteredPosts, postsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedPostType]);

  const handleRegistration = (postId, email) => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setMessage({ type: 'success', text: 'You have been successfully registered for this event!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const uniquePostTypes = useMemo(() => {
    return [...new Set(combinedData.map(post => post.type))];
  }, [combinedData]);

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased text-gray-800">
      <div className="pt-8 pb-8 px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 drop-shadow-sm">Employer Hub ✨</h1>
            <div className="relative flex-1 max-w-lg md:max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white shadow-lg border border-gray-200">
            <label htmlFor="post-type-filter" className="text-gray-600 font-medium whitespace-nowrap">Filter by type:</label>
            <div className="relative flex-1 w-full">
              <select
                id="post-type-filter"
                value={selectedPostType}
                onChange={(e) => setSelectedPostType(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-xl bg-gray-50 border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="">All Types</option>
                {uniquePostTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={() => { setSearchTerm(''); setSelectedPostType(''); }}
              className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-medium whitespace-nowrap"
            >
              Clear Filters
            </button>
          </div>

          {/* Content & Pagination */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-12"
              >
                <LoadingState />
              </motion.div>
            ) : (
              <motion.div
                key="posts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {paginatedPosts.length > 0 ? (
                  paginatedPosts.map(post => (
                    <PostCard key={post.id} post={post} onRegister={handleRegistration} />
                  ))
                ) : (
                  <NoResultsFound />
                )}
              </motion.div>
            )}
          </AnimatePresence>

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
      </AnimatePresence>
    </div>
  );
}