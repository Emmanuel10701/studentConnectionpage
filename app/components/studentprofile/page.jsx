'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { toast, Toaster } from 'react-hot-toast';
import { Loader2, User, FileText, Upload, ChevronLeft, CheckCircle, PlusCircle, MinusCircle, Briefcase, GraduationCap, Trophy, MapPin } from 'lucide-react';
import { format } from 'date-fns';

// Helper function to get initials for the avatar fallback
const getInitials = (name) => {
    if (!name) return "";
    const nameParts = name.split(" ");
    return nameParts.map(part => part[0]).join("").toUpperCase();
};

// Mock components to make the code self-contained and runnable
const components = {
  Button: ({ children, ...props }) => <button {...props} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">{children}</button>,
  Input: (props) => <input {...props} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />,
  Label: (props) => <label {...props} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" />,
  Textarea: (props) => <textarea {...props} className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />,
  Card: ({ children, className, ...props }) => <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`} {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div className="flex flex-col space-y-1.5 p-6" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }) => <h3 className="text-2xl font-semibold leading-none tracking-tight" {...props}>{children}</h3>,
  CardDescription: ({ children, ...props }) => <p className="text-sm text-muted-foreground" {...props}>{children}</p>,
  CardContent: ({ children, ...props }) => <div className="p-6 pt-0" {...props}>{children}</div>,
  Separator: () => <div className="shrink-0 bg-border h-[1px] w-full"></div>,
  Avatar: ({ children, className }) => <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>,
  AvatarFallback: ({ children, className, ...props }) => <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`} {...props}>{children}</div>,
};

// Data for Kirinyaga locations
const kirinyagaLocations = {
    Mwea: ["Mutithi", "Kangai", "Wamumu", "Nyangati", "Murinduko", "Gathigiriri", "Tebere", "Thiba"],
    Gichugu: ["Kabare", "Baragwi", "Njukiini", "Ngariama", "Karumandi"],
    Ndia: ["Mukure", "Kiine", "Kariti"],
    "Kirinyaga Central": ["Mutira", "Kanyekini", "Kerugoya", "Inoi"]
};

