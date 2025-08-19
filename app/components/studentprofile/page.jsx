'use client';

import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, User, FileText, Upload, ChevronLeft, CheckCircle, PlusCircle, MinusCircle, Briefcase, GraduationCap, Trophy, MapPin, ChevronDown, Edit } from 'lucide-react';

// Helper function to get initials for the avatar fallback
const getInitials = (name) => {
    if (!name) return "S"; // Default for empty name
    const nameParts = name.split(" ");
    return nameParts.map(part => part[0]).join("").toUpperCase();
};

// --- Mock Select Component Implementation ---
// These components mimic the behavior of a real UI library to make the app self-contained.
// A Context is used to share state between the parent Select and its children.
const SelectContext = createContext();

const Select = ({ value, onValueChange, children, disabled }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close the dropdown when clicking outside
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

    // Pass items to context for the trigger to find the selected label
    const items = React.Children.toArray(children).find(child => child.type === SelectContent)?.props.children || [];
    const itemMap = React.Children.toArray(items).reduce((acc, item) => {
      acc[item.props.value] = item.props.children;
      return acc;
    }, {});

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen, disabled, itemMap }}>
            <div ref={containerRef} className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = ({ placeholder }) => {
    const { open, setOpen, value, disabled, itemMap } = useContext(SelectContext);
    const displayText = value ? itemMap[value] : placeholder;

    return (
        <button
            type="button"
            className={`flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-base shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${disabled ? 'cursor-not-allowed opacity-50 bg-gray-100' : ''}`}
            onClick={() => setOpen(!open)}
            disabled={disabled}
        >
            <span className={!value ? 'text-gray-400' : 'text-gray-900'}>
                {displayText}
            </span>
            <ChevronDown className={`h-5 w-5 shrink-0 opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </button>
    );
};

const SelectContent = ({ children }) => {
    const { open } = useContext(SelectContext);
    return open && (
        <div className="absolute z-50 w-full min-w-[8rem] overflow-hidden rounded-lg border border-gray-200 bg-white text-gray-800 shadow-xl animate-in fade-in-80 mt-1">
            <div className="max-h-60 overflow-y-auto">
                {children}
            </div>
        </div>
    );
};

const SelectItem = ({ value, children }) => {
    const { onValueChange, setOpen, value: selectedValue } = useContext(SelectContext);
    const isSelected = selectedValue === value;
    return (
        <div
            className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-4 pr-8 text-base outline-none transition-colors hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
            onClick={() => {
                onValueChange(value);
                setOpen(false);
            }}
        >
            {children}
            {isSelected && <span className="absolute right-3 flex h-4 w-4 items-center justify-center"><CheckCircle className="h-5 w-5" /></span>}
        </div>
    );
};

// Mock components to make the code self-contained and runnable
const components = {
    Button: ({ children, className, variant, ...props }) => {
        const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-12 px-6 py-3 shadow-lg";
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
            secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:ring-gray-500",
            ghost: "bg-transparent text-gray-600 hover:bg-gray-100 shadow-none",
            gradient: "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 focus-visible:ring-indigo-500"
        };
        const finalClassName = `${baseStyle} ${variants[variant] || variants.primary} ${className || ''}`;
        return <button {...props} className={finalClassName}>{children}</button>;
    },
    Input: (props) => <input {...props} className="flex h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100" />,
    Label: (props) => <label {...props} className="text-sm font-medium leading-none text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />,
    Textarea: (props) => <textarea {...props} className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100" />,
    Card: ({ children, className, ...props }) => <div className={`rounded-none sm:rounded-3xl border-0 sm:border border-gray-200 bg-white text-gray-900 shadow-none sm:shadow-2xl transition-all duration-300 ease-in-out sm:hover:shadow-3xl ${className}`} {...props}>{children}</div>,
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

// The main StudentProfile component, now handling view and edit modes
const StudentProfile = ({ profile, setProfile, isEditing, setIsEditing, onSaveProfile, resumeFile, setResumeFile }) => {
    const { register, control, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
        defaultValues: profile
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const resumeInputRef = useRef(null);
    const [avatarBgColor, setAvatarBgColor] = useState(profile.avatarColor || '#1e40af');
    const [skillInput, setSkillInput] = useState(''); // New state for the skill input field

    const avatarColors = [
      '#1e40af', // blue
      '#dc2626', // red
      '#713f12', // brown
      '#4b5563', // gray
      '#059669', // green
      '#9333ea'  // purple
    ];

    // Use useFieldArray for dynamic fields, with Framer Motion layout
    const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
        control,
        name: "education"
    });
    const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
        control,
        name: "experience"
    });
    const { fields: achievementsFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
        control,
        name: "achievements"
    });
    const { fields: certificationsFields, append: appendCertification, remove: removeCertification } = useFieldArray({
        control,
        name: "certifications"
    });
    // Use useFieldArray for skills
    const { fields: skillsFields, append: appendSkill, remove: removeSkill } = useFieldArray({
        control,
        name: "skills"
    });

    const selectedSubCounty = watch("address.subCounty");
    const wards = kirinyagaLocations[selectedSubCounty] || [];

    // Reset ward if sub-county changes when in editing mode
    useEffect(() => {
        if (isEditing && wards.length > 0 && !wards.includes(watch("address.ward"))) {
            setValue("address.ward", "");
        }
    }, [selectedSubCounty, wards, setValue, watch, isEditing]);

    const onSubmit = async (data) => {
        setIsUpdating(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            onSaveProfile({ ...data, avatarColor: avatarBgColor });
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

    // New function to handle adding a skill
    const handleAddSkill = () => {
      const trimmedSkill = skillInput.trim();
      // Check for empty input and max limit
      if (trimmedSkill === '') {
        toast.error("Skill cannot be empty.");
        return;
      }
      if (skillsFields.length >= 10) {
        toast.error("You can add a maximum of 10 skills.");
        return;
      }
      // Check if skill already exists
      const existingSkills = skillsFields.map(s => s.name.toLowerCase());
      if (existingSkills.includes(trimmedSkill.toLowerCase())) {
        toast.error("Skill already added.");
        return;
      }
      appendSkill({ name: trimmedSkill });
      setSkillInput(''); // Clear the input field
    };

    // Use a unified view for both reading and editing, conditionally rendering inputs/read-only text
    const renderField = (label, name, type, placeholder, isRequired = false, isReadOnly = false) => (
        <div>
            <components.Label htmlFor={name}>{label}</components.Label>
            {isEditing ? (
                <components.Input
                    id={name}
                    type={type}
                    {...register(name, { required: isRequired ? `${label} is required` : false })}
                    placeholder={placeholder}
                    readOnly={isReadOnly}
                />
            ) : (
                <p className="mt-2 text-gray-800 font-medium">{profile[name] || "Not provided"}</p>
            )}
            {isEditing && errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>}
        </div>
    );

    const renderDynamicSection = (fields, append, remove, name, icon, title, renderItems) => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    {icon} {title}
                </h3>
                {isEditing && (name !== 'skills') && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <components.Button type="button" variant="secondary" onClick={() => append({})} className="shadow-none">
                          <PlusCircle className="mr-2 h-4 w-4" /> Add
                      </components.Button>
                    </motion.div>
                )}
            </div>
            <AnimatePresence>
                {fields.length > 0 ? (
                    fields.map((field, index) => (
                        <motion.div
                            key={field.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            layout // This enables smooth layout transitions
                            className="relative grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {isEditing && (name !== 'skills') && (
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <components.Button type="button" variant="ghost" onClick={() => remove(index)} className="absolute top-2 right-2 p-2">
                                        <MinusCircle className="h-5 w-5 text-red-500" />
                                    </components.Button>
                                </motion.div>
                            )}
                            {renderItems(field, index, isEditing, register, watch, setValue, remove)}
                        </motion.div>
                    ))
                ) : (
                    !isEditing && <p className="text-gray-500 italic">No {title.toLowerCase()} added yet.</p>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="p-4 sm:p-8 "
        >
            <components.CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-8">
                <div className="flex flex-col space-y-1">
                    <components.CardTitle className="text-gray-900">{isEditing ? "Edit Profile" : "My Profile"}</components.CardTitle>
                    <components.CardDescription>{isEditing ? "Update your details and save to finalize." : "Your profile information visible to employers."}</components.CardDescription>
                </div>
                {!isEditing && Object.keys(profile).length > 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <components.Button variant="secondary" className="mt-4 sm:mt-0" onClick={() => setIsEditing(true)}>
                          <Edit className="mr-2 h-5 w-5" /> Edit Profile
                      </components.Button>
                    </motion.div>
                )}
            </components.CardHeader>
            <components.CardContent className="p-4 sm:p-8 pt-0">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                    {/* Personal Information Section */}
                    <div className="space-y-8">
                        <h3 className="flex items-center text-2xl font-bold text-gray-900">
                            <User className="mr-3 h-6 w-6 text-blue-600" /> Personal Information
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-12 space-y-6 sm:space-y-0">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="flex flex-col items-center"
                            >
                                <components.Avatar className="w-32 h-32 text-6xl font-extrabold text-white mb-4">
                                    <components.AvatarFallback style={{ backgroundColor: avatarBgColor }}>
                                        {getInitials(profile.name || "")}
                                    </components.AvatarFallback>
                                </components.Avatar>
                                {isEditing && (
                                    <div className="flex space-x-3">
                                        {avatarColors.map(color => (
                                            <motion.button
                                                key={color}
                                                type="button"
                                                onClick={() => setAvatarBgColor(color)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="w-8 h-8 rounded-full border-4 border-white shadow-lg transition-transform"
                                                style={{ backgroundColor: color, outline: avatarBgColor === color ? '2px solid #3b82f6' : 'none', outlineOffset: '2px' }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <components.Label htmlFor="name">Full Name</components.Label>
                                    {isEditing ? (
                                        <components.Input
                                            type="text"
                                            id="name"
                                            {...register("name", { required: "Name is required" })}
                                            placeholder="Your full name"
                                        />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{profile.name}</p>
                                    )}
                                    {isEditing && errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <components.Label htmlFor="email">Email Address</components.Label>
                                    {isEditing ? (
                                        <components.Input
                                            type="email"
                                            id="email"
                                            {...register("email", { required: "Email is required" })}
                                            placeholder="your-email@example.com"
                                        />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{profile.email}</p>
                                    )}
                                    {isEditing && errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <components.Label htmlFor="summary">Professional Summary</components.Label>
                                    {isEditing ? (
                                        <components.Textarea
                                            id="summary"
                                            rows="4"
                                            {...register("summary")}
                                            placeholder="Briefly describe your professional goals and skills for employers."
                                        />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium whitespace-pre-wrap">{profile.summary}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <components.Separator />

                    {/* Education Section */}
                    {renderDynamicSection(educationFields, appendEducation, removeEducation, "education", <GraduationCap className="text-purple-600" />, "Education", (field, index, isEditing, register, watch) => {
                        const isCurrent = watch(`education.${index}.isCurrent`);
                        return (
                            <>
                                <div>
                                    <components.Label htmlFor={`education.${index}.school`}>Institution</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.school`} {...register(`education.${index}.school`)} placeholder="e.g., University of Technology" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.school}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`education.${index}.degree`}>Degree</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.degree`} {...register(`education.${index}.degree`)} placeholder="e.g., Bachelor of Science" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.degree}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`education.${index}.fieldOfStudy`}>Course of Study</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`education.${index}.fieldOfStudy`} {...register(`education.${index}.fieldOfStudy`)} placeholder="e.g., Computer Science" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.fieldOfStudy}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                      <components.Label htmlFor={`education.${index}.graduationYear`}>Graduation Year</components.Label>
                                      {isEditing && (
                                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <input type="checkbox" id={`education.${index}.isCurrent`} {...register(`education.${index}.isCurrent`)} className="rounded text-blue-600" />
                                            <label htmlFor={`education.${index}.isCurrent`}>Currently Studying</label>
                                          </div>
                                      )}
                                    </div>
                                    {isEditing ? (
                                        <components.Input type="number" id={`education.${index}.graduationYear`} {...register(`education.${index}.graduationYear`)} placeholder="e.g., 2025" disabled={isCurrent} />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.isCurrent ? "Present" : field.graduationYear}</p>
                                    )}
                                </div>
                            </>
                        );
                    })}
                    
                    <components.Separator />
                    
                    {/* Work Experience Section */}
                    {renderDynamicSection(experienceFields, appendExperience, removeExperience, "experience", <Briefcase className="text-cyan-600" />, "Work Experience", (field, index, isEditing, register, watch) => {
                        const isCurrent = watch(`experience.${index}.isCurrent`);
                        return (
                            <>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.title`}>Position</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`experience.${index}.title`} {...register(`experience.${index}.title`)} placeholder="e.g., Junior Developer" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.title}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.company`}>Company</components.Label>
                                    {isEditing ? (
                                        <components.Input id={`experience.${index}.company`} {...register(`experience.${index}.company`)} placeholder="e.g., Tech Solutions Inc." />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.company}</p>
                                    )}
                                </div>
                                <div>
                                    <components.Label htmlFor={`experience.${index}.startDate`}>Start Date</components.Label>
                                    {isEditing ? (
                                        <components.Input type="date" id={`experience.${index}.startDate`} {...register(`experience.${index}.startDate`)} />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.startDate}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                      <components.Label htmlFor={`experience.${index}.endDate`}>End Date</components.Label>
                                      {isEditing && (
                                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <input type="checkbox" id={`experience.${index}.isCurrent`} {...register(`experience.${index}.isCurrent`)} className="rounded text-blue-600" />
                                            <label htmlFor={`experience.${index}.isCurrent`}>Currently Working</label>
                                          </div>
                                      )}
                                    </div>
                                    {isEditing ? (
                                        <components.Input type="date" id={`experience.${index}.endDate`} {...register(`experience.${index}.endDate`)} disabled={isCurrent} />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.isCurrent ? "Present" : field.endDate}</p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <components.Label htmlFor={`experience.${index}.description`}>Job Description</components.Label>
                                    {isEditing ? (
                                        <components.Textarea id={`experience.${index}.description`} rows="3" {...register(`experience.${index}.description`)} placeholder="Key responsibilities and achievements..." />
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
                        <h3 className="flex items-center text-xl font-semibold text-gray-900">
                            <Briefcase className="mr-3 h-6 w-6 text-indigo-600" /> Skills
                        </h3>
                        {isEditing ? (
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
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <components.Button 
                                        type="button" 
                                        onClick={handleAddSkill} 
                                        disabled={skillsFields.length >= 10 || skillInput.trim() === ''}
                                        className="w-full sm:w-auto h-12"
                                    >
                                        <PlusCircle className="mr-2 h-5 w-5" /> Add
                                    </components.Button>
                                </motion.div>
                            </div>
                        ) : (
                            // Read-only display of skills
                            <div className="flex flex-wrap gap-2">
                                {skillsFields.length > 0 ? (
                                    skillsFields.map((skill, index) => (
                                        <div key={skill.id} className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 px-4 py-2 text-sm font-medium">
                                            {skill.name}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No skills added yet.</p>
                                )}
                            </div>
                        )}

                        {/* Display of skills with remove button */}
                        {isEditing && (
                            <div className="flex flex-wrap gap-2">
                                {skillsFields.map((field, index) => (
                                    <motion.div
                                        key={field.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="inline-flex items-center rounded-full bg-blue-100 text-blue-700 pr-2 pl-4 py-2 text-sm font-medium"
                                        layout
                                    >
                                        {field.name}
                                        <motion.button 
                                            type="button" 
                                            onClick={() => removeSkill(index)} 
                                            className="ml-2 h-6 w-6 rounded-full text-blue-500 hover:text-red-600 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <MinusCircle className="h-4 w-4" />
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <components.Separator />

                    {/* Achievements & Certifications Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {renderDynamicSection(achievementsFields, appendAchievement, removeAchievement, "achievements", <Trophy className="text-amber-600" />, "Achievements", (field, index, isEditing, register) => (
                            <>
                                <div className="col-span-2">
                                    <components.Label htmlFor={`achievements.${index}.name`}>Achievement</components.Label>
                                    {isEditing ? (
                                        <components.Input {...register(`achievements.${index}.name`)} placeholder="e.g., Dean's List 2023" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.name}</p>
                                    )}
                                </div>
                            </>
                        ))}
                        {renderDynamicSection(certificationsFields, appendCertification, removeCertification, "certifications", <FileText className="text-green-600" />, "Certifications", (field, index, isEditing, register) => (
                            <>
                                <div className="col-span-2">
                                    <components.Label htmlFor={`certifications.${index}.name`}>Certificate Name</components.Label>
                                    {isEditing ? (
                                        <components.Input {...register(`certifications.${index}.name`)} placeholder="e.g., AWS Certified Cloud Practitioner" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.name}</p>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <components.Label htmlFor={`certifications.${index}.issuingBody`}>Issuing Body</components.Label>
                                    {isEditing ? (
                                        <components.Input {...register(`certifications.${index}.issuingBody`)} placeholder="e.g., Amazon Web Services" />
                                    ) : (
                                        <p className="mt-2 text-gray-800 font-medium">{field.issuingBody}</p>
                                    )}
                                </div>
                            </>
                        ))}
                    </div>

                    <components.Separator />

                    {/* Address Section */}
                    <div className="space-y-6">
                        <h3 className="flex items-center text-2xl font-bold text-gray-900">
                            <MapPin className="mr-3 h-6 w-6 text-teal-600" /> Contact & Location
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <components.Label htmlFor="phone">Phone Number</components.Label>
                                {isEditing ? (
                                    <components.Input id="phone" type="tel" {...register("phone")} placeholder="+254 7XX XXX XXX" />
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile.phone || "Not provided"}</p>
                                )}
                            </div>
                            <div>
                                <components.Label htmlFor="county">County</components.Label>
                                {isEditing ? (
                                    <Controller
                                        name="address.county"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger placeholder="Select County" />
                                                <SelectContent>
                                                    <SelectItem value="Kirinyaga">Kirinyaga</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile.address.county || "Not provided"}</p>
                                )}
                            </div>
                            <div>
                                <components.Label htmlFor="subCounty">Sub-County</components.Label>
                                {isEditing ? (
                                    <Controller
                                        name="address.subCounty"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!watch("address.county")}>
                                                <SelectTrigger placeholder="Select Sub-County" />
                                                <SelectContent>
                                                    {Object.keys(kirinyagaLocations).map(subCounty => (
                                                        <SelectItem key={subCounty} value={subCounty}>{subCounty}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile.address.subCounty || "Not provided"}</p>
                                )}
                            </div>
                            <div>
                                <components.Label htmlFor="ward">Ward</components.Label>
                                {isEditing ? (
                                    <Controller
                                        name="address.ward"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSubCounty}>
                                                <SelectTrigger placeholder="Select Ward" />
                                                <SelectContent>
                                                    {wards.map(ward => (
                                                        <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                ) : (
                                    <p className="mt-2 text-gray-800 font-medium">{profile.address.ward || "Not provided"}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <components.Separator />

                    {/* Resume Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="flex items-center text-xl font-semibold text-gray-900">
                                <FileText className="mr-3 h-6 w-6 text-gray-600" /> Resume / CV
                            </h3>
                            {isEditing && (
                                <components.Button type="button" variant="secondary" onClick={() => resumeInputRef.current?.click()} className="shadow-none">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                </components.Button>
                            )}
                        </div>
                        {isEditing && (
                            <components.Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                ref={resumeInputRef}
                                onChange={handleResumeUpload}
                                className="hidden"
                            />
                        )}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg bg-gray-50">
                            <span className="text-gray-600 font-medium">
                                {resumeFile ? `File: ${resumeFile.name}` : 'No resume uploaded.'}
                            </span>
                            {resumeFile && (
                                <components.Button
                                    type="button"
                                    onClick={() => setResumeFile(null)}
                                    variant="ghost"
                                    className="text-red-500 mt-2 sm:mt-0 shadow-none"
                                >
                                    <MinusCircle className="mr-2 h-4 w-4" /> Remove
                                </components.Button>
                            )}
                        </div>
                    </div>
                    
                    {/* Form Submission Buttons */}
                    {isEditing && (
                        <div className="flex justify-end space-x-4">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <components.Button type="button" variant="secondary" onClick={() => { setIsEditing(false); reset(profile); }}>
                                    <ChevronLeft className="mr-2 h-5 w-5" /> Cancel
                                </components.Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <components.Button type="submit" disabled={isUpdating}>
                                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </components.Button>
                            </motion.div>
                        </div>
                    )}
                </form>
            </components.CardContent>
        </motion.div>
    );
};

// Main App component to run the application
const App = () => {
    // Mock user profile data
    const [profile, setProfile] = useState({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        summary: "A dedicated student with a strong passion for software development and problem-solving. Seeking opportunities to apply learned skills in a practical environment.",
        phone: "+254712345678",
        address: {
            county: "Kirinyaga",
            subCounty: "Mwea",
            ward: "Mutithi"
        },
        education: [
            { school: "Jomo Kenyatta University of Agriculture and Technology", degree: "Bachelor of Science", fieldOfStudy: "Computer Science", isCurrent: true, graduationYear: "" }
        ],
        experience: [
            { title: "Junior Web Developer", company: "Local Devs Co.", startDate: "2023-01-01", endDate: "", isCurrent: true, description: "Developed and maintained responsive web applications using React and Node.js. Collaborated with a small team to deliver features on schedule." }
        ],
        achievements: [{ name: "First Place, Regional Hackathon 2024" }],
        certifications: [{ name: "React - The Complete Guide", issuingBody: "Udemy" }],
        skills: [{ name: "Teamwork" }, { name: "Programming" }, { name: "Problem soving" }]
    });
    const [isEditing, setIsEditing] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    const handleSaveProfile = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-10 font-sans antialiased text-gray-900 flex justify-center items-center">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full ">
                <components.Card>
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
        </div>
    );
};

export default App;
