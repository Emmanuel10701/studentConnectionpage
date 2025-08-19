"use client"
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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
} from 'lucide-react';

// --- Reusable Modern Components (Mimicking shadcn/ui) ---
// These components are created here to make the app self-contained.

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 transition-colors ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={`flex min-h-[100px] w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 transition-colors resize-none ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

const Button = React.forwardRef(({ className, variant, ...props }, ref) => {
  const baseClasses = `inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2`;
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'bg-transparent border border-gray-400 text-gray-800 hover:bg-gray-100',
  };
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

const Label = ({ className, ...props }) => (
  <label
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-600 ${className}`}
    {...props}
  />
);
Label.displayName = 'Label';

const Select = ({ children, value, onValueChange }) => {
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
    <div className="relative" ref={selectRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 items-center justify-between w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors text-gray-900"
      >
        <span>{selectedItemLabel}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md py-1 max-h-48 overflow-y-auto shadow-lg border border-gray-200">
          {children.map((child, index) => (
            <div
              key={index}
              onClick={() => handleSelect(child.props.value)}
              className="py-2 px-3 text-sm cursor-pointer hover:bg-gray-100 text-gray-900 transition-colors"
            >
              {child.props.children}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ value, children }) => {
  return <div value={value}>{children}</div>;
};

// Main App component containing the modern email form.
export default function App() {
  const userTypes = [
    { value: 'admins', label: 'Admins' },
    { value: 'employers', label: 'Employers' },
    { value: 'subscribers', label: 'Subscribers' },
    { value: 'jobseekers', label: 'Jobseekers' },
    { value: 'students', label: 'Students' },
  ];

  const emailTypes = [
    { value: 'inquiry', label: 'General Inquiry' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'support', label: 'Technical Support' },
    { value: 'collaboration', label: 'Collaboration' },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    recipient: 'admins',
    emailType: 'inquiry',
    subject: '',
  });

  const [messageContent, setMessageContent] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);

  const [status, setStatus] = useState('idle');
  const [formMessage, setFormMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMessageChange = (e) => {
    setMessageContent(e.target.value);
  };

  const handleFileChange = (e) => {
    setAttachedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setFormMessage('');

    if (!formData.name || !formData.email || !formData.subject || !messageContent) {
      setStatus('error');
      setFormMessage('Please fill in all required fields.');
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Form Data:', formData);
      console.log('Message Content:', messageContent);
      if (attachedFiles.length > 0) {
        console.log('Attached Files:', attachedFiles.map(file => file.name));
      }

      setStatus('success');
      setFormMessage('Email sent successfully!');
      resetForm();
    } catch (error) {
      setStatus('error');
      setFormMessage('Failed to send email. Please try again.');
      console.error('Email sending error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      recipient: 'admins',
      emailType: 'inquiry',
      subject: '',
    });
    setMessageContent('');
    setAttachedFiles([]);
    setStatus('idle');
    setFormMessage('');
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
    <div className="min-h-screen w-full flex items-center justify-center p-">
      <motion.div
        className="w-full  p-8 md:p-12 space-y-8  "
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl mt-4 font-bold text-gray-800 tracking-tight"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Send Emails
          </motion.h1>
          <motion.p
            className="text-base text-gray-500 max-w-lg mx-auto"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            We're here to help. Select a recipient and compose your email below.
          </motion.p>
        </div>

        <hr className="my-8 border-gray-200" />

        <motion.form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - User Info */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Label htmlFor="name">Your Name</Label>
              <div className="relative mt-1">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="pl-10"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="email">Your Email</Label>
              <div className="relative mt-1">
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="pl-10"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative mt-1">
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Message Details */}
          <div className="space-y-6">
            <motion.div variants={itemVariants}>
              <Label htmlFor="recipient">Select Recipient</Label>
              <Select value={formData.recipient} onValueChange={(val) => setFormData({ ...formData, recipient: val })}>
                {userTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="emailType">Email Type</Label>
              <Select value={formData.emailType} onValueChange={(val) => setFormData({ ...formData, emailType: val })}>
                {emailTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Label htmlFor="subject">Subject</Label>
              <div className="relative mt-1">
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className="pl-10"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FileText className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full-width Message Textarea */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Label htmlFor="message">Message</Label>
            <div className="relative mt-1">
              <Textarea
                id="message"
                name="message"
                value={messageContent}
                onChange={handleMessageChange}
                placeholder="Write your message here..."
                className="pl-10 min-h-[150px]"
                required
              />
              <div className="absolute top-3 left-0 flex items-start pl-3 pointer-events-none">
                <MessageCircle className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </motion.div>

          {/* File Attachment */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <Label htmlFor="file">Attach Files (Optional)</Label>
            <div className="relative mt-1">
              <label className="flex items-center space-x-2 w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm ring-offset-white cursor-pointer hover:bg-gray-50 transition-colors">
                <File className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  {attachedFiles.length > 0 ? `${attachedFiles.length} file(s) selected` : 'Choose files'}
                </span>
                <Input
                  type="file"
                  id="file"
                  name="file"
                  onChange={handleFileChange}
                  className="sr-only"
                  multiple
                />
              </label>
              {attachedFiles.length > 0 && (
                <ul className="mt-2 text-sm text-gray-500 space-y-1">
                  {attachedFiles.map((file, index) => (
                    <li key={index} className="flex items-center space-x-1">
                      <File className="h-3 w-3 text-gray-400" />
                      <span>{file.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>

          {/* Status Message */}
          <motion.div
            variants={itemVariants}
            className="text-center min-h-[20px] md:col-span-2"
          >
            {status === 'success' && (
              <p className="text-sm font-semibold text-green-600">
                {formMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm font-semibold text-red-600">
                {formMessage}
              </p>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="md:col-span-2 flex justify-center gap-4">
            <Button
              type="submit"
              className="w-full md:w-48"
              disabled={status === 'sending'}
              variant="default"
            >
              {status === 'sending' ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                'Send'
              )}
            </Button>
            <Button
              type="button"
              onClick={resetForm}
              className="w-full md:w-48"
              variant="outline"
            >
              Cancel
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
