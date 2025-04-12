"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "react-feather"; // Changed icon

const ACTIVE_ROUTE = "text-red-400 border-red-400 bg-red-400/10"; // Changed to red
const INACTIVE_ROUTE = "text-gray-300 border-gray-600 hover:border-red-400 hover:text-red-300"; // Changed to red

export default function BackButton() { // Changed component name
  const pathname = usePathname();
  
  return (
    <div className="relative group">
      <Link
        href="/Dashboard" // Kept original functionality
        className={`inline-flex items-center gap-2 px-6 py-3 border rounded-full transition-all duration-300 ${
          pathname === "/Dashboard" ? ACTIVE_ROUTE : INACTIVE_ROUTE
        }`}
      >
        <ArrowLeft className="w-5 h-5" /> {/* Changed icon */}
        <span className="text-sm font-medium">Back</span> {/* Changed text */}
      </Link>
      
      {/* Red hover glow effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full 
        opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
    </div>
  );
}