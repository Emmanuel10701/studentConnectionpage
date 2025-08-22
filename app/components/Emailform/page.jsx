'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// Import icons from the lucide-react library
import {
  Mail,
  User,
  Phone,
  FileText,
  MessageCircle,
  File,
  Loader2,
  ChevronDown,
  Send,
  X,
  Upload,
  Users,
  Type,
  Paperclip
} from 'lucide-react';

// --- Reusable Modern Components (Enhanced) ---
const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Icon className="h-5 w-5 text-blue-500" />
        </div>
      )}
      <input
        type={type}
        className={`flex h-14 w-full bg-white/90 backdrop-blur-sm border-2 border-gray-300/80 rounded-2xl px-5 py-4 text-base ring-offset-white file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 transition-all duration-300 ${Icon ? 'pl-12' : 'pl-5'} ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = 'Input';

const Textarea = React.forwardRef(({ className, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute top-4 left-5 pointer-events-none">
          <Icon className="h-5 w-5 text-blue-500" />
        </div>
      )}
      <textarea
        className={`flex min-h-[180px] w-full bg-white/90 backdrop-blur-sm border-2 border-gray-300/80 rounded-2xl px-5 py-4 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 transition-all duration-300 resize-none ${Icon ? 'pl-12' : 'pl-5'} ${className}`}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Textarea.displayName = 'Textarea';

const Button = React.forwardRef(({ className, variant, isLoading, children, ...props }, ref) => {
  const baseClasses = `inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-base font-medium ring-offset-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:pointer-events-none disabled:opacity-50 h-14 px-8 gap-3`;
  const variantClasses = {
    default: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl',
    outline: 'bg-transparent border-2 border-gray-400 text-gray-800 hover:border-blue-500 hover:text-blue-600',
    ghost: 'bg-transparent text-gray-700 hover:text-blue-700 hover:bg-gray-200/50',
  };
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      ref={ref}
      {...props}
    >
      {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

const Label = ({ className, ...props }) => (
  <label
    className={`text-lg font-semibold leading-none text-gray-800 mb-2 flex items-center gap-2 ${className}`}
    {...props}
  />
);
Label.displayName = 'Label';

const Select = ({ children, value, onValueChange, disabled, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (newValue) => {
    onValueChange(newValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectRef]);

  const selectedItemLabel = children.find(child => child.props.value === value)?.props.children;

  return (
    <div className="relative w-full" ref={selectRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex h-14 items-center justify-between w-full bg-white/90 backdrop-blur-sm border-2 border-gray-300/80 rounded-2xl px-5 py-3 text-base ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300 text-gray-900 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-blue-500" />}
          <span>{selectedItemLabel}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen && !disabled ? 'rotate-180' : 'rotate-0'}`} />
      </div>
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md rounded-2xl py-2 max-h-48 overflow-y-auto shadow-xl border border-gray-200/60"
          >
            {children.map((child, index) => (
              <div
                key={index}
                onClick={() => handleSelect(child.props.value)}
                className="py-3 px-5 text-base cursor-pointer hover:bg-blue-50/50 text-gray-800 transition-colors duration-200"
              >
                {child.props.children}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SelectItem = ({ value, children }) => {
  return <div value={value}>{children}</div>;
};

const FileUpload = ({ files, onChange, onRemove }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    onChange([...files, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    onRemove(index);
  };

  return (
    <div className="space-y-4">
      <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-400/60 rounded-3xl bg-white/50 backdrop-blur-sm cursor-pointer hover:border-blue-500/60 transition-all duration-300 p-6 text-center">
        <Upload className="w-10 h-10 text-blue-500 mb-3" />
        <span className="text-base font-medium text-gray-700">Drop files here or click to upload</span>
        <span className="text-sm text-gray-500 mt-1">Max 10MB per file</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
      </label>

      {files.length > 0 && (
        <div className="grid gap-3">
          {files.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-300/60"
            >
              <div className="flex items-center gap-4">
                <File className="w-5 h-5 text-blue-500" />
                <span className="text-base text-gray-800 truncate max-w-xs">{file.name}</span>
                <span className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)}MB
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="p-1 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App component containing the modern email form.
export default function App() {
  const userTypes = [
    { value: 'all', label: 'All Users', icon: Users },
    { value: 'subscribers', label: 'Subscribers', icon: Mail },
    { value: 'employers', label: 'Employers', icon: User },
    { value: 'students', label: 'Students', icon: User },
  ];

  const emailTypes = [
    { value: 'inquiry', label: 'General Inquiry', icon: MessageCircle },
    { value: 'feedback', label: 'Feedback', icon: FileText },
    { value: 'support', label: 'Technical Support', icon: Loader2 },
    { value: 'collaboration', label: 'Collaboration', icon: Users },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    recipient: 'all',
    emailType: 'inquiry',
    subject: '',
  });

  const [messageContent, setMessageContent] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipientData, setRecipientData] = useState({
    subscribers: [],
    employers: [],
    students: []
  });

  useEffect(() => {
    const fetchRecipientData = async () => {
      setLoading(true);
      try {
        const [subscribersRes, employersRes, studentsRes] = await Promise.all([
          fetch('/api/subscriber'),
          fetch('/api/employer'),
          fetch('/api/student'),
        ]);

        const subscribers = await subscribersRes.json();
        const employers = (await employersRes.json()).employers;
        const students = await studentsRes.json();

        setRecipientData({
          subscribers: subscribers.map(s => s.email),
          employers: employers.map(e => e.email),
          students: students.map(s => s.email),
        });

      } catch (error) {
        console.error("Failed to fetch recipient data:", error);
        toast.error("Failed to load recipient lists.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipientData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMessageChange = (e) => {
    setMessageContent(e.target.value);
  };

  const handleFileAdd = (newFiles) => {
    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !messageContent) {
        toast.error('Please fill in all required fields.');
        return;
    }

    const recipients = formData.recipient === 'all'
      ? [
          ...recipientData.subscribers,
          ...recipientData.employers,
          ...recipientData.students,
        ]
      : recipientData[formData.recipient];

    if (recipients.length === 0) {
      toast.error('No recipients found for this group.');
      return;
    }
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('recipientGroup', formData.recipient);
    formDataToSend.append('recipients', JSON.stringify(recipients));
    formDataToSend.append('emailType', formData.emailType);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('messageContent', messageContent);

    attachedFiles.forEach((file) => {
      formDataToSend.append('files', file);
    });

    try {
        await toast.promise(
            fetch('/api/sendmail', {
                method: 'POST',
                body: formDataToSend,
            }),
            {
                loading: 'Sending email...',
                success: 'Email sent successfully!',
                error: 'Failed to send email. Please try again.',
            }
        );
        resetForm();
    } catch (error) {
      console.error('Email sending error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      recipient: 'all',
      emailType: 'inquiry',
      subject: '',
    });
    setMessageContent('');
    setAttachedFiles([]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#374151',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
      <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8">
        <motion.div
          className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 space-y-8 border border-white/20"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="text-center space-y-4">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Send className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Send Emails
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 max-w-lg mx-auto"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Connect with your audience through beautifully crafted emails
            </motion.p>
          </div>

          <hr className="my-8 border-gray-200/60" />

          <motion.form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column - User Info */}
            <div className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label><User className="w-5 h-5" /> Your Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  icon={User}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label><Mail className="w-5 h-5" /> Your Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  icon={Mail}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label><Phone className="w-5 h-5" /> Phone Number (Optional)</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  icon={Phone}
                />
              </motion.div>
            </div>

            {/* Right Column - Message Details */}
            <div className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2">
                <Label><Users className="w-5 h-5" /> Select Recipient</Label>
                <Select 
                  value={formData.recipient} 
                  onValueChange={(val) => setFormData({ ...formData, recipient: val })}
                  disabled={loading}
                  icon={Users}
                >
                  {userTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-5 h-5" />
                        {type.label} {loading && type.value === formData.recipient && '(Loading...)'}
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label><Type className="w-5 h-5" /> Email Type</Label>
                <Select 
                  value={formData.emailType} 
                  onValueChange={(val) => setFormData({ ...formData, emailType: val })}
                  icon={Type}
                >
                  {emailTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-5 h-5" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label><FileText className="w-5 h-5" /> Subject</Label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  icon={FileText}
                  required
                />
              </motion.div>
            </div>

            {/* Full-width Message Textarea */}
            <motion.div variants={itemVariants} className="md:col-span-2 space-y-2">
              <Label><MessageCircle className="w-5 h-5" /> Message</Label>
              <Textarea
                name="message"
                value={messageContent}
                onChange={handleMessageChange}
                placeholder="Write your message here..."
                icon={MessageCircle}
                required
              />
            </motion.div>

            {/* File Attachment */}
            <motion.div variants={itemVariants} className="md:col-span-2 space-y-2">
              <Label><Paperclip className="w-5 h-5" /> Attach Files (Optional)</Label>
              <FileUpload 
                files={attachedFiles} 
                onChange={handleFileAdd}
                onRemove={handleFileRemove}
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="md:col-span-2 flex flex-col sm:flex-row justify-center gap-6 pt-4">
              <Button
                type="submit"
                className="flex-1"
                isLoading={loading}
                variant="default"
              >
                <Send className="w-5 h-5" />
                Send Email
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                className="flex-1"
                variant="outline"
              >
                <X className="w-5 h-5" />
                Clear Form
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}