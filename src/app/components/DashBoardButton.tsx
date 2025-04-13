"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layout } from "react-feather"; 
const ACTIVE_ROUTE = "text-green-400 border-green-400 bg-green-400/10";
const INACTIVE_ROUTE = "text-gray-300 border-gray-600 hover:border-green-400 hover:text-green-400";
export default function DashboardButton() {
  const pathname = usePathname();
  return (
    <div className="relative group">
      <Link
        href="/Dashboard"
        className={`inline-flex items-center gap-2 px-6 py-3 border rounded-full transition-all duration-300 ${
          pathname === "/Dashboard" ? ACTIVE_ROUTE : INACTIVE_ROUTE
        }`}
      >
        <Layout className="w-5 h-5" />
        <span className="text-sm font-medium">Dashboard</span>
      </Link>
      {}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full 
        opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
    </div>
  );
}