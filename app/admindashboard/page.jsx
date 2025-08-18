"use client"
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  User, 
  Settings, 
  LogOut, 
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import ProfileSettings from '../components/adminprofile/page.jsx';
import Usermanagement from "../components/admintab/page.jsx"

// --- Mock Data ---
const initialUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Administrator', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'User', status: 'Suspended' },
  { id: 4, name: 'Mary Brown', email: 'mary.brown@example.com', role: 'User', status: 'Active' },
];

const initialNews = [
  { id: 1, type: 'news', title: 'New Job Board Features Released', description: 'We are excited to announce the launch of new features for our job board, including advanced filtering and personalized recommendations...', date: '2024-08-14' },
  { id: 2, type: 'video', title: 'Rick Astley - Never Gonna Give You Up (Official Video) (4K Remaster)', description: 'Watch our exclusive interview with Sarah Chen, a leading recruiter, as she shares tips on building a standout resume and acing interviews.', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', date: '2024-08-12' },
  { id: 3, type: 'news', title: 'Upcoming Career Fair Event', description: 'Our annual virtual career fair is scheduled for September 25th. Register now to connect with top employers from around the globe.', date: '2024-08-10' },
];
const initialEvents = [
  {
    id: 1,
    title: "Web Development Workshop",
    date: "2024-09-15",
    time: "10:00 AM",
    location: "Online",
    description: "Learn modern web development tools and practices.",
    target: "All",
  },
  {
    id: 2,
    title: "Resume Review Clinic",
    date: "2024-09-20",
    time: "02:00 PM",
    location: "Office 3B",
    description: "One-on-one resume review session with experts.",
    target: "Job Seekers",
  },
  {
    id: 3,
    title: "Networking Session",
    date: "2024-09-28",
    time: "06:30 PM",
    location: "Virtual Lounge",
    description: "Meet employers and other professionals in your field.",
    target: "Employers",
  },
];
const dashboardMetrics = [
  { id: 1, title: 'Total Users', value: '4,200', icon: Users, color: 'bg-blue-100 text-blue-600' },
  { id: 2, title: 'New Signups', value: '350', icon: Plus, color: 'bg-green-100 text-green-600' },
  { id: 3, title: 'Articles Published', value: '1,200', icon: Newspaper, color: 'bg-yellow-100 text-yellow-600' },
  { id: 4, title: 'Events This Month', value: '8', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
];

const recentActivity = [
  { id: 1, text: 'John Doe updated his profile.', time: '2 hours ago' },
  { id: 2, text: 'New news article "Upcoming Career Fair" was published.', time: '1 day ago' },
  { id: 3, text: 'Jane Smith registered for the "Job Board Features" webinar.', time: '2 days ago' },
  { id: 4, text: 'A new user signed up for an account.', time: '3 days ago' },
];

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
// Component for adding events
const AddEventForm = ({ onAdd, onClose }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    const newId = Math.random(); 
    const newItem = {
      id: newId,
      ...data,
    };
    onAdd(newItem);
    reset();
    onClose();
  };

return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    {/* Event Title */}
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

    {/* Date */}
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

    {/* Time */}
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

    {/* Location */}
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

    {/* Event Description */}
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

    {/* Event Target */}
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

    {/* Submit Button */}
    <button 
      type="submit" 
      className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
    >
      <Plus size={18} /> Publish Event
    </button>
  </form>
);

};

