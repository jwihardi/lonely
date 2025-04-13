"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp, Tag } from "react-feather";

const commonTags = [
  'Artificial Intelligence', 'Machine Learning', 'Web Development',
  'Mobile Development', 'Data Science', 'Cybersecurity', 'Cloud Computing',
  'DevOps', 'Blockchain', 'IoT', 'Computer Vision', 'Natural Language Processing',
  'Robotics', 'Game Development', 'React', 'Node.js', 'Python', 'TensorFlow',
  'Docker', 'AWS', 'Rust', 'GraphQL', 'Open Source', 'Hackathon Project',
  'Full-Stack', 'API Development', 'Generative AI', 'Web3', 'AR/VR',
  'UI/UX Design', 'Algorithms', 'FinTech', 'HealthTech', 'Smart Cities',
  'Quantum Computing',
  'Software Engineering', 'Data Engineering', 'System Architecture'
];

export default function TagFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize selected tags from URL
  useEffect(() => {
    const tags = searchParams.get("tags");
    if (tags) {
      setSelectedTags(tags.split(","));
    }
  }, [searchParams]);

  const updateURL = useCallback((newTags: string[]) => {
    const currentQuery = searchParams.get("q") || "";
    const params = new URLSearchParams();
    if (currentQuery) params.set("q", currentQuery);
    if (newTags.length > 0) params.set("tags", newTags.join(","));
    router.push(`/Dashboard?${params.toString()}`);
  }, [router, searchParams]);

  const toggleTag = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
    updateURL(newTags);
  };

  return (
    <div className="mb-6">
      {/* Filter Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-300 hover:border-green-400/50 transition-all"
      >
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-green-400" />
          <span>{selectedTags.length ? `${selectedTags.length} tags selected` : 'Filter by tags'}</span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-green-400" />
        ) : (
          <ChevronDown size={18} className="text-green-400" />
        )}
      </button>

      {/* Tag Grid */}
      {isOpen && (
        <div className="mt-2 p-4 bg-gray-900/30 border border-gray-800 rounded-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {commonTags.sort().map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedTags.includes(tag)
                    ? "border border-green-400 bg-green-400/10 text-green-400"
                    : "border border-gray-700 bg-gray-900/50 text-gray-400 hover:border-green-400/50 hover:text-green-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
