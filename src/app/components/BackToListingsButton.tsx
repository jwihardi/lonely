"use client";

import { useRouter } from "next/navigation";

export default function BackToListingsButton() {
  const router = useRouter();
  
  const handleGoBack = () => {
    // Go back to the previous page in history
    router.back();
  };
  
  return (
    <button
      onClick={handleGoBack}
      className="text-green-400 hover:text-green-300 transition-colors"
    >
      ← Back to Listings
    </button>
  );
}
