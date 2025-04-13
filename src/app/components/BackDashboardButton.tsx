"use client";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "react-feather";
const BUTTON_STYLE = "text-gray-300 border-gray-600 hover:border-red-400 hover:text-red-300";
export default function BackButton() {
  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="relative group">
      <button
        onClick={handleGoBack}
        className={`inline-flex items-center gap-2 px-6 py-3 border rounded-full transition-all duration-300 ${BUTTON_STYLE}`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>
      {}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full 
        opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
    </div>
  );
}