"use client";

import { useRouter } from "next/navigation";

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  requirements?: string;
  username: string;
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
  requirements, 
  username 
}: ListingCardProps) {
  const router = useRouter();

  const handleClick = () => { router.push(`/listings/${id}/${slugify(title)}`); };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-800 transition-all hover:border-green-400 hover:transform hover:-translate-y-1 hover:shadow-xl relative group"
    >
      {/* Username in top right corner */}
      <div 
        className="absolute top-4 right-4"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-gray-400 cursor-default">
          @{username}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-green-400 pr-12">{title}</h3>
        
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

        {requirements && (
          <div className="pt-4 border-t border-gray-800">
            <h4 className="text-sm font-medium text-gray-400 mb-1">Requirements</h4>
            <p className="text-gray-500 text-sm line-clamp-2">
              {requirements}
            </p>
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 border-2 border-green-400 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />
    </div>
  );
}