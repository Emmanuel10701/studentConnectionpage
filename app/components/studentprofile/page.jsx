'use client';

import React, { useState, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Loader2, User, FileText, Upload, ChevronLeft, CheckCircle, PlusCircle, MinusCircle, Briefcase, GraduationCap, Trophy, MapPin, ChevronDown, Edit } from 'lucide-react';

// Helper function to get initials for the avatar fallback
const getInitials = (name) => {
    if (!name) return "S"; // Default for empty name
    const nameParts = name.split(" ");
    return nameParts.map(part => part[0]).join("").toUpperCase();
};

// --- Mock Select Component Implementation ---
// Re-written to manage state and pass props down without useContext
const Select = ({ value, onValueChange, children, disabled, placeholder }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Filter children to find SelectContent and its items
    const selectContent = React.Children.toArray(children).find(child => child.type === SelectContent);
    const items = selectContent ? React.Children.toArray(selectContent.props.children) : [];
    
    // Create a map to find the display label for the selected value
    const itemMap = items.reduce((acc, item) => {
        acc[item.props.value] = item.props.children;
        return acc;
    }, {});

    const handleSelectClick = (newValue) => {
        onValueChange(newValue);
        setOpen(false);
    };

    const toggleOpen = () => {
        if (!disabled) {
            setOpen(!open);
        }
    };
    
    // Effect to close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const displayText = value ? itemMap[value] : placeholder;

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                className={`flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-100' : ''}`}
                onClick={toggleOpen}
                disabled={disabled}
            >
                <span className={!value ? 'text-gray-400' : 'text-gray-900'}>
                    {displayText}
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-800 shadow-xl mt-1">
                    <div className="max-h-60 overflow-y-auto">
                        {items.map((item, index) =>
                            React.cloneElement(item, {
                                key: index,
                                onClick: () => handleSelectClick(item.props.value),
                                isSelected: value === item.props.value,
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const SelectContent = ({ children }) => {
    return children;
};

const SelectItem = ({ value, children, onClick, isSelected }) => {
    return (
        <div
            className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-4 pr-8 text-base outline-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
            onClick={onClick}
        >
            {children}
            {isSelected && <span className="absolute right-3 flex h-4 w-4 items-center justify-center"><CheckCircle className="h-5 w-5" /></span>}
        </div>
    );
};

// Mock components to make the code self-contained and runnable
const components = {
    Button: ({ children, className, variant, ...props }) => {
        const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-6 py-3 shadow-lg";
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
            secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:ring-gray-500",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100 shadow-none",
            icon: "h-10 w-10 p-0",
            gradient: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 focus-visible:ring-indigo-500"
        };
        const finalClassName = `${baseStyle} ${variants[variant] || variants.primary} ${className || ''}`;
        return <button {...props} className={finalClassName}>{children}</button>;
    },
    Input: (props) => <input {...props} className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100" />,
    Label: (props) => <label {...props} className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />,
    Textarea: (props) => <textarea {...props} className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100" />,
    Card: ({ children, className, ...props }) => <div className={`rounded-none sm:rounded-3xl border-0 sm:border border-gray-200 bg-white text-gray-900 shadow-none sm:shadow-2xl ${className}`} {...props}>{children}</div>,
    CardHeader: ({ children, ...props }) => <div className="flex flex-col space-y-2 p-4 sm:p-8" {...props}>{children}</div>,
    CardTitle: ({ children, ...props }) => <h3 className="text-3xl font-extrabold leading-none tracking-tight" {...props}>{children}</h3>,
    CardDescription: ({ children, ...props }) => <p className="text-lg text-gray-500" {...props}>{children}</p>,
    CardContent: ({ children, ...props }) => <div className="p-4 sm:p-8 pt-0" {...props}>{children}</div>,
    Separator: () => <div className="shrink-0 bg-gray-200 h-[2px] w-full"></div>,
    Avatar: ({ children, className }) => <div className={`relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>,
    AvatarFallback: ({ children, className, ...props }) => <div className={`flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-white font-extrabold text-4xl ${className}`} {...props}>{children}</div>,
};

// Data for Kirinyaga locations
const kirinyagaLocations = {
    Mwea: ["Mutithi", "Kangai", "Wamumu", "Nyangati", "Murinduko", "Gathigiriri", "Tebere", "Thiba"],
    Gichugu: ["Kabare", "Baragwi", "Njukiini", "Ngariama", "Karumandi"],
    Ndia: ["Mukure", "Kiine", "Kariti"],
    "Kirinyaga Central": ["Mutira", "Kanyekini", "Kerugoya", "Inoi"]
};

// The main App component that handles state and profile data
export default function App() {
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);

    const handleSaveProfile = (newProfile) => {
        setProfile(newProfile);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-8">
            <Toaster position="top-center" reverseOrder={false} />
            <components.Card className="w-full max-w-4xl">
                <StudentProfile
                    profile={profile}
                    setProfile={setProfile}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    onSaveProfile={handleSaveProfile}
                    resumeFile={resumeFile}
                    setResumeFile={setResumeFile}
                />
            </components.Card>
        </div>
    );
}

// The main StudentProfile component, now without react-hook-form and framer-motion
const StudentProfile = ({ profile, setProfile, isEditing, setIsEditing, onSaveProfile, resumeFile, setResumeFile }) => {
    const [formData, setFormData] = useState(profile);
    const [isUpdating, setIsUpdating] = useState(false);
    const resumeInputRef = useRef(null);
    const [avatarBgColor, setAvatarBgColor] = useState(profile.avatarColor || '#1e40af');
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});

    const avatarColors = [
        '#1e40af', // blue
        '#dc2626', // red
        '#713f12', // brown
        '#4b5563', // gray
        '#059669', // green
        '#9333ea'  // purple
    ];

    const selectedSubCounty = formData.address?.subCounty;
    const wards = kirinyagaLocations[selectedSubCounty] || [];

    // Manually handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const [section, index, field] = name.split('.');

        if (section && index && field) {
            // This is a dynamic field
            const newArray = [...(formData[section] || [])];
            if (newArray[index]) {
                if (type === 'checkbox') {
                    newArray[index][field] = checked;
                } else {
                    newArray[index][field] = value;
                }
            } else {
                newArray[index] = { [field]: value };
            }
            setFormData(prev => ({ ...prev, [section]: newArray }));
        } else if (name.includes('address')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            // This is a top-level field
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    // Manually handle select changes
    const handleSelectChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Reset form data to the profile when entering edit mode
    React.useEffect(() => {
        if (isEditing) {
            setFormData(profile);
            setAvatarBgColor(profile.avatarColor || '#1e40af');
        }
    }, [isEditing, profile]);
    
    // Reset ward if sub-county changes when in editing mode
    React.useEffect(() => {
        if (isEditing && selectedSubCounty && wards.length > 0 && !wards.includes(formData.address?.ward)) {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    ward: ""
                }
            }));
        }
    }, [selectedSubCounty, wards, isEditing]);


    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        
        // Basic personal info validation
        if (!formData.name) {
            newErrors.name = "Full Name is required";
            isValid = false;
        }
        if (!formData.email) {
            newErrors.email = "Email Address is required";
            isValid = false;
        }
        if (!formData.summary) {
            newErrors.summary = "A professional summary is required";
            isValid = false;
        }

        // Validate education entries
        if (formData.education) {
            formData.education.forEach((edu, index) => {
                if (!edu.school || !edu.degree || !edu.fieldOfStudy) {
                    newErrors[`education.${index}`] = "All education fields are required.";
                    isValid = false;
                }
            });
        }
        
        // Validate experience entries
        if (formData.experience) {
            formData.experience.forEach((exp, index) => {
                if (!exp.title || !exp.company || !exp.startDate) {
                    newErrors[`experience.${index}`] = "Position, company, and start date are required.";
                    isValid = false;
                }
            });
        }

        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setIsUpdating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            onSaveProfile({ ...formData, avatarColor: avatarBgColor });
            toast.success('Profile saved successfully!');
            setIsEditing(false); // Switch to view mode after saving
        } catch (error) {
            toast.error('Failed to save profile. Please try again.');
            console.error('Submission Error:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleResumeUpload = () => {
        const file = resumeInputRef.current.files[0];
        if (file) {
            setResumeFile(file);
            toast.success(`Resume '${file.name}' uploaded successfully!`);
        } else {
            toast.error('Please select a file to upload.');
        }
    };

    const handleAddDynamicField = (sectionName) => {
        const newEntry = {};
        if (sectionName === 'education') newEntry.isCurrent = false;
        if (sectionName === 'experience') newEntry.isCurrent = false;

        const updatedArray = [...(formData[sectionName] || []), newEntry];
        setFormData(prev => ({ ...prev, [sectionName]: updatedArray }));
    };

    const handleRemoveDynamicField = (sectionName, index) => {
        const updatedArray = [...formData[sectionName]];
        updatedArray.splice(index, 1);
        setFormData(prev => ({ ...prev, [sectionName]: updatedArray }));
    };

    // New function to handle adding a skill
    const handleAddSkill = () => {
      const trimmedSkill = skillInput.trim();
      const currentSkills = formData.skills || [];
      const hasSkill = currentSkills.some(s => s.name.toLowerCase() === trimmedSkill.toLowerCase());

      if (trimmedSkill === '') {
        toast.error("Skill cannot be empty.");
        return;
      }
      if (hasSkill) {
        toast.error("Skill already added.");
        return;
      }
      if (currentSkills.length >= 10) {
        toast.error("You can add a maximum of 10 skills.");
        return;
      }

      const updatedSkills = [...currentSkills, { name: trimmedSkill }];
      setFormData(prev => ({ ...prev, skills: updatedSkills }));
      setSkillInput(''); // Clear the input field
    };

    const renderField = (label, name, type, placeholder, isRequired = false, isReadOnly = false) => {
        const [section, index, field] = name.split('.');
        const value = section && index && field ? formData[section]?.[index]?.[field] : formData[name];
        
        return (
            <div>
                <components.Label htmlFor={name}>{label}</components.Label>
                {isEditing ? (
                    <components.Input
                        id={name}
                        type={type}
                        name={name}
                        value={value || ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        readOnly={isReadOnly}
                    />
                ) : (
                    <p className="mt-2 text-gray-800 font-medium">{value || "Not provided"}</p>
                )}
                {isEditing && errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>}
            </div>
        );
    };

    const renderDynamicSection = (sectionName, icon, title, renderItems) => {
        const fields = formData[sectionName] || [];
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center text-2xl font-bold text-gray-900">
                        {icon} {title}
                    </h3>
                    {isEditing && (sectionName !== 'skills') && (
                        <components.Button type="button" variant="secondary" onClick={() => handleAddDynamicField(sectionName)} className="shadow-none">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </components.Button>
                    )}
                </div>
                {fields.length > 0 ? (
                    fields.map((field, index) => (
                        <div
                            key={index}
                            className="relative grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow-inner"
                        >
                            {isEditing && (sectionName !== 'skills') && (
                                <components.Button type="button" variant="ghost" onClick={() => handleRemoveDynamicField(sectionName, index)} className="absolute top-2 right-2 p-2">
                                    <MinusCircle className="h-5 w-5 text-red-500" />
                                </components.Button>
                            )}
                            {renderItems(field, index)}
                            {/* Display a single error for the whole dynamic block */}
                            {isEditing && errors[`${sectionName}.${index}`] && (
                                <p className="col-span-2 mt-1 text-xs text-red-500">{errors[`${sectionName}.${index}`]}</p>
                            )}
                        </div>
                    ))
                ) : (
                    !isEditing && <p className="text-gray-500 italic">No {title.toLowerCase()} added yet.</p>
                )}
            </div>
        );
    };

    return (
        <div className="p-4 sm:p-8">
            <components.CardHeader className="relative p-4 sm:p-8">
                {/* Conditionally render Edit button as an icon at the top left */}
                {!isEditing && Object.keys(profile).length > 0 && (
                    <components.Button variant="ghost" className="absolute top-4 left-4 sm:top-8 sm:left-8 p-0 h-10 w-10" onClick={() => setIsEditing(true)}>
                        <Edit className="h-6 w-6 text-gray-600" />
                    </components.Button>
                )}
                <div className="flex flex-col space-y-1 mt-4 sm:mt-0">
                    <components.CardTitle className="text-gray-900">{isEditing ? "Edit Profile" : "My Profile"}</components.CardTitle>
                    <components.CardDescription>{isEditing ? "Update your details and save to finalize." : "Your profile information visible to employers."}</components.CardDescription>
                </div>
            </components.CardHeader>
            <components.CardContent className="p-4 sm:p-8 pt-0">
                <form onSubmit={onSubmit} className="space-y-12">
                    {/* Personal Information Section */}
                    <div className="space-y-8">
                        <h3 className="flex items-center text-2xl font-bold text-gray-900">
                            <User className="mr-3 h-6 w-6 text-blue-600" /> Personal Information
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-12 space-y-6 sm:space-y-0">
                            <div className="flex flex-col items-center">
                                <components.Avatar className="w-32 h-32 text-6xl font-extrabold text-white mb-4">
                                    <components.AvatarFallback style={{ backgroundColor: avatarBgColor }}>
                                        {getInitials(profile.name || formData.name || "")}
                                    </components.AvatarFallback>
                                </components.Avatar>
                                {isEditing && (
                                    <div className="flex space-x-3">
                                        {avatarColors.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setAvatarBgColor(color)}
                                                className="w-8 h-8 rounded-full border-4 border-white shadow-lg"
                                                style={{ backgroundColor: color, outline: avatarBgColor === color ? '2px solid #3b82f6' : 'none', outlineOffset: '2px' }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <components.Label htmlFor="name">Full Name</components.Label>
                                    {isEditing ? (
                                        <components.Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                            placeholder="Your full name"
                                        />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{profile.name}</p>
                                    )}
                                    {isEditing && errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>
                                <div>
                                    <components.Label htmlFor="email">Email Address</components.Label>
                                    {isEditing ? (
                                        <components.Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email || ""}
                                            onChange={handleChange}
                                            placeholder="your-email@example.com"
                                        />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{profile.email}</p>
                                    )}
                                    {isEditing && errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <components.Label htmlFor="summary">Professional Summary</components.Label>
                                    {isEditing ? (
                                        <components.Textarea
                                            id="summary"
                                            name="summary"
                                            rows="4"
                                            value={formData.summary || ""}
                                            onChange={handleChange}
                                            placeholder="Briefly describe your professional goals and skills for employers."
                                        />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium whitespace-pre-wrap">{profile.summary}</p>
                                    )}
                                    {isEditing && errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <components.Separator />

                    {/* Education Section */}
                    {renderDynamicSection("education", <GraduationCap className="mr-3 h-6 w-6 text-purple-600" />, "Education", (field, index) => {
                        const isCurrent = formData.education?.[index]?.isCurrent || false;
                        return (
                            <>
                                <div>
                                    <components.Label htmlFor={`education.${index}.school`}>Institution</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.school`} name={`education.${index}.school`} value={field.school || ""} onChange={handleChange} placeholder="e.g., University of Technology" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.school}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`education.${index}.degree`}>Degree</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.degree`} name={`education.${index}.degree`} value={field.degree || ""} onChange={handleChange} placeholder="e.g., Bachelor of Science" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.degree}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`education.${index}.fieldOfStudy`}>Course of Study</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.fieldOfStudy`} name={`education.${index}.fieldOfStudy`} value={field.fieldOfStudy || ""} onChange={handleChange} placeholder="e.g., Computer Science" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.fieldOfStudy}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <components.Label htmlFor={`education.${index}.graduationYear`}>Graduation Year</components.Label>
                                        {isEditing && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <input type="checkbox" id={`education.${index}.isCurrent`} name={`education.${index}.isCurrent`} checked={isCurrent} onChange={handleChange} className="rounded text-blue-600" />
                                                <label htmlFor={`education.${index}.isCurrent`}>Currently Studying</label>
                                            </div>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <components.Input type="number" id={`education.${index}.graduationYear`} name={`education.${index}.graduationYear`} value={field.graduationYear || ""} onChange={handleChange} placeholder="e.g., 2025" disabled={isCurrent} />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.isCurrent ? "Present" : field.graduationYear}</p>
                                    )}
                                </div>
                            </>
                        );
                    })}

                    <components.Separator />

                    {/* Work Experience Section */}
                    {renderDynamicSection("experience", <Briefcase className="mr-3 h-6 w-6 text-cyan-600" />, "Work Experience", (field, index) => {
                        const isCurrent = formData.experience?.[index]?.isCurrent || false;
                        return (
                            <>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.title`}>Position</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`experience.${index}.title`} name={`experience.${index}.title`} value={field.title || ""} onChange={handleChange} placeholder="e.g., Junior Developer" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.title}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.company`}>Company</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`experience.${index}.company`} name={`experience.${index}.company`} value={field.company || ""} onChange={handleChange} placeholder="e.g., Tech Solutions Inc." />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.company}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.startDate`}>Start Date</components.Label>
                                    {isEditing ? (
                                        <components.Input type="date" id={`experience.${index}.startDate`} name={`experience.${index}.startDate`} value={field.startDate || ""} onChange={handleChange} />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.startDate}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <components.Label htmlFor={`experience.${index}.endDate`}>End Date</components.Label>
                                        {isEditing && (
                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                <input type="checkbox" id={`experience.${index}.isCurrent`} name={`experience.${index}.isCurrent`} checked={isCurrent} onChange={handleChange} className="rounded text-blue-600" />
                                                <label htmlFor={`experience.${index}.isCurrent`}>Currently Working</label>
                                            </div>
                                        )}
                                    </div>
                                    {isEditing ? (
                                        <components.Input type="date" id={`experience.${index}.endDate`} name={`experience.${index}.endDate`} value={field.endDate || ""} onChange={handleChange} disabled={isCurrent} />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.isCurrent ? "Present" : field.endDate}</p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <components.Label htmlFor={`experience.${index}.description`}>Job Description</components.Label>
                                    {isEditing ? (
                                        <components.Textarea id={`experience.${index}.description`} name={`experience.${index}.description`} rows="3" value={field.description || ""} onChange={handleChange} placeholder="Key responsibilities and achievements..." />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium whitespace-pre-wrap">{field.description}</p>
                                    )}
                                </div>
                            </>
                        );
                    })}

                    <components.Separator />

                    {/* Skills Section - NEW */}
                    <div className="space-y-4">
                        <h3 className="flex items-center text-2xl font-bold text-gray-900">
                            <Briefcase className="mr-3 h-6 w-6 text-indigo-600" /> Skills
                        </h3>
                        {isEditing ? (
                            <>
                                <div className="flex flex-col sm:flex-row items-end gap-2">
                                    <div className="flex-1 w-full">
                                        <components.Label htmlFor="skillInput">Add a skill</components.Label>
                                        <components.Input
                                            id="skillInput"
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            placeholder="e.g., JavaScript, Python, React"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddSkill();
                                                }
                                            }}
                                        />
                                    </div>
                                    <components.Button type="button" variant="secondary" onClick={handleAddSkill} className="shadow-none">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                                    </components.Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(formData.skills || []).map((skill, index) => (
                                        <div key={index} className="flex items-center gap-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800">
                                            <span>{skill.name}</span>
                                            <button type="button" onClick={() => handleRemoveDynamicField('skills', index)} className="p-1 rounded-full hover:bg-gray-300">
                                                <MinusCircle className="h-4 w-4 text-red-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {(profile.skills || []).length > 0 ? (
                                    (profile.skills || []).map((skill, index) => (
                                        <span key={index} className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                            {skill.name}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No skills added yet.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <components.Separator />

                    {/* Resume Upload and Location Section */}
                    <div className="space-y-4">
                        <h3 className="flex items-center text-2xl font-bold text-gray-900">
                            <MapPin className="mr-3 h-6 w-6 text-green-600" /> Location & Resume
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <components.Label htmlFor="subCounty">Sub County</components.Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.address?.subCounty || ""}
                                        onValueChange={(val) => handleSelectChange('address', 'subCounty', val)}
                                        placeholder="Select Sub County"
                                        disabled={!isEditing}
                                    >
                                        <SelectContent>
                                            {Object.keys(kirinyagaLocations).map((subCounty) => (
                                                <SelectItem key={subCounty} value={subCounty}>
                                                    {subCounty}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile.address?.subCounty || "Not provided"}</p>
                                )}
                            </div>
                            <div>
                                <components.Label htmlFor="ward">Ward</components.Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.address?.ward || ""}
                                        onValueChange={(val) => handleSelectChange('address', 'ward', val)}
                                        placeholder="Select Ward"
                                        disabled={!selectedSubCounty || !isEditing}
                                    >
                                        <SelectContent>
                                            {wards.map((ward) => (
                                                <SelectItem key={ward} value={ward}>
                                                    {ward}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile.address?.ward || "Not provided"}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="flex items-center text-2xl font-bold text-gray-900">
                            <FileText className="mr-3 h-6 w-6 text-gray-600" /> Resume
                        </h3>
                        {isEditing ? (
                            <div className="flex flex-col sm:flex-row items-end gap-2">
                                <div className="flex-1 w-full">
                                    <components.Label htmlFor="resumeFile">Upload Resume (PDF, DOCX)</components.Label>
                                    <components.Input
                                        id="resumeFile"
                                        type="file"
                                        accept=".pdf,.docx"
                                        ref={resumeInputRef}
                                    />
                                </div>
                                <components.Button type="button" onClick={handleResumeUpload} variant="secondary" className="shadow-none">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                </components.Button>
                            </div>
                        ) : (
                            <p className="mt-2 text-gray-800 font-medium">{resumeFile ? `Resume: ${resumeFile.name}` : "No resume uploaded"}</p>
                        )}
                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-4">
                            <components.Button type="button" variant="secondary" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                                <ChevronLeft className="mr-2 h-4 w-4" /> Cancel
                            </components.Button>
                            <components.Button type="submit" variant="gradient" disabled={isUpdating}>
                                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isUpdating ? 'Saving...' : 'Save Profile'}
                            </components.Button>
                        </div>
                    )}
                </form>
            </components.CardContent>
        </div>
    );
};
