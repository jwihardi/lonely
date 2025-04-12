import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GetMyListing from "./getMyListing";
import DashboardButton from "../../components/DashBoardButton";

export default async function CreateListingsPage() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }
  
  const username = String(session.user?.name);
  const listings = await GetMyListing(username);

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            My Listings
          </h1>
          <DashboardButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 hover:border-green-400 transition-colors duration-300"
            >
              <div className="space-y-4">
                {listing.title && (
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Project Title
                    </label>
                    <p className="w-full px-3 py-2 rounded-lg bg-gray-900/50 text-gray-200 border border-gray-700">
                      {listing.title}
                    </p>
                  </div>
                )}

                {listing.description && (
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Description
                    </label>
                    <p className="w-full px-3 py-2 rounded-lg bg-gray-900/50 text-gray-300 border border-gray-700 whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  </div>
                )}

                {listing.githubLink && (
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      GitHub
                    </label>
                    <a
                      href={listing.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full px-3 py-2 rounded-lg bg-gray-900/50 text-cyan-400 underline hover:text-cyan-300 transition-colors border border-gray-700 truncate"
                    >
                      {listing.githubLink}
                    </a>
                  </div>
                )}

                {listing.groupSize && (
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Group Size
                    </label>
                    <p className="w-full px-3 py-2 rounded-lg bg-gray-900/50 text-gray-300 border border-gray-700">
                      {listing.groupSize}
                    </p>
                  </div>
                )}

                {listing.tags?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {listing.requirements && (
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Requirements
                    </label>
                    <p className="w-full px-3 py-2 rounded-lg bg-gray-900/50 text-gray-300 border border-gray-700 whitespace-pre-wrap">
                      {listing.requirements}
                    </p>
                  </div>
                )}

                {listing.niceToHaves && (
                  <div>
                    <label className="block text-sm font-medium text-green-400 mb-1">
                      Nice to Have
                    </label>
                    <p className="w-full px-3 py-2 rounded-lg bg-gray-900/50 text-gray-300 border border-gray-700 whitespace-pre-wrap">
                      {listing.niceToHaves}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}