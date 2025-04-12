import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GetMyListing from "./getMyListing";
import DashboardButton from "./DashBoardButton";

export default async function CreateListingsPage() {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }
  
  const username = String(session.user?.name);
  const listings = await GetMyListing(username);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Header with DashboardButton positioned absolutely */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          position: "relative",
          width: "100%",
          maxWidth: "768px", // adjust as needed
        }}
      >
  
        <h1 className="text-3xl font-bold text-white text-center w-full">
          My Listings
          <DashboardButton />
        </h1>
      </div>

      {/* Listings */}
      {listings.map((listing, index) => (
        <div
          key={index}
          className="w-full max-w-lg p-8 bg-[#262626] rounded shadow-md"
        >
          {listing.title && (
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Project Title
              </label>
              <p className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-300">
                {listing.title}
              </p>
            </div>
          )}
          {listing.description && (
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Description
              </label>
              <p className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-300">
                {listing.description}
              </p>
            </div>
          )}
          {listing.githubLink && (
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                GitHub Link
              </label>
              <p className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-300">
                <a
                  href={listing.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  {listing.githubLink}
                </a>
              </p>
            </div>
          )}
          {listing.groupSize && (
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Group Size
              </label>
              <p className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-300">
                {listing.groupSize}
              </p>
            </div>
          )}
          {listing.tags && listing.tags.length > 0 && (
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {listing.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {listing.requirements && (
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Requirements
              </label>
              <p className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-300">
                {listing.requirements}
              </p>
            </div>
          )}
          {listing.niceToHaves && (
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2">
                Nice To Have / Looking For
              </label>
              <p className="w-full px-3 py-2 border rounded bg-gray-800 text-gray-300">
                {listing.niceToHaves}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
