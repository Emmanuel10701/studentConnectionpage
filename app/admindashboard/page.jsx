"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Newspaper, 
  Plus, 
  Video, 
  Link, 
  Trash2, 
  XCircle, 
  Menu, 
  Mail, 
  User, 
  Settings, 
  LogOut, 
  Calendar,
  MapPin,
  Clock,
  Loader
} from 'lucide-react';
import ProfileSettings from '../components/adminprofile/page.jsx';
import Usermanagement from "../components/admintab/page.jsx"
import Emailform from "../components/Emailform/page.jsx";
import { useSession, signOut } from 'next-auth/react';

// --- Safe Fetch Wrapper ---
const safeFetch = async (url, errorMessage) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(errorMessage);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(errorMessage, error);
    return [];
  }
};

// --- API Integration Functions ---
const fetchStudents = () => safeFetch('/api/student', 'Error fetching students:');
const fetchStudentProfiles = () => safeFetch('/api/studententireprofile', 'Error fetching student profiles:');
const fetchEmployers = () => safeFetch('/api/employer', 'Error fetching employers:');
const fetchCompanies = () => safeFetch('/api/company', 'Error fetching companies:');
const fetchSubscribers = () => safeFetch('/api/subscriber', 'Error fetching subscribers:');
const fetchNews = () => safeFetch('/api/new', 'Error fetching news:');
const fetchVideos = () => safeFetch('/api/video', 'Error fetching videos:');
const fetchEvents = () => safeFetch('/api/events', 'Error fetching events:');