// The main StudentProfile component
const StudentProfile = ({ profile, setProfile, onGoBack, resumeFile, setResumeFile }) => {
    const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: profile
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const resumeInputRef = useRef(null);

    // New state for avatar background color
    const [avatarBgColor, setAvatarBgColor] = useState('#1e40af'); // Default blue

    const avatarColors = [
      '#1e40af', // blue
      '#dc2626', // red
      '#713f12', // brown
      '#4b5563', // gray
      '#059669', // green
      '#9333ea'  // purple
    ];

    // Use useFieldArray for dynamic fields
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

    // Watch for changes to the selected sub-county to update the wards list
    const selectedSubCounty = watch("address.subCounty");
    const wards = kirinyagaLocations[selectedSubCounty] || [];

    // Reset ward if sub-county changes
    useEffect(() => {
        if (wards.length > 0 && !wards.includes(watch("address.ward"))) {
            setValue("address.ward", "");
        }
    }, [selectedSubCounty, wards, setValue, watch]);


    const onSubmit = async (data) => {
        setIsUpdating(true);
        try {
            // Mock API call to update profile. This is where you would make your actual API call.
            // Example of a POST request:
            // const response = await fetch('/api/update-student-profile', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ ...data, resumeFile: resumeFile ? resumeFile.name : null })
            // });
            // if (!response.ok) throw new Error('Network response was not ok');
            // const result = await response.json();
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // On success, update the local profile state
            setProfile(prevProfile => ({ ...prevProfile, ...data }));
            toast.success('Profile updated successfully!');
            console.log('Form Data Submitted:', data);
        } catch (error) {
            toast.error('Failed to update profile. Please try again.');
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
    
    return (
        <div className="p-4 sm:p-8">
            <Toaster />
            <div className="mb-6">
                <components.Button variant="ghost" onClick={onGoBack} className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Go Back
                </components.Button>
            </div>
            
            <components.Card className="max-w-5xl mx-auto border border-gray-200 shadow-lg rounded-2xl">
                <components.CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="flex items-center">
                        <User className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <components.CardTitle className="text-gray-900">My Profile</components.CardTitle>
                            <components.CardDescription>Update your personal and academic details for employers to see.</components.CardDescription>
                        </div>
                    </div>
                </components.CardHeader>
                <components.CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <h3 className="flex items-center text-xl font-semibold text-gray-900">
                                <User className="mr-2 h-5 w-5 text-blue-600" /> Personal Information
                            </h3>
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-4 sm:space-y-0">
                                <div className="flex flex-col items-center">
                                    <components.Avatar className="w-28 h-28 text-5xl font-bold text-white mb-2">
                                        <components.AvatarFallback style={{ backgroundColor: avatarBgColor }}>
                                            {getInitials("Emmanuel Makau")}
                                        </components.AvatarFallback>
                                    </components.Avatar>
                                    <div className="flex space-x-2">
                                        {avatarColors.map(color => (
                                            <button 
                                                key={color} 
                                                type="button" 
                                                onClick={() => setAvatarBgColor(color)} 
                                                className="w-6 h-6 rounded-full border-2 border-white shadow-md transition-transform transform hover:scale-110"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <components.Label htmlFor="name" className="mb-2">Full Name</components.Label>
                                        <components.Input 
                                            type="text" 
                                            id="name" 
                                            {...register("name", { required: "Name is required" })} 
                                            placeholder="Your full name"
                                            readOnly // Name is fixed
                                        />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                                    </div>
                                    
                                    <div>
                                        <components.Label htmlFor="email" className="mb-2">Email Address</components.Label>
                                        <components.Input 
                                            type="email" 
                                            id="email" 
                                            {...register("email", { required: "Email is required" })} 
                                            placeholder="your-email@example.com"
                                        />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <components.Label htmlFor="bio" className="mb-2">Bio</components.Label>
                                    <components.Textarea
                                        id="bio" 
                                        rows="4"
                                        {...register("bio")} 
                                        placeholder="Tell us about yourself and your aspirations..."
                                    />
                                </div>
                                <div>
                                    <components.Label htmlFor="summary" className="mb-2">Professional Summary</components.Label>
                                    <components.Textarea
                                        id="summary" 
                                        rows="4"
                                        {...register("summary")} 
                                        placeholder="Briefly describe your professional goals and skills for employers."
                                    />
                                </div>
                            </div>
                        </div>

                        <components.Separator />

                        {/* Education Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center text-xl font-semibold text-gray-900">
                                    <GraduationCap className="mr-2 h-5 w-5 text-purple-600" /> Education
                                </h3>
                                <components.Button type="button" variant="ghost" onClick={() => appendEducation({ school: "", degree: "", fieldOfStudy: "", graduationYear: "" })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Education
                                </components.Button>
                            </div>
                            {educationFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50">
                                    <div className="col-span-2 flex justify-end">
                                        <components.Button type="button" variant="ghost" onClick={() => removeEducation(index)}>
                                            <MinusCircle className="h-4 w-4 text-red-500" />
                                        </components.Button>
                                    </div>
                                    <div>
                                        <components.Label htmlFor={`education.${index}.school`}>Institution</components.Label>
                                        <components.Input id={`education.${index}.school`} {...register(`education.${index}.school`)} placeholder="e.g., University of Technology" />
                                    </div>
                                    <div>
                                        <components.Label htmlFor={`education.${index}.degree`}>Degree</components.Label>
                                        <components.Input id={`education.${index}.degree`} {...register(`education.${index}.degree`)} placeholder="e.g., Bachelor of Science" />
                                    </div>
                                    <div>
                                        <components.Label htmlFor={`education.${index}.fieldOfStudy`}>Course of Study</components.Label>
                                        <components.Input id={`education.${index}.fieldOfStudy`} {...register(`education.${index}.fieldOfStudy`)} placeholder="e.g., Computer Science" />
                                    </div>
                                    <div>
                                        <components.Label htmlFor={`education.${index}.graduationYear`}>Graduation Year</components.Label>
                                        <components.Input type="number" id={`education.${index}.graduationYear`} {...register(`education.${index}.graduationYear`)} placeholder="e.g., 2025" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <components.Separator />
                        
                        {/* Experience Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="flex items-center text-xl font-semibold text-gray-900">
                                    <Briefcase className="mr-2 h-5 w-5 text-cyan-600" /> Work Experience
                                </h3>
                                <components.Button type="button" variant="ghost" onClick={() => appendExperience({ title: "", company: "", startDate: "", endDate: "", description: "" })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
                                </components.Button>
                            </div>
                            {experienceFields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50">
                                    <div className="col-span-2 flex justify-end">
                                        <components.Button type="button" variant="ghost" onClick={() => removeExperience(index)}>
                                            <MinusCircle className="h-4 w-4 text-red-500" />
                                        </components.Button>
                                    </div>
                                    <div>
                                        <components.Label htmlFor={`experience.${index}.title`}>Position</components.Label>
                                        <components.Input id={`experience.${index}.title`} {...register(`experience.${index}.title`)} placeholder="e.g., Junior Developer" />
                                    </div>
                                    <div>
                                        <components.Label htmlFor={`experience.${index}.company`}>Company</components.Label>
                                        <components.Input id={`experience.${index}.company`} {...register(`experience.${index}.company`)} placeholder="e.g., Tech Solutions Inc." />
                                    </div>
                                    <div>
                                        <components.Label htmlFor={`experience.${index}.startDate`}>Start Date</components.Label>
                                        <components.Input type="date" id={`experience.${index}.startDate`} {...register(`experience.${index}.startDate`)} />
                                    </div>
                                    <div>
                                        <components.Label htmlFor={`experience.${index}.endDate`}>End Date (or Present)</components.Label>
                                        <components.Input type="date" id={`experience.${index}.endDate`} {...register(`experience.${index}.endDate`)} />
                                    </div>
                                    <div className="col-span-2">
                                        <components.Label htmlFor={`experience.${index}.description`}>Job Description</components.Label>
                                        <components.Textarea id={`experience.${index}.description`} rows="3" {...register(`experience.${index}.description`)} placeholder="Key responsibilities and achievements..." />
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <components.Separator />

                        {/* Achievements & Certifications Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center text-xl font-semibold text-gray-900">
                                        <Trophy className="mr-2 h-5 w-5 text-amber-600" /> Achievements
                                    </h3>
                                    <components.Button type="button" variant="ghost" onClick={() => appendAchievement({ name: "" })}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                                    </components.Button>
                                </div>
                                {achievementsFields.map((field, index) => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <components.Input {...register(`achievements.${index}.name`)} placeholder="e.g., Dean's List 2023" />
                                        <components.Button type="button" variant="ghost" onClick={() => removeAchievement(index)}>
                                            <MinusCircle className="h-4 w-4 text-red-500" />
                                        </components.Button>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center text-xl font-semibold text-gray-900">
                                        <FileText className="mr-2 h-5 w-5 text-green-600" /> Certifications
                                    </h3>
                                    <components.Button type="button" variant="ghost" onClick={() => appendCertification({ name: "", issuingBody: "" })}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                                    </components.Button>
                                </div>
                                {certificationsFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 gap-2">
                                        <components.Input {...register(`certifications.${index}.name`)} placeholder="Certificate Name" />
                                        <div className="flex items-center gap-2">
                                            <components.Input {...register(`certifications.${index}.issuingBody`)} placeholder="Issuing Body" />
                                            <components.Button type="button" variant="ghost" onClick={() => removeCertification(index)}>
                                                <MinusCircle className="h-4 w-4 text-red-500" />
                                            </components.Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <components.Separator />

                        {/* Address and Contact Information Section */}
                        <div className="space-y-6">
                            <h3 className="flex items-center text-xl font-semibold text-gray-900">
                                <MapPin className="mr-2 h-5 w-5 text-teal-600" /> Contact & Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <components.Label htmlFor="county">County</components.Label>
                                    <components.Input type="text" id="county" {...register("address.county")} defaultValue="Kirinyaga" readOnly />
                                </div>
                                <div>
                                    <components.Label htmlFor="subCounty">Sub-county</components.Label>
                                    <Controller
                                        name="address.subCounty"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Sub-county" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(kirinyagaLocations).map(subCounty => (
                                                        <SelectItem key={subCounty} value={subCounty}>{subCounty}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div>
                                    <components.Label htmlFor="ward">Ward</components.Label>
                                    <Controller
                                        name="address.ward"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSubCounty}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Ward" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {wards.map(ward => (
                                                        <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                                    <components.Label htmlFor="address.details">Street/Estate/Building</components.Label>
                                    <components.Input id="address.details" {...register("address.details")} placeholder="e.g., Mwea Estate, Block 5" />
                                </div>
                            </div>
                        </div>

                        <components.Separator />

                        {/* Resume Upload Section */}
                        <div className="space-y-6">
                            <h4 className="flex items-center text-xl font-semibold text-gray-900 mb-4">
                                <FileText className="mr-2 text-green-600" size={20} /> Upload Resume
                            </h4>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <components.Input 
                                    id="resume" 
                                    type="file" 
                                    accept=".pdf,.doc,.docx"
                                    ref={resumeInputRef}
                                    className="w-full md:w-auto"
                                />
                                <components.Button
                                    type="button"
                                    onClick={handleResumeUpload}
                                    className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full"
                                >
                                    <Upload className="h-4 w-4 mr-2" /> Upload
                                </components.Button>
                            </div>
                            {resumeFile && (
                                <div className="mt-4 text-sm text-gray-600 flex items-center gap-2">
                                    <CheckCircle size={16} className="text-green-500"/>
                                    <span>Resume uploaded: <b>{resumeFile.name}</b></span>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <components.Button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full sm:w-auto px-8 py-3 text-lg rounded-full"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Updating Profile...
                                    </>
                                ) : (
                                    "Save All Changes"
                                )}
                            </components.Button>
                        </div>
                    </form>
                </components.CardContent>
            </components.Card>
        </div>
    );
};

const App = () => {
    const [profile, setProfile] = useState({
        name: "Emmanuel Makau",
        email: "emmanuel.makau@example.com",
        bio: "A passionate student developer with a keen interest in building scalable web applications. Eager to learn new technologies and contribute to open source projects.",
        summary: "I am a motivated and detail-oriented software engineering student with hands-on experience in full-stack development and cloud computing. I am seeking opportunities to apply my skills in a professional setting.",
        address: {
            county: "Kirinyaga",
            subCounty: "Mwea",
            ward: "Kangai",
            details: "Mutithi Road, House No. 123"
        },
        education: [
            { school: "University of Technology", degree: "Bachelor of Science", fieldOfStudy: "Software Engineering", graduationYear: "2025" }
        ],
        experience: [
            { title: "Intern Developer", company: "Innovative Solutions Ltd.", startDate: "2023-06-01", endDate: "2023-08-31", description: "Assisted in the development of a web-based project management tool. Gained experience with React, Node.js, and PostgreSQL." }
        ],
        achievements: [
            { name: "First Place, University Hackathon 2024" },
            { name: "Dean's List for Academic Excellence" }
        ],
        certifications: [
            { name: "AWS Certified Cloud Practitioner", issuingBody: "Amazon Web Services" }
        ]
    });
    const [resumeFile, setResumeFile] = useState(null);
    const [showProfile, setShowProfile] = useState(true);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="p-4 shadow-sm bg-white">
                <nav className="max-w-5xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
                </nav>
            </header>
            <main className="container mx-auto py-8">
                {showProfile ? (
                    <StudentProfile 
                        profile={profile} 
                        setProfile={setProfile} 
                        onGoBack={() => console.log('Go Back')} 
                        resumeFile={resumeFile} 
                        setResumeFile={setResumeFile} 
                    />
                ) : (
                    <div className="p-8 text-center">
                        <components.Button onClick={() => setShowProfile(true)}>View Profile</components.Button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
