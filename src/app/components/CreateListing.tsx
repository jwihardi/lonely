"use client";

import { useState, useEffect } from "react";
import addToFirestore from "../AddListing/dbSender";
import { Edit2 } from "react-feather";
import BackButton from "./BackDashboardButton";

export default function CreateListing({ username }: { username: any }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState(''); 
    const [requirements, setRequirements] = useState('');
    const [niceToHaves, setNiceToHaves] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [groupSize, setGroupSize] = useState(2);
    const [formErrors, setFormErrors] = useState({
        title: false,
        description: false,
        tags: false
    });

    const validateForm = () => {
        const errors = {
            title: title.trim() === '',
            description: description.trim() === '',
            tags: tags.length < 1 || tags.length > 5
        };
        
        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const success = await addToFirestore(
            username, 
            title, 
            description, 
            githubLink, 
            tags, 
            requirements, 
            niceToHaves, 
            groupSize
        );

        if (success) {
            window.location.href = "/AddListing/MyListing";
        }
    };

    useEffect(() => {
        setFormErrors(prev => ({
            ...prev,
            title: prev.title && title.trim() !== '',
            description: prev.description && description.trim() !== '',
            tags: prev.tags && tags.length >= 1 && tags.length <= 5
        }));
    }, [title, description, tags]);

    return (
        <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <form className="space-y-6 bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800 shadow-xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                            Create New Listing
                        </h2>
                        <BackButton />
                        <div className="mt-2 flex justify-center">
                            <Edit2 className="w-6 h-6 text-cyan-400" />
                        </div>
                    </div>

                    {/* Project Title */}
                    <div>
                        <label className="block text-sm font-medium text-green-400 mb-2">
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 transition-all ${
                                formErrors.title 
                                    ? 'border-red-500 focus:ring-red-500/30' 
                                    : 'border-gray-700 focus:border-green-400 focus:ring-green-400/30'
                            }`}
                            placeholder="T-Rex Project"
                        />
                        {formErrors.title && (
                            <p className="mt-1 text-sm text-red-400">Project title is required</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-green-400 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full px-4 py-3 bg-gray-900/50 border rounded-lg text-gray-200 placeholder-gray-500 focus:ring-2 h-32 resize-none transition-all ${
                                formErrors.description 
                                    ? 'border-red-500 focus:ring-red-500/30' 
                                    : 'border-gray-700 focus:border-green-400 focus:ring-green-400/30'
                            }`}
                            placeholder="Describe your project..."
                        />
                        {formErrors.description && (
                            <p className="mt-1 text-sm text-red-400">Project description is required</p>
                        )}
                    </div>

                    {/* GitHub Link */}
                    <div>
                        <label className="block text-sm font-medium text-green-400 mb-2">
                            GitHub Repository
                        </label>
                        <input
                            type="url"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
                            placeholder="https://github.com/username/repo"
                        />
                    </div>

                    {/* Group Size */}
                    <div>
                        <label className="block text-sm font-medium text-green-400 mb-2">
                            Team Size
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={groupSize}
                            onChange={(e) => setGroupSize(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
                            placeholder="Number of collaborators needed"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-green-400 mb-2">
                            Technologies (Select 1-5) <span className="text-red-500">*</span>
                        </label>
                        <div className={`p-4 rounded-lg ${
                            formErrors.tags ? 'bg-red-900/10 border border-red-500' : 'border border-gray-800'
                        }`}>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {[
                                    'Artificial Intelligence', 'Machine Learning', 'Web Development',
                                    'Mobile Development', 'Data Science', 'Cybersecurity', 'Cloud Computing',
                                    'DevOps', 'Blockchain', 'IoT', 'Computer Vision', 'Natural Language Processing',
                                    'Robotics', 'Game Development', 'React', 'Node.js', 'Python', 'TensorFlow',
                                    'Docker', 'AWS', 'Rust', 'GraphQL', 'Open Source', 'Hackathon Project',
                                    'Full-Stack', 'API Development', 'Generative AI', 'Web3', 'AR/VR',
                                    'UI/UX Design', 'Algorithms', 'FinTech', 'HealthTech', 'Smart Cities',
                                    'Quantum Computing'
                                ].map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => {
                                            if (tags.includes(tag)) {
                                                setTags(tags.filter(t => t !== tag));
                                            } else if (tags.length < 5) {
                                                setTags([...tags, tag]);
                                            }
                                        }}
                                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                                            tags.includes(tag)
                                                ? 'border-green-400 bg-green-400/10 text-green-400'
                                                : 'border-gray-700 bg-gray-900/50 text-gray-400 hover:border-green-400/50 hover:text-green-300'
                                        } ${tags.length >= 5 && !tags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {formErrors.tags && (
                            <p className="mt-2 text-sm text-red-400">Please select between 1-5 technologies</p>
                        )}
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-sm font-medium text-green-400 mb-2">
                            Core Requirements
                        </label>
                        <textarea
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 h-32 resize-none transition-all"
                            placeholder="Essential skills and technologies..."
                        />
                    </div>

                    {/* Nice to Have */}
                    <div>
                        <label className="block text-sm font-medium text-green-400 mb-2">
                            Bonus Skills
                        </label>
                        <textarea
                            value={niceToHaves}
                            onChange={(e) => setNiceToHaves(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 h-32 resize-none transition-all"
                            placeholder="Additional desirable skills..."
                        />
                    </div>

                    {/* Submit Section */}
                    <div className="pt-6 space-y-4">
                        {(formErrors.title || formErrors.description || formErrors.tags) && (
                            <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
                                <p className="font-medium">Please fix these errors:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    {formErrors.title && <li>Project title is required</li>}
                                    {formErrors.description && <li>Project description is required</li>}
                                    {formErrors.tags && <li>Please select 1-5 technologies</li>}
                                </ul>
                            </div>
                        )}

                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full py-3 px-6 bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 font-bold rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={Object.values(formErrors).some(error => error)}
                        >
                            Create Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}