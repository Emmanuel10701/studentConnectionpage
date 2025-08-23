'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Loader2, User, FileText, Upload, ChevronLeft, CheckCircle, PlusCircle, MinusCircle, Briefcase, GraduationCap, Trophy, MapPin, ChevronDown, Edit, Mail, Calendar, Award, BookOpen, Map } from 'lucide-react';
import { useSession } from 'next-auth/react';

// Helper Functions
const getInitials = (name) => {
    if (!name) return "S";
    const nameParts = name.split(" ");
    return nameParts.map(part => part[0]).join("").toUpperCase();
};

const kirinyagaLocations = {
    Mwea: ["Mutithi", "Kangai", "Wamumu", "Nyangati", "Murinduko", "Gathigiriri", "Tebere", "Thiba"],
    Gichugu: ["Kabare", "Baragwi", "Njukiini", "Ngariama", "Karumandi"],
    Ndia: ["Mukure", "Kiine", "Kariti"],
    "Kirinyaga Central": ["Mutira", "Kanyekini", "Kerugoya", "Inoi"]
};

// Modern Select Component
const Select = ({ value, onValueChange, children, disabled, placeholder }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const selectContent = React.Children.toArray(children).find(child => child.type === SelectContent);
    const items = selectContent ? React.Children.toArray(selectContent.props.children) : [];
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
    useEffect(() => {
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
                className={`flex h-12 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 text-base shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-100' : 'hover:border-gray-300'}`}
                onClick={toggleOpen}
                disabled={disabled}
            >
                <span className={!value ? 'text-gray-400' : 'text-gray-900'}>
                    {displayText}
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xl mt-1">
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

const SelectContent = ({ children }) => children;
const SelectItem = ({ value, children, onClick, isSelected }) => (
    <div
        className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-3 pl-4 pr-8 text-base outline-none transition-colors duration-150 ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}
        onClick={onClick}
    >
        {children}
        {isSelected && <span className="absolute right-3 flex h-4 w-4 items-center justify-center"><CheckCircle className="h-5 w-5 text-blue-600" /></span>}
    </div>
);

// Modern UI Components
const components = {
    Button: ({ children, className, variant, ...props }) => {
        const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-6 py-3";
        const variants = {
            primary: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl",
            secondary: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow-md",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
            icon: "h-10 w-10 p-0",
            outline: "border-2 border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white"
        };
        const finalClassName = `${baseStyle} ${variants[variant] || variants.primary} ${className || ''}`;
        return <button {...props} className={finalClassName}>{children}</button>;
    },
    Input: (props) => <input {...props} className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 hover:border-gray-300" />,
    Label: (props) => <label {...props} className="text-sm font-medium leading-none text-gray-700 mb-2 block peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />,
    Textarea: (props) => <textarea {...props} className="flex min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 hover:border-gray-300" />,
    Card: ({ children, className, ...props }) => <div className={`rounded-2xl border-0 bg-white text-gray-900 shadow-lg ${className}`} {...props}>{children}</div>,
    CardHeader: ({ children, ...props }) => <div className="flex flex-col space-y-2 p-6" {...props}>{children}</div>,
    CardTitle: ({ children, ...props }) => <h3 className="text-2xl font-bold tracking-tight" {...props}>{children}</h3>,
    CardDescription: ({ children, ...props }) => <p className="text-gray-500" {...props}>{children}</p>,
    CardContent: ({ children, ...props }) => <div className="p-6 pt-0" {...props}>{children}</div>,
    Separator: () => <div className="shrink-0 bg-gradient-to-r from-transparent via-gray-200 to-transparent h-[1px] w-full my-6"></div>,
    Avatar: ({ children, className }) => <div className={`relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>,
    AvatarFallback: ({ children, className, ...props }) => <div className={`flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-3xl ${className}`} {...props}>{children}</div>,
};

// Main App Component
export default function App() {
    const { data: session, status } = useSession();
    
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [hasProfile, setHasProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (status !== 'authenticated') {
                setIsLoading(false);
                setIsEditing(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch(`/api/studententireprofile/${session.user.id}`); 
                if (response.status === 404) {
                    setHasProfile(false);
                    setIsEditing(true);
                    setProfile({});
                } else if (!response.ok) {
                    toast.error("Failed to fetch profile data.");
                    setHasProfile(false);
                    setIsEditing(true);
                    setProfile({});
                } else {
                    const data = await response.json();
                    setProfile(data);
                    setHasProfile(true);
                    setIsEditing(false);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Network error. Could not load profile.");
                setHasProfile(false);
                setIsEditing(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [session?.user?.id, status]); 

    const handleSaveProfile = (newProfile) => {
        setProfile(newProfile);
        setHasProfile(true); 
        setIsEditing(false);
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }
    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to view and manage your profile.</p>
                    <components.Button variant="primary">Sign In</components.Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <Toaster position="top-center" reverseOrder={false} />
            <components.Card className="w-full max-w-4xl">
                <StudentProfileContent
                    profile={profile}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    hasProfile={hasProfile}
                    onSaveProfile={handleSaveProfile}
                    session={session}
                />
            </components.Card>
        </div>
    );
}

// StudentProfileContent Component
const StudentProfileContent = ({ profile, isEditing, setIsEditing, hasProfile, onSaveProfile, session }) => {
    
    const [formData, setFormData] = useState({
        userId: session?.user?.id,
        name: profile?.name ?? session?.user?.name ?? '',
        email: profile?.email ?? session?.user?.email ?? '',
        bio: profile?.bio ?? '',
        summary: profile?.summary ?? '',
        resumePath: profile?.resumePath ?? '',
        skills: profile?.skills ?? [],
        address: profile?.address ?? { 
            county: "Kirinyaga",
            subCounty: '', 
            ward: '', 
            details: '' 
        },
        education: profile?.education ?? [],
        experience: profile?.experience ?? [],
        achievements: profile?.achievements ?? [],
        certifications: profile?.certifications ?? [],
    });
    
    const [isUpdating, setIsUpdating] = useState(false);
    const resumeInputRef = useRef(null);
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});
    const [resumeFile, setResumeFile] = useState(null);

    const selectedSubCounty = formData.address?.subCounty || '';
    const wards = kirinyagaLocations[selectedSubCounty] || [];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const [section, index, field] = name.split('.');
        
        if (section && index && field) {
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
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSelectChange = (section, field, value) => {
        if (section === 'address') {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    useEffect(() => {
        if (isEditing) {
            setFormData({
                userId: session?.user?.id,
                name: profile?.name ?? session?.user?.name ?? '',
                email: profile?.email ?? session?.user?.email ?? '',
                bio: profile?.bio ?? '',
                summary: profile?.summary ?? '',
                resumePath: profile?.resumePath ?? '',
                skills: profile?.skills ?? [],
                address: profile?.address ?? { 
                    county: "Kirinyaga",
                    subCounty: '', 
                    ward: '', 
                    details: '' 
                },
                education: profile?.education ?? [],
                experience: profile?.experience ?? [],
                achievements: profile?.achievements ?? [],
                certifications: profile?.certifications ?? [],
            });
        }
    }, [isEditing, profile, session]);
    
    useEffect(() => {
        if (isEditing && selectedSubCounty && wards.length > 0 && !wards.includes(formData.address?.ward)) {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    ward: ""
                }
            }));
        }
    }, [selectedSubCounty, wards, isEditing, formData.address?.ward]);

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        
        if (!formData.name) {
            newErrors.name = "Full Name is required";
            isValid = false;
        }
        if (!formData.summary) {
            newErrors.summary = "A professional summary is required";
            isValid = false;
        }
        if (formData.education) {
            formData.education.forEach((edu, index) => {
                if (!edu.school || !edu.degree || !edu.fieldOfStudy) {
                    newErrors[`education.${index}`] = "All education fields are required.";
                    isValid = false;
                }
            });
        }
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
        
        let url = '/api/studententireprofile';
        let method = 'POST';
        
        if (hasProfile && session?.user?.id) {
            url = `/api/studententireprofile/${session.user.id}`;
            method = 'PUT';
        }

        const formDataToSend = new FormData();
        
        if (session?.user?.id) {
            formDataToSend.append("userId", session.user.id);
        }
        formDataToSend.append("name", formData.name || "");
        formDataToSend.append("bio", formData.bio || "");
        formDataToSend.append("summary", formData.summary || "");
        formDataToSend.append("address", JSON.stringify(formData.address || {}));
        formDataToSend.append("education", JSON.stringify(formData.education || []));
        formDataToSend.append("experience", JSON.stringify(formData.experience || []));
        formDataToSend.append("achievements", JSON.stringify(formData.achievements || []));
        formDataToSend.append("certifications", JSON.stringify(formData.certifications || []));
        formDataToSend.append("skills", JSON.stringify(formData.skills || []));

        if (resumeFile) {
            formDataToSend.append("resume", resumeFile);
        }

        try {
            const response = await fetch(url, {
                method: method,
                body: formDataToSend,
            });

            if (response.status === 404 && method === 'PUT') {
                const createResponse = await fetch('/api/studententireprofile', {
                    method: 'POST',
                    body: formDataToSend,
                });
                
                if (!createResponse.ok) {
                    const errorData = await createResponse.json();
                    throw new Error(errorData.message || 'Failed to create profile.');
                }
                
                const savedProfile = await createResponse.json();
                onSaveProfile(savedProfile.profile || savedProfile);
                toast.success('Profile created successfully!');
            } 
            else if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to ${method === 'POST' ? 'create' : 'update'} profile.`);
            }
            else {
                const savedProfile = await response.json();
                onSaveProfile(savedProfile.profile || savedProfile);
                toast.success(`Profile ${method === 'POST' ? 'created' : 'updated'} successfully!`);
            }

        } catch (error) {
            toast.error(error.message || 'Failed to save profile. Please try again.');
            console.error('Submission Error:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleResumeUpload = () => {
        const file = resumeInputRef.current.files[0];
        if (file) {
            setResumeFile(file);
            toast.success(`Resume '${file.name}' ready for upload!`);
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
        setSkillInput('');
    };

    const renderField = (label, name, type, placeholder, isReadOnly = false) => {
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
                {isEditing && errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
            </div>
        );
    };

    const renderDynamicSection = (sectionName, icon, title, renderItems) => {
        const fields = formData[sectionName] || [];
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="flex items-center text-xl font-bold text-gray-900">
                        {icon} {title}
                    </h3>
                    {isEditing && (sectionName !== 'skills') && (
                        <components.Button type="button" variant="outline" onClick={() => handleAddDynamicField(sectionName)} className="text-sm">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add
                        </components.Button>
                    )}
                </div>
                {fields.length > 0 ? (
                    fields.map((field, index) => (
                        <div
                            key={index}
                            className="relative grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-100"
                        >
                            {isEditing && (sectionName !== 'skills') && (
                                <components.Button type="button" variant="ghost" onClick={() => handleRemoveDynamicField(sectionName, index)} className="absolute top-3 right-3 p-1">
                                    <MinusCircle className="h-4 w-4 text-red-500" />
                                </components.Button>
                            )}
                            {renderItems(field, index)}
                            {isEditing && errors[`${sectionName}.${index}`] && (
                                <p className="col-span-2 mt-1 text-xs text-red-500">{errors[`${sectionName}.${index}`]}</p>
                            )}
                        </div>
                    ))
                ) : (
                    !isEditing && <p className="text-gray-500 italic text-center py-4">No {title.toLowerCase()} added yet.</p>
                )}
            </div>
        );
    };

    return (
        <div className="p-6">
            <components.CardHeader className="relative p-6">
                {hasProfile && !isEditing && (
                    <components.Button variant="ghost" className="absolute top-6 left-6 p-0 h-10 w-10" onClick={() => setIsEditing(true)}>
                        <Edit className="h-5 w-5 text-gray-600" />
                    </components.Button>
                )}
                <div className="flex flex-col space-y-2 mt-4">
                    <components.CardTitle className="text-gray-900 text-3xl font-extrabold">
                        {isEditing ? (hasProfile ? "Edit Profile" : "Create Profile") : "My Profile"}
                    </components.CardTitle>
                    <components.CardDescription className="text-lg">
                        {isEditing 
                            ? (hasProfile ? "Update your details and save to finalize." : "Create your profile to showcase your skills to employers.") 
                            : "Your profile information visible to employers."}
                    </components.CardDescription>
                </div>
            </components.CardHeader>
            <components.CardContent className="p-6 pt-0">
                <form onSubmit={onSubmit} className="space-y-8">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <h3 className="flex items-center text-xl font-bold text-gray-900">
                            <User className="mr-3 h-5 w-5 text-blue-600" /> Personal Information
                        </h3>
                        <div className="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
                            <div className="flex flex-col items-center">
                                <components.Avatar className="w-28 h-28 text-4xl font-bold text-white mb-4">
                                    <components.AvatarFallback>
                                        {getInitials(profile?.name || formData.name || "")}
                                    </components.AvatarFallback>
                                </components.Avatar>
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
                                        <p className="mt-2 text-gray-800 font-medium">{profile?.name || "Not provided"}</p>
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
                                        <p className="mt-2 text-gray-800 font-medium">{profile?.email || "Not provided"}</p>
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
                                        <p className="mt-2 text-gray-800 font-medium whitespace-pre-wrap">{profile?.summary || "Not provided"}</p>
                                    )}
                                    {isEditing && errors.summary && <p className="mt-1 text-xs text-red-500">{errors.summary}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <components.Separator />

                    {/* Education Section */}
                    {renderDynamicSection("education", <GraduationCap className="mr-3 h-5 w-5 text-purple-600" />, "Education", (field, index) => {
                        const isCurrent = formData.education?.[index]?.isCurrent || false;
                        return (
                            <>
                                <div>
                                    <components.Label htmlFor={`education.${index}.school`}>Institution</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.school`} name={`education.${index}.school`} value={field.school || ""} onChange={handleChange} placeholder="e.g., University of Technology" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.school || "Not provided"}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`education.${index}.degree`}>Degree</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.degree`} name={`education.${index}.degree`} value={field.degree || ""} onChange={handleChange} placeholder="e.g., Bachelor of Science" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.degree || "Not provided"}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`education.${index}.fieldOfStudy`}>Course of Study</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.fieldOfStudy`} name={`education.${index}.fieldOfStudy`} value={field.fieldOfStudy || ""} onChange={handleChange} placeholder="e.g., Computer Science" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.fieldOfStudy || "Not provided"}</p>
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
                                        <p className="mt-2 text-gray-800 font-medium">{field.isCurrent ? "Present" : (field.graduationYear || "Not provided")}</p>
                                    )}
                                </div>
                            </>
                        );
                    })}

                    <components.Separator />

                    {/* Work Experience Section */}
                    {renderDynamicSection("experience", <Briefcase className="mr-3 h-5 w-5 text-cyan-600" />, "Work Experience", (field, index) => {
                        const isCurrent = formData.experience?.[index]?.isCurrent || false;
                        return (
                            <>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.title`}>Position</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`experience.${index}.title`} name={`experience.${index}.title`} value={field.title || ""} onChange={handleChange} placeholder="e.g., Junior Developer" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.title || "Not provided"}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.company`}>Company</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`experience.${index}.company`} name={`experience.${index}.company`} value={field.company || ""} onChange={handleChange} placeholder="e.g., Tech Solutions Inc." />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.company || "Not provided"}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.startDate`}>Start Date</components.Label>
                                    {isEditing ? (
                                        <components.Input type="date" id={`experience.${index}.startDate`} name={`experience.${index}.startDate`} value={field.startDate || ""} onChange={handleChange} />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.startDate || "Not provided"}</p>
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
                                        <p className="mt-2 text-gray-800 font-medium">{field.isCurrent ? "Present" : (field.endDate || "Not provided")}</p>
                                    )}
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <components.Label htmlFor={`experience.${index}.description`}>Description</components.Label>
                                    {isEditing ? (
                                        <components.Textarea id={`experience.${index}.description`} name={`experience.${index}.description`} rows="3" value={field.description || ""} onChange={handleChange} placeholder="Describe your responsibilities and achievements." />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium whitespace-pre-wrap">{field.description || "Not provided"}</p>
                                    )}
                                </div>
                            </>
                        );
                    })}

                    <components.Separator />

                    {/* Skills Section */}
                    <div className="space-y-4">
                        <h3 className="flex items-center text-xl font-bold text-gray-900">
                            <Trophy className="mr-3 h-5 w-5 text-amber-600" /> Skills
                        </h3>
                        {isEditing ? (
                            <div className="flex space-x-2">
                                <components.Input
                                    type="text"
                                    placeholder="Enter a skill"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    className="flex-1"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill();
                                        }
                                    }}
                                />
                                <components.Button type="button" variant="secondary" className="px-4" onClick={handleAddSkill}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add
                                </components.Button>
                            </div>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                            {(formData.skills || []).length > 0 ? (
                                (formData.skills || []).map((skill, index) => (
                                    <div
                                        key={index}
                                        className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 text-sm font-medium text-blue-800"
                                    >
                                        {skill.name}
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveDynamicField('skills', index)}
                                                className="ml-2 -mr-1 text-gray-400 hover:text-gray-600"
                                            >
                                                <span className="sr-only">Remove skill</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    className="h-4 w-4"
                                                >
                                                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                !isEditing && <p className="text-gray-500 italic text-center py-4">No skills added yet.</p>
                            )}
                        </div>
                    </div>
                    <components.Separator />

                    {/* Location Section */}
                    <div className="space-y-4">
                        <h3 className="flex items-center text-xl font-bold text-gray-900">
                            <MapPin className="mr-3 h-5 w-5 text-red-600" /> Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <components.Label htmlFor="address.county">County</components.Label>
                                {isEditing ? (
                                    <components.Input
                                        id="address.county"
                                        name="address.county"
                                        value={formData.address?.county || "Kirinyaga"}
                                        onChange={handleChange}
                                        placeholder="County"
                                        readOnly
                                    />
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile?.address?.county || "Kirinyaga"}</p>
                                )}
                            </div>
                            
                            <div>
                                <components.Label htmlFor="address.subCounty">Sub-County</components.Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.address?.subCounty || ""}
                                        onValueChange={(value) => handleSelectChange('address', 'subCounty', value)}
                                        placeholder="Select a sub-county"
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
                                    <p className="mt-2 text-gray-800 font-medium">{profile?.address?.subCounty || "Not provided"}</p>
                                )}
                            </div>
                            <div>
                                <components.Label htmlFor="address.ward">Ward</components.Label>
                                {isEditing ? (
                                    <Select
                                        value={formData.address?.ward || ""}
                                        onValueChange={(value) => handleSelectChange('address', 'ward', value)}
                                        disabled={!selectedSubCounty}
                                        placeholder="Select a ward"
                                    >
                                        <SelectContent>
                                            {wards.length > 0 ? (
                                                wards.map((ward) => (
                                                    <SelectItem key={ward} value={ward}>
                                                        {ward}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="" disabled>No wards available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile?.address?.ward || "Not provided"}</p>
                                )}
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <components.Label htmlFor="address.details">Address Details</components.Label>
                                {isEditing ? (
                                    <components.Input
                                        id="address.details"
                                        name="address.details"
                                        value={formData.address?.details || ""}
                                        onChange={handleChange}
                                        placeholder="e.g., Mutithi Road, House No. 123"
                                    />
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile?.address?.details || "Not provided"}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <components.Separator />
                    
                    {/* Resume Upload Section */}
                    <div className="space-y-4">
                        <h3 className="flex items-center text-xl font-bold text-gray-900">
                            <FileText className="mr-3 h-5 w-5 text-green-600" /> Resume
                        </h3>
                        {isEditing ? (
                            <div className="flex items-center space-x-4">
                                <components.Label htmlFor="resume" className="cursor-pointer">
                                    <span className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md">
                                        <Upload className="mr-2 h-5 w-5" /> Choose File
                                    </span>
                                    <input
                                        type="file"
                                        id="resume"
                                        name="resume"
                                        ref={resumeInputRef}
                                        onChange={handleResumeUpload}
                                        className="hidden"
                                        accept=".pdf"
                                    />
                                </components.Label>
                                {resumeFile && (
                                    <span className="text-sm font-medium text-gray-500">
                                        {resumeFile.name}
                                    </span>
                                )}
                            </div>
                        ) : (
                           <p className="text-gray-500 italic">
                                {profile?.resumePath ? (
                                    <a href={profile.resumePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors duration-200">
                                        View Resume
                                    </a>
                                ) : "No resume uploaded yet."}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons - Only show in edit mode */}
                    {isEditing && (
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4 mt-8">
                            {hasProfile && (
                                <components.Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </components.Button>
                            )}
                            <components.Button
                                type="submit"
                                variant="primary"
                                disabled={isUpdating}
                                className="min-w-[140px]"
                            >
                                {isUpdating ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {hasProfile ? "Updating..." : "Creating..."}</>
                                ) : (
                                    hasProfile ? "Save Changes" : "Create Profile"
                                )}
                            </components.Button>
                        </div>
                    )}
                </form>

                {/* Show Edit Button when not in edit mode and profile exists */}
                {!isEditing && hasProfile && (
                    <div className="flex justify-end mt-8">
                        <components.Button
                            type="button"
                            variant="primary"
                            onClick={() => setIsEditing(true)}
                        >
                            <Edit className="mr-2 h-4 w-4" /> Edit Profile
                        </components.Button>
                    </div>
                )}
            </components.CardContent>
        </div>
    );
};