const createEvent = async (eventData) => {
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return await response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};
const createNews = async (newsData) => {
  try {
    const response = await fetch('/api/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newsData.title,
        description: newsData.description || '', // Ensure it's never undefined
        // Don't send date - let the API handle it
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create news: ${errorData.error || response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};


const createVideo = async (videoData) => {
  try {
    const response = await fetch('/api/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(videoData),
    });
    if (!response.ok) throw new Error('Failed to create video');
    return await response.json();
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
};

const deleteEvent = async (id) => {
  try {
    const response = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

const deleteNews = async (id) => {
  try {
    const response = await fetch(`/api/new/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete news');
    return true;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

const deleteVideo = async (id) => {
  try {
    const response = await fetch(`/api/video/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete video');
    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Recently';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString();
};

// --- Reusable Components ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// --- New Components ---
const AddEventForm = ({ onAdd, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const newEvent = await createEvent(data);
      onAdd(newEvent);
      reset();
      onClose();
    } catch (error) {
      alert('Failed to create event: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Event Title
        </label>
        <input 
          type="text" 
          id="title" 
          {...register("title", { required: "Title is required" })} 
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Annual Career Fair"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input 
          type="date" 
          id="date" 
          {...register("date", { required: "Date is required" })} 
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date.message}</p>}
      </div>

      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
          Time
        </label>
        <input 
          type="time" 
          id="time" 
          {...register("time", { required: "Time is required" })} 
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time.message}</p>}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input 
          type="text" 
          id="location" 
          {...register("location", { required: "Location is required" })} 
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Online or 123 Main St"
        />
        {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Event Description
        </label>
        <textarea
          id="description"
          {...register("description", { required: "Description is required" })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief details about the event..."
          rows={4}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
          Event Target
        </label>
        <select
          id="target"
          {...register("target", { required: "Please select an event target" })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Target --</option>
          <option value="all">All</option>
          <option value="employers">Employers</option>
          <option value="jobseekers">Job Seekers</option>
        </select>
        {errors.target && <p className="mt-1 text-sm text-red-500">{errors.target.message}</p>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader size={18} className="animate-spin" /> Publishing...
          </>
        ) : (
          <>
            <Plus size={18} /> Publish Event
          </>
        )}
      </button>
    </form>
  );
};

const EventsCalendar = ({ events, setEvents }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const safeEvents = Array.isArray(events) ? events : [];

  const handleAddEvent = async (newEvent) => {
    setIsLoading(true);
    try {
      const createdEvent = await createEvent(newEvent);
      setEvents(prevEvents => [createdEvent, ...prevEvents]);
    } catch (error) {
      alert('Failed to add event: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteEvent = async (id) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setIsLoading(true);
      try {
        await deleteEvent(id);
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      } catch (error) {
        alert('Failed to delete event: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Upcoming Events</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader size={18} className="animate-spin" /> : <Plus size={18} />} Add Event
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader size={32} className="animate-spin text-blue-600" />
          </div>
        ) : safeEvents.length > 0 ? (
          safeEvents.map(event => (
            <div 
              key={event.id} 
              className="bg-gray-50 p-4 rounded-2xl flex items-start space-x-4 border border-gray-100 hover:shadow-md transition-shadow mb-4"
            >
              <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600 mt-1">
                <Calendar size={20} />
              </div>

              <div className="flex-grow">
                <h4 className="text-lg font-bold text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Calendar size={14} /> {event.date}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <Clock size={14} /> {event.time}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin size={14} /> {event.location}
                </p>

                <p className="text-sm text-gray-700 mt-2">
                  {event.description || "No description provided."}
                </p>

                <p className="text-xs font-medium mt-2 px-2 py-1 inline-block rounded-full bg-blue-100 text-blue-700">
                  🎯 Target: {event.target || "All"}
                </p>
              </div>

              <div className="flex-shrink-0">
                <button 
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100"
                  title="Delete"
                  disabled={isLoading}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">
            No upcoming events have been added yet.
          </div>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Event">
        <AddEventForm 
          onAdd={handleAddEvent} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

const AddContentForm = ({ onAdd, onClose }) => {
  const [contentType, setContentType] = useState('news');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let newItem;
      if (contentType === 'news') {
        newItem = await createNews({
          title: data.title,
          content: data.description,
          type: 'news'
        });
      } else {
        newItem = await createVideo({
          title: data.title,
          description: data.description,
          url: data.url,
          type: 'video'
        });
      }
      
      onAdd({
        ...newItem,
        type: contentType,
        description: contentType === 'news' ? data.description : data.description
      });
      
      reset();
      onClose();
    } catch (error) {
      alert('Failed to create content: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="contentType" 
              value="news" 
              checked={contentType === 'news'} 
              onChange={() => setContentType('news')}
              className="form-radio text-blue-600"
            />
            <span className="text-gray-700 flex items-center gap-1">
              <Newspaper size={16} /> News Article
            </span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              type="radio" 
              name="contentType" 
              value="video" 
              checked={contentType === 'video'} 
              onChange={() => setContentType('video')}
              className="form-radio text-blue-600"
            />
            <span className="text-gray-700 flex items-center gap-1">
              <Video size={16} /> Video
            </span>
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input 
          type="text" 
          id="title" 
          {...register("title", { required: "Title is required" })} 
          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. Important System Update"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>
      {contentType === 'news' && (
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            id="description" 
            rows="5"
            {...register("description", { required: "Content is required" })} 
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            placeholder="Write the full news article content here..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
        </div>
      )}
      {contentType === 'video' && (
        <>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/Vimeo)</label>
            <input 
              type="url" 
              id="url" 
              {...register("url", { required: "Video URL is required" })} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. https://www.youtube.com/watch?v=..."
            />
            {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description" 
              rows="3"
              {...register("description", { required: "Description is required" })} 
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder="Provide a brief description of the video..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
          </div>
        </>
      )}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <Loader size={18} className="animate-spin" /> Publishing...
          </>
        ) : (
          <>
            <Plus size={18} /> Publish Content
          </>
        )}
      </button>
    </form>
  );
};

const NewsAndContentManagement = ({ newsItems, setNewsItems }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const safeNewsItems = Array.isArray(newsItems) ? newsItems : [];

  const handleDeleteItem = async (id, type) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setIsLoading(true);
      try {
        if (type === 'news') {
          await deleteNews(id);
        } else {
          await deleteVideo(id);
        }
        setNewsItems(prevItems => prevItems.filter(item => item.id !== id));
      } catch (error) {
        alert('Failed to delete item: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleAddItem = (newItem) => {
    setNewsItems(prevItems => [newItem, ...prevItems]);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">News & Content</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader size={18} className="animate-spin" /> : <Plus size={18} />} Add New
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader size={32} className="animate-spin text-blue-600" />
          </div>
        ) : safeNewsItems.length > 0 ? (
          safeNewsItems.map(item => (
            <div 
              key={item.id} 
              className="bg-gray-50 p-4 rounded-2xl flex items-start space-x-4 border border-gray-100 hover:shadow-md transition-shadow mb-4"
            >
              <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600 mt-1">
                {item.type === 'news' ? <Newspaper size={20} /> : <Video size={20} />}
              </div>
              <div className="flex-grow">
                <h4 className="text-lg font-bold text-gray-900">{item.title}</h4>
                {item.type === 'video' && (
                  <p className="text-sm text-gray-600">
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                      <Link size={14} /> {item.url}
                    </a>
                  </p>
                )}
                <p className="text-gray-700 mt-2">{item.description || item.content}</p>
                <p className="text-xs text-gray-400 mt-2">Published: {item.date || item.createdAt}</p>
              </div>
              <div className="flex-shrink-0">
                <button 
                  onClick={() => handleDeleteItem(item.id, item.type)}
                  className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100"
                  title="Delete"
                  disabled={isLoading}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-8 text-gray-500">
            No news or video content has been added yet.
          </div>
        )}
      </div>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add News or Video">
        <AddContentForm onAdd={handleAddItem} onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

const DashboardOverview = ({ newsItems, metrics, recentActivities }) => {
  const safeNewsItems = Array.isArray(newsItems) ? newsItems : [];
  const safeMetrics = Array.isArray(metrics) ? metrics : [];
  const safeRecentActivities = Array.isArray(recentActivities) ? recentActivities : [];

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Dashboard Overview</h1>
      </header>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {safeMetrics.map(metric => (
          <div key={metric.id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-center justify-between transition-transform duration-200 hover:scale-105 hover:shadow-xl">
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
      
     <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
      <Newspaper size={24} /> Latest News & Videos
    </h3>
    <ul className="space-y-4">
      {safeNewsItems.slice(0, 7).map(item => (
        <li key={item.id} className="flex items-start gap-4">
          <div className={`flex-shrink-0 p-2 rounded-full ${item.type === 'news' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
            {item.type === 'news' ? <Newspaper size={20} /> : <Video size={20} />}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{item.title}</h4>
            {/* Use item.description since we normalized it */}
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
            {/* Use item.date since we normalized it */}
            <p className="text-xs text-gray-400 mt-1">Published: {item.date}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <ul className="space-y-4">
            {safeRecentActivities.map(activity => (
              <li key={activity.id} className="flex items-start">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-800">{activity.text}</p>
                  <p className="text-sm text-gray-500">{formatTimeAgo(activity.time)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default function CareerConnectApp() {
  const [view, setView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [events, setEvents] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || session?.user?.role !== 'ADMIN') {
      router.push('/adminlogin');
    }
  }, [status, router, session]);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [
          students,
          studentProfiles,
          employers,
          companies,
          subscribers,
          news,
          videos,
          eventsData
        ] = await Promise.all([
          fetchStudents(),
          fetchStudentProfiles(),
          fetchEmployers(),
          fetchCompanies(),
          fetchSubscribers(),
          fetchNews(),
          fetchVideos(),
          fetchEvents()
        ]);

        // Safely combine news and videos
     console.log('News from API:', news);
    console.log('Videos from API:', videos);

    // Safely combine news and videos with normalized field names
    const combinedNews = [
      ...(Array.isArray(news) ? news.map(item => ({ 
        ...item, 
        type: 'news',
        description: item.description || '',
        date: item.date || item.createdAt
      })) : []),
      ...(Array.isArray(videos) ? videos.map(item => ({ 
        ...item, 
        type: 'video',
        description: item.description || '',
        date: item.createdAt
      })) : [])
    ];

    console.log('Combined news items:', combinedNews);

        // Calculate metrics based on the fetched data
        const totalUsers = students.length + employers.length;
        const newSignups = students.filter(s => {
          const created = new Date(s.createdAt || s.dateCreated);
          const now = new Date();
          return (now - created) < (24 * 60 * 60 * 1000);
        }).length;
        
        const articlesPublished = combinedNews.length;
        const eventsThisMonth = eventsData.filter(e => {
          const eventDate = new Date(e.date);
          const now = new Date();
          return eventDate.getMonth() === now.getMonth() && 
                eventDate.getFullYear() === now.getFullYear();
        }).length;

        // Generate recent activities
        const allActivities = [
          ...students.slice(0, 3).map((student, index) => ({
            id: `student-${index}`,
            text: `New student registered: ${student.name || student.email}`,
            time: student.createdAt || new Date().toISOString(),
          })),
          ...employers.slice(0, 3).map((employer, index) => ({
            id: `employer-${index}`,
            text: `New employer registered: ${employer.name || employer.companyName}`,
            time: employer.createdAt || new Date().toISOString(),
          })),
          ...combinedNews.slice(0, 3).map((item, index) => ({
            id: `content-${index}`,
            text: `New ${item.type} published: ${item.title}`,
            time: item.createdAt || new Date().toISOString(),
          })),
          ...eventsData.slice(0, 3).map((event, index) => ({
            id: `event-${index}`,
            text: `New event created: ${event.title}`,
            time: event.createdAt || new Date().toISOString(),
          }))
        ];

        // Sort activities by time (newest first)
        allActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
        
        // Update metrics
        setMetrics([
          { 
            id: 1, 
            title: 'Total Users', 
            value: totalUsers.toLocaleString(), 
            icon: Users, 
            color: 'bg-blue-100 text-blue-600' 
          },
          { 
            id: 2, 
            title: 'New Signups', 
            value: newSignups.toLocaleString(), 
            icon: Plus, 
            color: 'bg-green-100 text-green-600' 
          },
          { 
            id: 3, 
            title: 'Articles Published', 
            value: articlesPublished.toLocaleString(), 
            icon: Newspaper, 
            color: 'bg-yellow-100 text-yellow-600' 
          },
          { 
            id: 4, 
            title: 'Events This Month', 
            value: eventsThisMonth.toLocaleString(), 
            icon: Calendar, 
            color: 'bg-purple-100 text-purple-600' 
          },
        ]);

        // Update state
        setRecentActivities(allActivities.slice(0, 10));
        setNewsItems(combinedNews);
        setEvents(eventsData);
        setUsers([...students, ...employers]);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays
        setMetrics([]);
        setRecentActivities([]);
        setNewsItems([]);
        setEvents([]);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchAllData();
    }
  }, [status, session]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'news-content', label: 'News & Content', icon: Newspaper },
    { id: 'profile-settings', label: 'Profile & Settings', icon: Settings },
    { id: 'events-calendar', label: 'Events Calendar', icon: Calendar },
    { id: 'email-form', label: 'Email Form', icon: Mail },
  ];

  const renderContent = () => {
    if (status === 'loading' || isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }
    
    const safeUsers = Array.isArray(users) ? users : [];
    const safeNewsItems = Array.isArray(newsItems) ? newsItems : [];
    const safeEvents = Array.isArray(events) ? events : [];
    const safeMetrics = Array.isArray(metrics) ? metrics : [];
    const safeRecentActivities = Array.isArray(recentActivities) ? recentActivities : [];
    
    switch(view) {
      case 'dashboard':
        return <DashboardOverview newsItems={safeNewsItems} metrics={safeMetrics} recentActivities={safeRecentActivities} />;
      case 'user-management':
        return (
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <Usermanagement users={safeUsers} setUsers={setUsers} />
          </div>
        );
      case 'news-content':
        return (
          <>
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">News & Content Management</h1>
            </header>
            <NewsAndContentManagement newsItems={safeNewsItems} setNewsItems={setNewsItems} />
          </>
        );
      case 'events-calendar':
        return (
          <>
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Events Calendar</h1>
            </header>
            <EventsCalendar events={safeEvents} setEvents={setEvents} />
          </>
        );
      case 'profile-settings':
        return <ProfileSettings />;
      case 'email-form':
        return (
          <div className="pt-32 px-4">
            <Emailform />
          </div>
        );
      default:
        return <DashboardOverview newsItems={safeNewsItems} metrics={safeMetrics} recentActivities={safeRecentActivities} />;
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="bg-gray-50 font-sans text-gray-800 flex min-h-screen">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
      
      {/* Sidebar - Mobile Toggle */}
      <div className="p-4 md:hidden flex justify-between items-center bg-transparent cursor-pointer fixed top-0 z-20 w-full">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-300 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex-1 text-center">
        </div>
        <div className="w-8"></div>
      </div>

      {/* Sidebar - Desktop & Mobile View */}
      <aside
        className={`md:block fixed inset-0 z-30 md:flex-shrink-0 
        w-[280px] bg-white p-6 shadow-xl md:rounded-r-3xl h-screen 
        flex flex-col justify-between 
        ${isSidebarOpen ? "block" : "hidden"}`}
      >
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <LayoutDashboard className="text-blue-600" size={32} />
            <span className="text-2xl font-extrabold text-blue-600">
              Admin Portal
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-900 ml-auto transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <XCircle size={24} />
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <a
                    href="#"
                    onClick={() => {
                      setView(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center p-3 rounded-xl font-semibold transition-colors
                      ${
                        view === item.id
                          ? "text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    <item.icon className="mr-3" size={20} />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="md:hidden mt-10 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">© 2025 admin dashboard</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 md:ml-[280px] bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <header className="flex justify-end items-center mb-8 fixed right-0 top-0 z-10">
          <div className="flex items-center space-x-5 bg-white/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
            
            <button
              onClick={() => signOut({ callbackUrl: '/adminlogin' })}
              className="flex items-center px-4 py-2 text-sm cursor-pointer font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl shadow-sm transition-all duration-200"
            >
              <LogOut size={18} className="mr-2" /> Logout
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {session?.user?.name ? 
                  session.user.name.split(' ').map(n => n[0]).join('')
                  : 'AD'}
              </div>
              <span className="font-semibold text-sm hidden md:block text-gray-800 tracking-wide">
                {session?.user?.name || "Admin User"}
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto transition-all duration-300 mt-16">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}