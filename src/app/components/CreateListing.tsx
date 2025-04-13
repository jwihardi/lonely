"use client";

import { useState, useEffect } from "react";
import addToFirestore from "../AddListing/dbSender";
import { Edit2 } from "react-feather";
import BackButton from "./BackButton";
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"] as const;

export default function CreateListing({ username }: { username: any }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState(''); 
    const [requirements, setRequirements] = useState('');
    const [niceToHaves, setNiceToHaves] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [groupSize, setGroupSize] = useState<string | number>('');
    const [location, setLocation] = useState('virtual');
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [formErrors, setFormErrors] = useState({
        title: false,
        description: false,
        tags: false,
        groupSize: false
    });
    const [showErrors, setShowErrors] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCyHPkA6vHyUR_x9eYBkNjaK_e73Gq57PE",
        libraries,
        language: "en",
        region: "US"
    });

    const validateForm = () => {
        const errors = {
            title: title.trim() === '',
            description: description.trim() === '',
            tags: tags.length < 1 || tags.length > 5,
            groupSize: groupSize === ''
        };
        
        setFormErrors(errors);
        setShowErrors(true);
        setIsSubmitted(true);
        return !Object.values(errors).some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const success = await addToFirestore(
                username, 
                title, 
                description, 
                githubLink, 
                tags, 
                requirements, 
                niceToHaves, 
                groupSize,
                location
            );

            if (success) {
                window.location.href = "/AddListing/MyListing";
            }
        } catch (error) {
            console.error("Error creating listing:", error);
            alert("Error creating listing. Please try again.");
        }
    };

    useEffect(() => {
        const errors = {
            title: title.trim() === '',
            description: description.trim() === '',
            tags: tags.length < 1 || tags.length > 5,
            groupSize: groupSize === ''
        };
        
        setFormErrors(errors);
        setShowErrors(false);
        setIsSubmitted(false);
    }, [title, description, tags, groupSize]);

    return (
        <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full filter blur-3xl animate-float opacity-30" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse opacity-30" />
            
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-blue-400/5 to-cyan-400/5 rounded-2xl opacity-60 animate-pulse" />
                
                <form className="space-y-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-8 rounded-2xl border border-gray-800 shadow-2xl backdrop-blur-sm relative overflow-hidden transition-all duration-300 hover:shadow-green-900/20 hover:border-gray-700/80">
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-400/30 to-cyan-400/30 rotate-45 transform transition-transform duration-700 group-hover:-translate-y-2 group-hover:-translate-x-2 opacity-20" />
                    
                    <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
                    
                    <div className="text-center mb-8 relative">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer mb-2 relative inline-block">
                            Create New Listing
                            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-green-400/0 via-cyan-400/50 to-green-400/0 transform scale-x-0 transition-transform duration-700 group-hover:scale-x-100" />
                        </h2>
                        <p className="text-gray-400 mt-2 transition-all duration-300 group-hover:text-gray-300">Share your amazing project with the world</p>
                        
                        <div className="mt-6 flex justify-center items-center gap-4">
                            <BackButton />
                            <div className="relative group/icon">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-md opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                                <Edit2 className="w-6 h-6 text-cyan-400 transform transition-all duration-300 group-hover/icon:scale-110 relative z-10" />
                            </div>
                        </div>
                    </div>

                    <div className="group/input relative transition-all duration-300 hover:scale-[1.01]">
                        <label className="block text-sm font-medium mb-2 relative">
                            <div className="flex items-center mb-1">
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">Project Title</span>
                                <span className="text-red-500 ml-1 animate-pulse">*</span>
                            </div>
                            <div className="h-px w-0 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/input:w-24 transition-all duration-700" />
                        </label>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-lg blur opacity-0 group-hover/input:opacity-30 transition-opacity duration-300 -z-10" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-900/70 border rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 transition-all duration-300 ${
                                    showErrors && formErrors.title 
                                        ? 'border-red-500 focus:ring-red-500/30' 
                                        : 'border-gray-700 focus:border-green-400 focus:ring-green-400/30 group-hover/input:border-gray-600'
                                } backdrop-blur-sm`}
                                placeholder="T-Rex Project"
                                required
                            />
                            <div className="absolute top-0 right-0 mt-3 mr-3">
                                <div className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover/input:opacity-100 transition-all duration-300 delay-100" />
                            </div>
                        </div>
                        {showErrors && formErrors.title && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <span className="mr-1">⚠️</span> Project title is required
                            </p>
                        )}
                    </div>
                    <div className="group/input relative transition-all duration-300 hover:scale-[1.01]">
                        <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center mb-1">
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">Description</span>
                                <span className="text-red-500 ml-1 animate-pulse">*</span>
                            </div>
                            <div className="h-px w-0 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/input:w-24 transition-all duration-700" />
                        </label>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-lg blur opacity-0 group-hover/input:opacity-30 transition-opacity duration-300 -z-10" />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className={`w-full px-4 py-3 bg-gray-900/70 border rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 transition-all h-32 resize-none backdrop-blur-sm ${
                                    showErrors && formErrors.description 
                                        ? 'border-red-500 focus:ring-red-500/30' 
                                        : 'border-gray-700 focus:border-green-400 focus:ring-green-400/30 group-hover/input:border-gray-600'
                                }`}
                                placeholder="Describe your amazing project in detail..."
                            />
                            <div className="absolute top-0 right-0 mt-3 mr-3">
                                <div className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover/input:opacity-100 transition-all duration-300 delay-100" />
                            </div>
                        </div>
                        {showErrors && formErrors.description && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <span className="mr-1">⚠️</span> Project description is required
                            </p>
                        )}
                    </div>
                    <div className="group/input relative transition-all duration-300 hover:scale-[1.01]">
                        <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center mb-1">
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">GitHub Repository</span>
                            </div>
                            <div className="h-px w-0 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/input:w-24 transition-all duration-700" />
                        </label>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-lg blur opacity-0 group-hover/input:opacity-30 transition-opacity duration-300 -z-10" />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/input:text-gray-300 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/input:scale-110">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                            </div>
                            <input
                                type="url"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all backdrop-blur-sm group-hover/input:border-gray-600"
                                placeholder="https://github.com/username/repo"
                            />
                            <div className="absolute top-0 right-0 mt-3 mr-3">
                                <div className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover/input:opacity-100 transition-all duration-300 delay-100" />
                            </div>
                        </div>
                    </div>
                    <div className="group/input relative transition-all duration-300 hover:scale-[1.01]">
                        <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center mb-1">
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">Group Size</span>
                                <span className="text-red-500 ml-1 animate-pulse">*</span>
                            </div>
                            <div className="h-px w-0 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/input:w-24 transition-all duration-700" />
                        </label>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-lg blur opacity-0 group-hover/input:opacity-30 transition-opacity duration-300 -z-10" />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover/input:text-gray-300 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/input:scale-110">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                            </div>
                            <input
                                type="number"
                                value={groupSize}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setGroupSize(value === "" ? "" : parseInt(value));
                                }}
                                className={`w-full pl-10 pr-4 py-3 bg-gray-900/70 border rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 transition-all backdrop-blur-sm ${
                                    showErrors && formErrors.groupSize 
                                        ? 'border-red-500 focus:ring-red-500/30' 
                                        : 'border-gray-700 focus:border-green-400 focus:ring-green-400/30 group-hover/input:border-gray-600'
                                }`}
                                placeholder="Enter team size"
                                required
                            />
                            <div className="absolute top-0 right-0 mt-3 mr-3">
                                <div className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover/input:opacity-100 transition-all duration-300 delay-100" />
                            </div>
                        </div>
                        {showErrors && formErrors.groupSize && (
                            <p className="mt-1 text-sm text-red-400 flex items-center">
                                <span className="mr-1">⚠️</span> Please enter a team size
                            </p>
                        )}
                    </div>
                    <div className="group/input relative transition-all duration-300 hover:scale-[1.01]">
                        <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center mb-1">
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">Project Location</span>
                            </div>
                            <div className="h-px w-0 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/input:w-24 transition-all duration-700" />
                        </label>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-lg blur opacity-0 group-hover/input:opacity-30 transition-opacity duration-300 -z-10" />
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLocation('virtual');
                                        setShowLocationPicker(false);
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group/button ${
                                        location === 'virtual'
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                                            : 'bg-gray-900/70 border border-gray-700 text-gray-200 hover:border-blue-400 hover:text-blue-300'
                                    }`}
                                >
                                    <span className="transition-transform duration-300 group-hover/button:scale-110">🌐</span>
                                    <span>Virtual</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowLocationPicker(true)}
                                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 group/button ${
                                        location !== 'virtual'
                                            ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/20'
                                            : 'bg-gray-900/70 border border-gray-700 text-gray-200 hover:border-green-400 hover:text-green-300'
                                    }`}
                                >
                                    <span className="transition-transform duration-300 group-hover/button:scale-110">📍</span>
                                    <span>In Person</span>
                                </button>
                            </div>
                        </div>
                        {showLocationPicker && (
                            <div className="mt-4 animate-fade-in">
                                {isLoaded ? (
                                    <div className="relative overflow-hidden rounded-lg group/map">
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-transparent to-cyan-400/10 opacity-0 group-hover/map:opacity-100 transition-opacity duration-700" />
                                        <Autocomplete
                                            onLoad={(autocomplete) => {
                                                autocomplete.addListener("place_changed", () => {
                                                    const place = autocomplete.getPlace();
                                                    if (place.formatted_address) {
                                                        setLocation(place.formatted_address);
                                                    }
                                                });
                                            }}
                                        >
                                            <div className="relative">
                                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce">
                                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                        <circle cx="12" cy="10" r="3"></circle>
                                                    </svg>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={location === 'virtual' ? '' : location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all backdrop-blur-sm group-hover/map:border-gray-600"
                                                    placeholder="Enter location..."
                                                />
                                            </div>
                                        </Autocomplete>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 p-4 border border-gray-800 rounded-lg bg-gray-900/50 flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading location services...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="group/input relative transition-all duration-300 hover:scale-[1.01]">
                        <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center mb-1">
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">Tags (Select 1-5)</span>
                                <span className="text-red-500 ml-1 animate-pulse">*</span>
                            </div>
                            <div className="h-px w-0 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/input:w-24 transition-all duration-700" />
                        </label>
                        <div className={`p-5 rounded-lg relative overflow-hidden ${
                            showErrors && formErrors.tags ? 'bg-red-900/10 border border-red-500' : 'bg-gray-900/60 border border-gray-700 group-hover/input:border-gray-600'
                        }`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover/input:opacity-100 transition-opacity duration-700" />
                            
                            <div className="relative z-10">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {tags.map((selectedTag, i) => (
                                        <div key={`selected-${i}`} className="bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-full pl-3 pr-2 py-1 text-sm flex items-center gap-1 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                            {selectedTag}
                                            <button
                                                onClick={() => setTags(tags.filter(t => t !== selectedTag))}
                                                className="h-5 w-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors duration-200"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    {tags.length === 0 && (
                                        <div className="text-gray-400 text-sm italic">No tags selected yet</div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-40 overflow-y-auto custom-scrollbar px-1">
                                    {[
                                        'Artificial Intelligence', 'Machine Learning', 'Web Development',
                                        'Mobile Development', 'Data Science', 'Cybersecurity', 'Cloud Computing',
                                        'DevOps', 'Blockchain', 'IoT', 'Computer Vision', 'Natural Language Processing',
                                        'Robotics', 'Game Development', 'React', 'Node.js', 'Python', 'TensorFlow',
                                        'Docker', 'AWS', 'Rust', 'GraphQL', 'Open Source', 'Hackathon Project',
                                        'Full-Stack', 'API Development', 'Generative AI', 'Web3', 'AR/VR',
                                        'UI/UX Design', 'Algorithms', 'FinTech', 'HealthTech', 'Smart Cities',
                                        'Quantum Computing', 'Software Engineering', 'Data Engineering', 'System Architecture'
                                    ].map((tag, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                if (tags.includes(tag)) {
                                                    setTags(tags.filter(t => t !== tag));
                                                } else if (tags.length < 5) {
                                                    setTags([...tags, tag]);
                                                }
                                            }}
                                            className={`px-2 py-2 rounded-lg text-sm font-medium transition-all duration-300 overflow-hidden whitespace-nowrap text-ellipsis ${
                                                tags.includes(tag)
                                                    ? 'bg-gradient-to-r from-green-400/80 to-cyan-400/80 text-white shadow-md'
                                                    : 'bg-gray-900/80 border border-gray-700 text-gray-300 hover:border-green-400/70 hover:text-green-300 hover:scale-[1.02]'
                                            } ${tags.length >= 5 && !tags.includes(tag) ? 'opacity-30 cursor-not-allowed' : ''}`}
                                            style={{ transitionDelay: `${index % 10 * 30}ms` }}
                                            disabled={tags.length >= 5 && !tags.includes(tag)}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {showErrors && formErrors.tags && (
                            <p className="mt-2 text-sm text-red-400 flex items-center">
                                <span className="mr-1">⚠️</span> Please select between 1-5 technologies
                            </p>
                        )}
                    </div>

                    <div className="group/input relative transition-all duration-300 hover:scale-[1.01]">
                        <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center mb-1">
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">Core Requirements</span>
                            </div>
                            <div className="h-px w-0 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/input:w-24 transition-all duration-700" />
                        </label>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-lg blur opacity-0 group-hover/input:opacity-30 transition-opacity duration-300 -z-10" />
                            <div className="absolute left-3 top-3 text-gray-400 group-hover/input:text-gray-300 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/input:scale-110">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </div>
                            <textarea
                                value={requirements}
                                onChange={(e) => setRequirements(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 h-32 resize-none transition-all backdrop-blur-sm group-hover/input:border-gray-600"
                                placeholder="List the essential skills and technologies required..."
                            />
                            <div className="absolute top-0 right-0 mt-3 mr-3">
                                <div className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover/input:opacity-100 transition-all duration-300 delay-100" />
                            </div>
                        </div>
                    </div>

                    <div className="group/input relative transition-all duration-300 hover:scale-[1.01]">
                        <label className="block text-sm font-medium mb-2">
                            <div className="flex items-center mb-1">
                                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer">Bonus Skills</span>
                            </div>
                            <div className="h-px w-0 bg-gradient-to-r from-green-400 to-cyan-400 group-hover/input:w-24 transition-all duration-700" />
                        </label>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-lg blur opacity-0 group-hover/input:opacity-30 transition-opacity duration-300 -z-10" />
                            <div className="absolute left-3 top-3 text-gray-400 group-hover/input:text-gray-300 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/input:scale-110">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                            </div>
                            <textarea
                                value={niceToHaves}
                                onChange={(e) => setNiceToHaves(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-900/70 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 h-32 resize-none transition-all backdrop-blur-sm group-hover/input:border-gray-600"
                                placeholder="Any additional desirable skills or experience..."
                            />
                            <div className="absolute top-0 right-0 mt-3 mr-3">
                                <div className="w-1 h-1 rounded-full bg-cyan-400 opacity-0 group-hover/input:opacity-100 transition-all duration-300 delay-100" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 space-y-6">
                        {(showErrors && (formErrors.title || formErrors.description || formErrors.tags || formErrors.groupSize)) && (
                            <div className="p-5 bg-red-900/30 border border-red-500 rounded-lg text-red-300 animate-pulse-slow relative overflow-hidden">
                                <span className="absolute top-0 right-0 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </span>
                                <p className="font-medium flex items-center">
                                    <span className="text-red-400 mr-2">⚠️</span> Please fix these errors:
                                </p>
                                <ul className="list-disc pl-5 mt-3 space-y-1">
                                    {formErrors.title && <li className="animate-fade-in">Project title is required</li>}
                                    {formErrors.description && <li className="animate-fade-in" style={{animationDelay: '100ms'}}>Project description is required</li>}
                                    {formErrors.tags && <li className="animate-fade-in" style={{animationDelay: '200ms'}}>Please select 1-5 technologies</li>}
                                    {formErrors.groupSize && <li className="animate-fade-in" style={{animationDelay: '300ms'}}>Please enter a team size</li>}
                                </ul>
                            </div>
                        )}

                        <div className="relative group/button cursor-pointer">
                            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-green-400 to-cyan-400 opacity-30 blur transition duration-1000 group-hover/button:opacity-75 animate-gradient-x"></div>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className={`relative w-full py-4 px-8 font-bold rounded-lg transition-all duration-300 overflow-hidden ${
                                    Object.values(formErrors).some(error => error)
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-cyan-500 text-white hover:shadow-xl hover:shadow-green-500/20 hover:scale-[1.01]'
                                }`}
                                disabled={Object.values(formErrors).some(error => error)}
                            >
                                {!Object.values(formErrors).some(error => error) && (
                                    <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                        <span className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover/button:animate-shine" />
                                    </span>
                                )}
                                <span className="relative z-10 flex items-center justify-center">
                                    <span className="mr-2">Create Listing</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/button:translate-x-1">
                                        <path d="M5 12h13M12 5l7 7-7 7"/>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}