"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const tagFilter = searchParams.get("tags") || "";

  // Update URL immediately on input change with all dependencies
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (tagFilter) params.set('tags', tagFilter);
    
    router.replace(`/Dashboard?${params.toString()}`, { scroll: false });
  }, [query, tagFilter, router]); // Include all dependencies used in the effect

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search projects by name or tags..."
        className="w-full px-6 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}