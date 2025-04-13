"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Layout, Info, LogIn, LogOut } from "react-feather";

export default function LandingPage() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  pathname === "/" 
                    ? "bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-400" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-cyan-300"
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>

              {session && (
                <Link
                  href="/Dashboard"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    pathname === "/Dashboard"
                      ? "bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-400"
                      : "text-gray-400 hover:bg-gray-800 hover:text-cyan-300"
                  }`}
                >
                  <Layout className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
              )}

              <Link
                href="/about"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  pathname === "/about"
                    ? "bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-cyan-300"
                }`}
              >
                <Info className="w-5 h-5" />
                <span className="font-medium">About</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm font-medium">
                    Welcome, {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 rounded-lg hover:scale-105 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 text-blue-400 rounded-lg hover:scale-105 transition-all duration-300"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          <div className="animate-float">
            <h1 className="text-7xl md:text-8xl font-bold bounce-text">
              BOUNCE
            </h1>
          </div>
          
          <div className="group relative max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative space-y-4">
              <p className="text-2xl md:text-3xl font-medium bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                Elevate Your Tech Journey
              </p>
              <p className="text-lg md:text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                Connect with passionate developers to build groundbreaking 
                software solutions. From hackathons to enterprise systems - 
                find your perfect team and create something that matters.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href={session ? "/Dashboard" : "/api/auth/signin"}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-lg font-medium hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {session ? "Go to Dashboard →" : "Start Collaborating Now"}
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20">
        <div className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -bottom-48 -right-48"></div>
      </div>
    </div>
  );
}