const EventsCalendar = ({ events, setEvents }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
  };
  
  const handleDeleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">Upcoming Events</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      {/* Events List */}
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map(event => (
              <div 
                key={event.id} 
                className="bg-gray-50 p-4 rounded-2xl flex items-start space-x-4 border border-gray-100 hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="flex-shrink-0 p-3 rounded-full bg-purple-100 text-purple-600 mt-1">
                  <Calendar size={20} />
                </div>

                {/* Event Details */}
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

                  {/* NEW: Description */}
                  <p className="text-sm text-gray-700 mt-2">
                    {event.description || "No description provided."}
                  </p>

                  {/* NEW: Target Audience */}
                  <p className="text-xs font-medium mt-2 px-2 py-1 inline-block rounded-full 
                                bg-blue-100 text-blue-700">
                    🎯 Target: {event.target || "All"}
                  </p>
                </div>

                {/* Delete Button */}
                <div className="flex-shrink-0">
                  <button 
                onClick={() => confirmDelete(event)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100"
                    title="Delete"
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
      </div>
  

      {/* Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Event">
        <AddEventForm 
          onAdd={handleAddEvent} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};


// --- Existing Components from User's Code ---
const AddContentForm = ({ onAdd, onClose }) => {
  const [contentType, setContentType] = useState('news');
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    const newId = Math.random(); 
    const newItem = {
      id: newId,
      type: contentType,
      title: data.title,
      description: data.description,
      date: new Date().toISOString().split('T')[0],
      ...(contentType === 'video' && { url: data.url }),
    };
    onAdd(newItem);
    reset();
    onClose();
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
        className="w-[20%] bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <Plus size={18} /> Publish Content
      </button>
    </form>
  );
};

const NewsAndContentManagement = ({ newsItems, setNewsItems }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDeleteItem = (id) => {
    setNewsItems(newsItems.filter(item => item.id !== id));
  };
  
  const handleAddItem = (newItem) => {
    setNewsItems([newItem, ...newsItems]);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">News & Content</h3>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add New
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {newsItems.length > 0 ? (
            newsItems.map(item => (
              <div 
                key={item.id} 
                className="bg-gray-50 p-4 rounded-2xl flex items-start space-x-4 border border-gray-100 hover:shadow-md transition-shadow"
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
                  <p className="text-gray-700 mt-2">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-2">Published: {item.date}</p>
                </div>
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-100"
                    title="Delete"
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
      </div>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add News or Video">
        <AddContentForm onAdd={handleAddItem} onClose={() => setIsAddModalOpen(false)} />
      </Modal>
    </div>
  );
};

const DashboardOverview = ({ newsItems }) => (
  <>
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Dashboard Overview</h1>
    </header>
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {dashboardMetrics.map(metric => (
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
    
    {/* News Feed Section on Dashboard */}
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 transition-shadow hover:shadow-xl">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Newspaper size={24} /> Latest News & Videos
        </h3>
        <ul className="space-y-4">
          {newsItems.slice(0, 3).map(item => (
            <li key={item.id} className="flex items-start gap-4">
              <div className={`flex-shrink-0 p-2 rounded-full ${item.type === 'news' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                {item.type === 'news' ? <Newspaper size={20} /> : <Video size={20} />}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{item.title}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">Published: {item.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
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
  const [users, setUsers] = useState(initialUsers);
  const [newsItems, setNewsItems] = useState(initialNews);
  const [events, setEvents] = useState(initialEvents);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'news-content', label: 'News & Content', icon: Newspaper },
    { id: 'profile-settings', label: 'Profile & Settings', icon: Settings },
    { id: 'events-calendar', label: 'Events Calendar', icon: Calendar },
  ];

  const renderContent = () => {
    switch(view) {
      case 'dashboard':
        return <DashboardOverview newsItems={newsItems} />;
      case 'user-management':
        return (
          <>

            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="text-center p-8 text-gray-500">
                <Usermanagement users={users} setUsers={setUsers} />
              </div>
            </div>
          </>
        );
      case 'news-content':
        return (
            <>
              <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">News & Content Management</h1>
              </header>
              <NewsAndContentManagement newsItems={newsItems} setNewsItems={setNewsItems} />
            </>
          );
      case 'events-calendar':
        return (
          <>
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Events Calendar</h1>
            </header>
            <EventsCalendar events={events} setEvents={setEvents} />
          </>
        );
      case 'profile-settings':
        return (
          <>
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Profile and Settings</h1>
            </header>
            <ProfileSettings />
          </>
        );
      default:
        return <DashboardOverview newsItems={newsItems} />;
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
      
      {/* Sidebar - Mobile Toggle (Updated) */}
      <div className="p-4 md:hidden flex justify-between items-center bg-transparent  curser-pointer fixed   top-0 z-20">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-300 transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex-1 text-center">
        </div>
        <div className="w-8"></div> {/* Spacer to balance the flex layout */}
      </div>

{/* Sidebar - Desktop & Mobile View */}
<aside
  className={`md:block fixed inset-0 z-30 md:flex-shrink-0 
  w-[280px] bg-white p-6 shadow-xl md:rounded-r-3xl h-screen 
  flex flex-col justify-between 
  ${isSidebarOpen ? "block" : "hidden"}`}
>
  {/* Top Section */}
  <div>
    <div className="flex items-center space-x-2 mb-8">
      <LayoutDashboard className="text-blue-600" size={32} />
      <span className="text-2xl font-extrabold text-blue-600 ">
        Admin Portal
      </span>
      <button
        onClick={() => setIsSidebarOpen(false)}
        className="md:hidden text-gray-500 hover:text-gray-900 ml-auto transition-colors p-2 rounded-full hover:bg-gray-100"
      >
        <XCircle size={24} />
      </button>
    </div>

    {/* Navigation */}
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

  {/* Bottom Section - Admin Portal Info */}
  <div className="mt-[98%]  border-t border-gray-100">
    <p className="text-sm font-semibold text-gray-600">© 2025 Admin Portal</p>
    <span className="block text-xs text-gray-400 mt-1">@Admin Portal</span>
  </div>
</aside>

{/* Main Content Area */}
<main className="flex-1 p-4 md:p-8 md:ml-[280px] bg-gradient-to-br from-gray-50 via-white to-gray-100">
  <header className="flex justify-end items-center mb-8 sticky top-0 z-0">
    <div className="flex items-center space-x-5 bg-white/70 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
      
      {/* Logout button */}
      <button
        className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl shadow-sm transition-all duration-200"
      >
        <LogOut size={18} className="mr-2" /> Logout
      </button>

      {/* Profile Avatar */}
      <div className="flex items-center space-x-2">
        <img
          src="https://placehold.co/40x40/D1D5DB/1F2937?text=AD"
          alt="Profile"
          className="w-11 h-11 rounded-full border-2 border-gray-300 shadow-sm"
        />
        <span className="font-semibold text-sm hidden md:block text-gray-800 tracking-wide">
          Admin User
        </span>
      </div>
    </div>
  </header>

  {/* Main content wrapper */}
  <div className="max-w-7xl mx-auto transition-all duration-300">
    {renderContent()}
  </div>
</main>

    </div>
  );
}