// No "use client" here!
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProjectListingButton from "../components/ProjectListings";
import GetAllListings from "./getAllListings";
import ListingCard from "./ListingCard";

export default async function HomePage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const username = String(session.user?.name);
  const listings = await GetAllListings(username);

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Project Dashboard
          </h1>
          <ProjectListingButton />
        </div>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Separate search terms with commas..."
            className="w-full px-6 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              description={listing.description}
              tags={listing.tags}
              requirements={listing.requirements}
            />
          ))}
        </div>
      </div>
    </div>
  );
}