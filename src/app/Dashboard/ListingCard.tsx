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

// so url doesnt look like trash
// regex lol 330
const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-')     
    .replace(/-+/g, '-')      
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
  const isVirtual = location === 'virtual' || location === 'Virtual';

return (
  <div className="relative group perspective-1000">
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute top-4 right-4 z-10 text-xs text-gray-400 hover:text-green-300 hover:scale-110 transition-all duration-300 flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">by</span> @{username}
    </a>

    <Link 
      href={listingUrl}
      className="block cursor-pointer overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-800/50 transition-all duration-500 
                hover:border-green-400/70 hover:shadow-lg hover:shadow-green-400/10 group-hover:-translate-y-1 relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${isVirtual ? 'from-blue-400/5 via-transparent to-indigo-400/5' : 'from-green-400/5 via-transparent to-cyan-400/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      <div className={`absolute -top-10 -left-10 w-20 h-20 ${isVirtual ? 'bg-blue-400' : 'bg-green-400'} rotate-45 transform group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500 opacity-20 group-hover:opacity-30`} />
      <div className="space-y-4 relative z-10">
        <div className="transform transition-transform duration-300 group-hover:translate-x-1">
          <h3 className={`text-xl font-semibold bg-gradient-to-r ${isVirtual ? 'from-blue-400 to-indigo-400' : 'from-green-400 to-cyan-400'} bg-clip-text text-transparent group-hover:scale-[1.02] transition-all duration-300 mb-1 animate-text-shimmer relative overflow-hidden`}>{title}</h3>
          {location && (
            <span className="text-sm text-gray-400 flex items-center gap-1.5 group-hover:text-gray-300 transition-colors duration-300">
              {isVirtual ? (
                <span className="text-blue-400 transform group-hover:rotate-[15deg] transition-transform duration-300">🌐</span>
              ) : (
                <span className="text-green-400 transform group-hover:rotate-[15deg] transition-transform duration-300">📍</span>
              )} {location}
            </span>
          )}
        </div>
        
        <p className="text-gray-300 text-sm line-clamp-3 group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </p>

        {tags && tags.length > 0 && (
          <div className="mt-2 transform transition-all duration-500 group-hover:translate-y-0.5">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 ${isVirtual ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'} text-xs rounded-full transform transition-all duration-300 hover:scale-105 group-hover:shadow-sm max-w-[120px]`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                  title={tag} 
                >
                  <span className="block truncate">{tag}</span>
                </span>
              ))}
              {tags.length > 3 && (
                <span 
                  className={`px-3 py-1 ${isVirtual ? 'bg-blue-900/50 text-blue-400' : 'bg-green-900/50 text-green-400'} text-xs rounded-full transform transition-all duration-300 hover:scale-105 group-hover:shadow-sm`}
                  style={{ transitionDelay: `150ms` }}
                  title={tags.slice(3).join(', ')}
                >
                  +{tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={`absolute inset-0 border-2 ${isVirtual ? 'border-blue-400/40' : 'border-green-400/40'} rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[0.98] pointer-events-none`} />
      <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />
    </Link>
  </div>
  );
}