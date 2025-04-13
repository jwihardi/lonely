"use client";
import { useEffect, useState } from "react";
const phrases = [
  "Find your next project",
  "Connect with developers",
  "Build something amazing",
  "Share your ideas",
  "Join a team",
];
export default function AnimatedText() {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        setIsVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-8">
        <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
          BitCamp
        </span>
      </h1>
      <div className="h-20 flex items-center justify-center">
        <p
          className={`text-3xl font-medium text-gray-300 transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {phrases[currentPhrase]}
        </p>
      </div>
      <div className="mt-12 space-y-4">
        <p className="text-lg text-gray-400">
          BitCamp is your platform to discover projects, collaborate with others,
          and build your portfolio.
        </p>
        <div className="flex justify-center gap-4">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse delay-100" />
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse delay-200" />
        </div>
      </div>
    </div>
  );
}