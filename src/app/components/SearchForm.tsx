"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchForm() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setSearchTerm(params.get("q") || "");
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(window.location.search);
    
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    } else {
      params.delete('q');
    }

    router.push(`/Dashboard?${params.toString()}`, { scroll: false });
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search projects by name or tags..."
          className="w-full px-6 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-green-400 hover:bg-green-300 text-gray-900 rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}