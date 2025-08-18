'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, CheckCircle, Calendar, MapPin, Users, BookOpen, Mic, Newspaper, Utensils, Sparkles, ChevronLeft, ChevronRight, Clock, Link } from 'lucide-react';

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

// Main App component
export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  // Mock data for upcoming events and news
  const mockEvents = useMemo(() => [
    {
      id: 1,
      title: 'Career Fair',
      description: 'Meet with leading companies in tech and engineering and explore internship and full-time opportunities.',
      date: new Date('2025-09-01T10:00:00Z'),
      location: 'Campus Auditorium',
      type: 'Career Fair',
      registrationLink: 'https://example.com/register/career-fair'
    },
    {
      id: 2,
      title: 'Workshop: Resume Writing',
      description: 'Learn how to create a standout resume with tips from career counselors.',
      date: new Date('2025-09-15T14:00:00Z'),
      location: 'Student Union, Room 101',
      type: 'Workshop',
      registrationLink: 'https://example.com/register/resume-workshop'
    },
    {
      id: 3,
      title: 'Networking Event',
      description: 'Network with professionals from top finance firms and learn about the industry.',
      date: new Date('2025-09-22T17:30:00Z'),
      location: 'The Graduate Club',
      type: 'Networking',
      registrationLink: 'https://example.com/register/networking-event'
    },
    {
      id: 4,
      title: 'Keynote Speaker: The Future of AI',
      description: 'Join Dr. Anya Sharma as she discusses the latest trends in artificial intelligence and its impact on the future.',
      date: new Date('2025-10-05T11:00:00Z'),
      location: 'Main Lecture Hall',
      type: 'Lecture',
      registrationLink: 'https://example.com/register/ai-lecture'
    },
    {
      id: 5,
      title: 'New Student Orientation',
      description: 'Welcome to the university! Learn about campus resources, student organizations, and academic support services.',
      date: new Date('2025-08-28T09:00:00Z'),
      location: 'Campus Quad',
      type: 'News',
    },
    {
      id: 6,
      title: 'Student Body Elections',
      description: 'Voting for the new student body representatives begins next week. Cast your vote to help shape our campus community!',
      date: new Date('2025-08-20T08:00:00Z'),
      location: 'Online',
      type: 'News',
    },
    {
      id: 7,
      title: 'Cooking Class: Italian Cuisine',
      description: 'Learn to make authentic pasta and sauces from a professional chef.',
      date: new Date('2025-09-29T18:00:00Z'),
      location: 'Dining Hall Kitchen',
      type: 'Social',
      registrationLink: 'https://example.com/register/cooking-class'
    },
    {
      id: 8,
      title: 'Startup Pitch Competition',
      description: 'Present your business idea to a panel of venture capitalists and win funding for your startup.',
      date: new Date('2025-11-10T15:00:00Z'),
      location: 'Innovation Hub',
      type: 'Workshop',
      registrationLink: 'https://example.com/register/pitch-competition'
    },
    {
      id: 9,
      title: 'Campus Food Festival',
      description: 'A celebration of global cuisine with food trucks, live music, and local vendors.',
      date: new Date('2025-10-25T12:00:00Z'),
      location: 'Campus Green',
      type: 'Social',
      registrationLink: 'https://example.com/register/food-festival'
    },
    {
      id: 10,
      title: 'Hackathon: Code for a Cause',
      description: 'Join developers and designers to build innovative solutions for social good over a weekend.',
      date: new Date('2025-11-15T09:00:00Z'),
      location: 'Computer Science Building',
      type: 'Workshop',
      registrationLink: 'https://example.com/register/hackathon'
    },
  ], []);

  // Sort events by date in descending order (latest first)
  const sortedEvents = useMemo(() => {
    return [...mockEvents].sort((a, b) => b.date - a.date);
  }, [mockEvents]);

  // Filter events based on search term and selected type
  const filteredEvents = useMemo(() => {
    return sortedEvents.filter(event => {
      const matchesSearchTerm = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEventType = selectedEventType === '' || event.type === selectedEventType;
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

  const handleRegistration = (eventId, email) => {
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setRegisteredEvents(prev => ({
      ...prev,
      [eventId]: true,
    }));
    setMessage({ type: 'success', text: 'You have been successfully registered for this event!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const uniqueEventTypes = [...new Set(mockEvents.map(event => event.type))];
  const EventTypeIconMap = {
    'Career Fair': Users,
    'Workshop': BookOpen,
    'Networking': Mic,
    'Lecture': Mic,
    'News': Newspaper,
    'Social': Utensils,
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

  const EventRegistration = ({ eventId, isRegistered, onRegister }) => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onRegister(eventId, email);
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

  return (
    <div className="min-h-screen w-full bg-slate-50 font-sans antialiased text-gray-800">
      <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
        <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm md:text-left text-center">Student Hub</h1>
            </div>
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events or news..."
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
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              <option value="">All Types</option>
              {uniqueEventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              onClick={() => { setSearchTerm(''); setSelectedEventType(''); }}
              className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>

          {/* Events Feed */}
          <AnimatePresence mode="wait">
            <motion.div
              key={paginatedEvents.length > 0 ? 'results' : 'no-results'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map(event => {
                  const IconComponent = EventTypeIconMap[event.type] || Sparkles;
                  const isRegistered = registeredEvents[event.id];
                  
                  return (
                    <motion.div 
                      key={event.id} 
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
                          <h3 className="font-bold text-xl text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock size={16} /> {formatTimeAgo(event.date)}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700">{event.description}</p>
                      <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar size={16} /> {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={16} /> {event.location}
                        </span>
                        {event.registrationLink && (
                          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-600 hover:underline">
                            <Link size={16} /> Register
                          </a>
                        )}
                      </div>
                      
                      {event.type !== 'News' && (
                        <EventRegistration 
                          eventId={event.id}
                          isRegistered={isRegistered}
                          onRegister={handleRegistration}
                        />
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
                  No upcoming events or news match your search criteria.
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
          
          <AnimatePresence>
            {message && <MessageBox message={message.text} type={message.type} onClose={() => setMessage(null)} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
