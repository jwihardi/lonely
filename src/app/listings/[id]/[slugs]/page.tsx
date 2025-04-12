"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  requirements?: string;
  username: string;
  githubLink?: string;
  groupSize?: number;
  niceToHaves?: string;
}

export default function ListingDetail() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(db, "projects", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
        } else {
          setError("Listing not found");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  const handleApply = async () => {
    // Implement your application logic here
    console.log("Applying to listing:", listing?.id);
    // Add your submission logic (e.g., Firestore update, API call, etc.)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-green-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-red-400">
        <p className="text-xl mb-4">{error}</p>
        <Link href="/dashboard" className="text-green-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-800 shadow-2xl">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {listing?.title}
              </h1>
              <p className="text-gray-400">Posted by @{listing?.username}</p>
            </div>
            <Link
              href="/Dashboard"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              ← Back to Listings
            </Link>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-green-400 mb-4">
                Project Description
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {listing?.description}
              </p>
            </div>

            {/* Tags */}
            {listing?.tags && listing.tags.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-green-400 mb-4">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-green-900/30 text-green-400 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {listing?.requirements && (
              <div>
                <h2 className="text-2xl font-semibold text-green-400 mb-4">
                  Requirements
                </h2>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {listing.requirements}
                </p>
              </div>
            )}

            {/* Nice to Have */}
            {listing?.niceToHaves && (
              <div>
                <h2 className="text-2xl font-semibold text-green-400 mb-4">
                  Nice to Have
                </h2>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {listing.niceToHaves}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-8">
              <button
                onClick={handleApply}
                className="w-full py-4 px-8 bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 font-bold rounded-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-lg"
              >
                Apply to Join Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}