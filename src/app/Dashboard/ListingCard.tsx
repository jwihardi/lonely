"use client";

import Link from "next/link";

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  username: string;
  location?: string;
}

// Helper function to create URL-friendly slugs
const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single
    .trim();

};

export default function ListingCard({ 
  id, 
  title, 
  description, 
  tags, 
  username,
  location,
}: ListingCardProps) {
  const githubUrl = `https://github.com/${username}`;
  const listingUrl = `/listings/${id}/${slugify(title)}`;

return (
  <div className="relative group">
    {/* GitHub Profile Link */}
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-4 right-4 z-10 text-xs text-gray-400 hover:text-green-300 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      @{username}
    </a>

    <Link 
      href={listingUrl}
      className="block cursor-pointer bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-800 transition-all hover:border-green-400 hover:transform hover:-translate-y-1 hover:shadow-xl relative"
    >

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-green-400 mb-1">{title}</h3>
          {location && (
            <span className="text-sm text-gray-400">
              <span className="text-green-400">📍</span> {location}
            </span>
          )}
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-3">
          {description}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 border-2 border-green-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />
    </Link>
  </div>
  );
}