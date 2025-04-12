"use client";

import { useRouter } from "next/navigation";

interface ListingCardProps {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  requirements?: string;
}

export default function ListingCard({ id, title, description, tags, requirements }: ListingCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/listings/${id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 border border-gray-800 transition-all hover:border-green-400 hover:transform hover:-translate-y-1 hover:shadow-xl"
    >
      <h3 className="text-xl font-semibold text-green-400 mb-3">{title}</h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">{description}</p>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
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
          <h4 className="text-sm font-medium text-gray-400 mb-2">Requirements</h4>
          <p className="text-gray-500 text-sm line-clamp-2">{requirements}</p>
        </div>
      )}
    </div>
  );
}