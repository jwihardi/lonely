"use client";

import { useState } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CreateListing(){
    const session = await getServerSession();
    if(!session || !session.user){
        redirect("/api/auth/signin");
    }

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [githubLink, setGithubLink] = useState(''); 
    const [requirements, setRequirements] = useState('');
    const [niceToHaves, setNiceToHaves] = useState('');
    const [tags, setTags] = useState<string[]>([]);

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
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="https://github.com/username/repository"
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
                    <input
                        type="url"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="i.e. Next.js, Tailwind..."
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">
                        Nice To Haves
                    </label>
                    <input
                        type="url"
                        value={niceToHaves}
                        onChange={(e) => setNiceToHaves(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="i.e. Next.js, Tailwind..."
                    />
                </div>
                <div className="mb-4"></div>
                <div className="mb-4"></div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    )
}