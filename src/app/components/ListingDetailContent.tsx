"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import ApplicationButton from "./ApplicationButton";
import ApplicationsList from "./ApplicationsList";
import DeleteListingButtonClient from "./DeleteListingButtonClient";

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

export default function ListingDetailContent({ listing }: { listing: Listing }) {
  const { data: session } = useSession();
  return (
    <div className="space-y-6">
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
            @{listing.username}
          </a>
          {listing.location && (
            <span className="text-gray-400 ml-4">
              <span className="text-green-400">📍</span> {listing.location}
            </span>
          )}
        </div>
        {session?.user?.name === listing.username && (
          <DeleteListingButtonClient 
            listingId={listing.id}
            username={listing.username}
          />
        )}
      </div>

      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Description
        </h2>
        <p>{listing.description}</p>
      </div>

      {listing.requirements && (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Requirements
          </h2>
          <p>{listing.requirements}</p>
        </div>
      )}

      {listing.niceToHaves && (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Nice to Haves
          </h2>
          <p>{listing.niceToHaves}</p>
        </div>
      )}

      {listing.groupSize && (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Group Size
          </h2>
          <p>{listing.groupSize}</p>
        </div>
      )}

      {listing.githubLink && (
        <div className="prose prose-invert max-w-none">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            GitHub Repository
          </h2>
          <a
            href={`https://github.com/${listing.githubLink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            {listing.githubLink}
          </a>
        </div>
      )}

      <div className="flex justify-between items-center">
        {session?.user?.name && session.user.name !== listing.username && (
          <ApplicationButton
            projectId={listing.id}
            projectTitle={listing.title}
            applicantUsername={session.user.name}
            posterUsername={listing.username}
          />
        )}
      </div>

      {listing.applications && listing.applications.length > 0 && (
        <ApplicationsList
          applications={listing.applications}
          projectId={listing.id}
          projectTitle={listing.title}
          posterUsername={listing.username}
        />
      )}
    </div>
  );
}
