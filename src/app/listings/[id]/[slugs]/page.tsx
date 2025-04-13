import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Link from "next/link";
import ApplicationButton from "../../../components/ApplicationButton";
import ApplicationsList from "../../../components/ApplicationsList";
import { getServerSession } from "next-auth";
import BackToListingsButton from "../../../components/BackToListingsButton";
import DeleteListingButtonClient from "../../../components/DeleteListingButtonClient";

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
  applications?: Array<{
    applicantUsername: string;
    message: string;
    status: string;
    timestamp: string;
  }>;
  location?: string;
}

export default async function ListingDetail({
  params,
}: {
  params: { id: string; slugs: string };
}) {
  const session = await getServerSession();
  try {
    const docRef = doc(db, "projects", params.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-red-400">
          <p className="text-xl mb-4">Listing not found</p>
          <Link href="/dashboard" className="text-green-400 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      );
    }

    const listing = { id: docSnap.id, ...docSnap.data() } as Listing;

    return (
      <div className="min-h-screen bg-gray-950 p-8 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/5 rounded-full filter blur-3xl animate-float opacity-30" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse opacity-30" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl p-8 border border-gray-800 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-green-900/10 hover:border-gray-700/80 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-400/20 rotate-45 transform transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-2 opacity-20" />
            <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-cyan-400/20 rotate-45 transform transition-transform duration-500 group-hover:translate-y-2 group-hover:translate-x-2 opacity-20" />
            <div className="absolute -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-5 group-hover:animate-shine" />
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10 relative">
              <div className="max-w-2xl">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-3 animate-text-shimmer relative">
                  {listing.title}
                  <span className="absolute -bottom-1 left-0 w-1/3 h-px bg-gradient-to-r from-green-400/50 to-transparent" />
                </h1>
                <div className="flex items-center gap-3">
                  <a
                    href={`https://github.com/${listing.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-300 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span>Posted by @{listing.username}</span>
                  </a>
                  
                  {listing.location && (
                    <span className="text-gray-400 flex items-center gap-2">
                      <span className="text-green-400">📍</span> {listing.location}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-3 md:flex-col md:items-end">
                <BackToListingsButton />
                {session?.user?.name === listing.username && (
                  <DeleteListingButtonClient 
                    listingId={listing.id}
                    username={listing.username}
                  />
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/80 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center gap-2 animate-text-shimmer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Project Description
                </h2>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed relative z-10">
                  {listing.description}
                </p>
              </div>
              {listing.tags && listing.tags.length > 0 && (
                <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/80 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center gap-2 animate-text-shimmer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                      <line x1="7" y1="7" x2="7.01" y2="7"></line>
                    </svg>
                    Technologies
                  </h2>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {listing.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-green-900/40 text-green-400 rounded-full text-sm transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-900/20"
                        style={{ transitionDelay: `${index * 30}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {listing.requirements && (
                <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/80 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center gap-2 animate-text-shimmer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Requirements
                  </h2>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed relative z-10">
                    {listing.requirements}
                  </p>
                </div>
              )}
              {listing.niceToHaves && (
                <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:border-gray-700/80 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4 flex items-center gap-2 animate-text-shimmer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Nice to Have
                  </h2>
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed relative z-10">
                    {listing.niceToHaves}
                  </p>
                </div>
              )}
              {session?.user?.name === listing.username ? (
                <ApplicationsList 
                  applications={listing.applications}
                  projectId={listing.id}
                  projectTitle={listing.title}
                  posterUsername={listing.username}
                />
              ) : session?.user?.name && (
                <ApplicationButton
                  projectId={listing.id}
                  projectTitle={listing.title}
                  applicantUsername={session.user.name}
                  posterUsername={listing.username}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-red-400 p-8">
        <div className="bg-gray-900/80 rounded-xl p-10 border border-red-500/40 shadow-2xl backdrop-blur-sm max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 animate-pulse" />
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 opacity-80">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <p className="text-2xl font-semibold mb-4">Error loading listing</p>
          <p className="text-gray-400 mb-6">We encountered a problem while trying to load this project</p>
          <Link href="/Dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }
}