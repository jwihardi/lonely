import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Link from "next/link";
import ApplicationButton from "../../../components/ApplicationButton";
import ApplicationsList from "../../../components/ApplicationsList";
import { getServerSession } from "next-auth";
import BackToListingsButton from "../../../components/BackToListingsButton";

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
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 border border-gray-800 shadow-2xl">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {listing.title}
                </h1>
                <a
                  href={`https://github.com/${listing.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-300 transition-colors"
                >
                  Posted by @{listing.username}
                </a>
              </div>
              <BackToListingsButton />
            </div>

            {/* Main Content */}
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-semibold text-green-400 mb-4">
                  Project Description
                </h2>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {listing.description}
                </p>
              </div>

              {/* Location */}
              {listing.location && (
                <div>
                  <h2 className="text-2xl font-semibold text-green-400 mb-4">
                    Location
                  </h2>
                  <p className="text-gray-300">
                    <span className="text-green-400">📍</span> {listing.location}
                  </p>
                </div>
              )}

              {/* Tags */}
              {listing.tags && listing.tags.length > 0 && (
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
              {listing.requirements && (
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
              {listing.niceToHaves && (
                <div>
                  <h2 className="text-2xl font-semibold text-green-400 mb-4">
                    Nice to Have
                  </h2>
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {listing.niceToHaves}
                  </p>
                </div>
              )}

              {/* Applications Section */}
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
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-red-400">
        <p className="text-xl mb-4">Error loading listing</p>
        <Link href="/dashboard" className="text-green-400 hover:underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }
}