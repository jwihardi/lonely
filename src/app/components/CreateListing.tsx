"use client";

import { useState } from "react";
import addToFirestore from "../AddListing/dbSender"

export default function CreateListing({ username } : {username: any}){
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState(''); 
    const [requirements, setRequirements] = useState('');
    const [niceToHaves, setNiceToHaves] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [groupSize, setGroupSize] = useState(2);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form className="w-full max-w-lg p-8 bg-[#262626] rounded shadow-md">
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">
                        Project Title  <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                (e.target as HTMLInputElement).blur();
                            }
                        }}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="T-Rex"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white-300 text-sm font-bold mb-2">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="blah blah blah..."
                        rows={4}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">
                        GitHub Link
                    </label>
                    <input
                        type="text"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                (e.target as HTMLInputElement).blur();
                            }
                        }}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="https://github.com/username/repository"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">
                        Group Size
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={groupSize === 0 ? '' : groupSize}
                        onChange={(e) => setGroupSize(e.target.value === '' ? 0 : Number(e.target.value))}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                (e.target as HTMLInputElement).blur();
                            }
                        }}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="Enter group size"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">
                        Tags  (Select at least 1) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {['Machine Learning', 'Web Development', 'Software Engineering', 'Mobile Development', 'Data Science', 'DevOps', 'Cybersecurity', 'UI/UX Design'].map((tag) => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                    if (tags.includes(tag)) {
                                        setTags(tags.filter(t => t !== tag));
                                    } else {
                                        setTags([...tags, tag]);
                                    }
                                }}
                                className={`px-3 py-1 rounded-full text-sm ${
                                    tags.includes(tag)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">
                        Requirements
                    </label>
                    <textarea
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="i.e. Next.js, Tailwind..."
                        rows={2}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">
                        Nice To Have / Looking For
                    </label>
                    <textarea
                        value={niceToHaves}
                        onChange={(e) => setNiceToHaves(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="i.e. Next.js, Tailwind..."
                        rows={2}
                    />
                </div>
                <div className="mb-4"></div>
                <div className="mb-4"></div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={async (e) => {
                            e.preventDefault();
                            const success = await addToFirestore(username, title, description, githubLink, tags, requirements, niceToHaves, groupSize);
                            if (success) {
                                window.location.href = "/AddListing/MyListing"; 
                            }
                        }}
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    )
}