'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, CheckCircle, Calendar, MapPin, Users, BookOpen, Mic, Newspaper, Youtube, ChevronLeft, ChevronRight, Clock, Link as LinkIcon, Sparkles } from 'lucide-react';
import { CircularProgress, Backdrop } from '@mui/material';

// Utility function to format dates as "time ago" strings
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

// Reusable Message Box component for notifications
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

// Custom Loading Spinner Component
const LoadingSpinner = () => (
  <Backdrop
    open={true}
    sx={{ 
      color: '#fff', 
      zIndex: (theme) => theme.zIndex.drawer + 1,
      backgroundColor: 'rgba(255, 255, 255, 0.9)'
    }}
  >
    <div className="flex flex-col items-center justify-center gap-4">
      <CircularProgress 
        size={60} 
        thickness={4}
        sx={{ color: '#7c3aed' }} 
      />
      <p className="text-lg font-medium text-gray-800">Loading content...</p>
    </div>
  </Backdrop>
);

// Main App component
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  const [eventsData, setEventsData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [videosData, setVideosData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from all three APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate a delay to show the spinner (remove in production)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const [eventsRes, newsRes, videosRes] = await Promise.all([
          fetch('http://localhost:3000/api/events'),
          fetch('http://localhost:3000/api/new'),
          fetch('http://localhost:3000/api/video')
        ]);

        if (!eventsRes.ok || !newsRes.ok || !videosRes.ok) {
          throw new Error('Failed to fetch data from one or more APIs');
        }

        const events = await eventsRes.json();
        const news = await newsRes.json();
        const videos = await videosRes.json();
        
        // Ensure all data is an array before setting the state
        setEventsData(Array.isArray(events) ? events : [events]);
        setNewsData(Array.isArray(news) ? news : [news]);
        setVideosData(Array.isArray(videos) ? videos : [videos]);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Combine and format data from all APIs
  const combinedData = useMemo(() => {
    const formattedEvents = eventsData.map(event => ({
      ...event,
      date: new Date(event.date),
      type: 'Event',
    }));
    const formattedNews = newsData.map(news => ({
      ...news,
      date: new Date(news.date),
      type: 'News',
    }));
    const formattedVideos = videosData.map(video => ({
      ...video,
      date: new Date(video.createdAt),
      type: 'Video',
    }));

    return [...formattedEvents, ...formattedNews, ...formattedVideos];
  }, [eventsData, newsData, videosData]);

  // Sort events by date in descending order (latest first)
  const sortedEvents = useMemo(() => {
    return [...combinedData].sort((a, b) => b.date - a.date);
  }, [combinedData]);

  // Filter events based on search term and selected type
  const filteredEvents = useMemo(() => {
    return sortedEvents.filter(item => {
      const matchesSearchTerm = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesEventType = selectedEventType === '' || item.type === selectedEventType;
      return matchesSearchTerm && matchesEventType;
    });
  }, [searchTerm, selectedEventType, sortedEvents]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * eventsPerPage;
    return filteredEvents.slice(startIndex, startIndex + eventsPerPage);
  }, [currentPage, filteredEvents, eventsPerPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedEventType]);

  const uniqueEventTypes = ['All Types', ...new Set(combinedData.map(item => item.type))];
  const EventTypeIconMap = {
    'Event': Users,
    'News': Newspaper,
    'Video': Youtube,
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased text-gray-800">
      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}
      
      <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
        <div className="w-full max-w-5xl mx-auto px-4 py-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 drop-shadow-sm md:text-left text-center">Student Hub</h1>
            </div>
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events, news, or videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          {/* Combined Filters and Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-3xl bg-white shadow-lg border border-gray-200">
            <div className="relative flex-1">
              <select
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-xl bg-gray-50 border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="">All Types</option>
                {uniqueEventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>
            <button
              onClick={() => { setSearchTerm(''); setSelectedEventType(''); }}
              className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>

          {/* Events Feed */}
          {error ? (
            <p className="text-center text-red-500">Error: {error}</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={paginatedEvents.length > 0 ? 'results' : 'no-results'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {paginatedEvents.length > 0 ? (
                  paginatedEvents.map(item => {
                    const IconComponent = EventTypeIconMap[item.type] || Sparkles;

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white p-6 rounded-3xl border border-gray-200 shadow-lg flex flex-col gap-4 hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-purple-100 rounded-full text-purple-600 flex-shrink-0">
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <h3 className="font-bold text-xl text-gray-900 line-clamp-1">{item.title}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock size={16} /> {formatTimeAgo(item.date)}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 line-clamp-3">{item.description}</p>
                        <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                          {item.type === 'Event' && (
                            <>
                              <span className="flex items-center gap-1">
                                <Calendar size={16} /> {new Date(item.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={16} /> {item.location}
                              </span>
                            </>
                          )}
                          {item.type === 'Video' && item.url && (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-600 hover:underline">
                              <LinkIcon size={16} /> Watch Video
                            </a>
                          )}
                        </div>

                        {item.type === 'Event' && item.registrationLink && (
                          <a
                            href={item.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 px-6 py-2 rounded-xl text-center bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors"
                          >
                            Register Now
                          </a>
                        )}
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center py-12"
                  >
                    <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Search size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

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

          <AnimatePresence>
            {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}