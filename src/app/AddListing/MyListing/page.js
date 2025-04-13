import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GetMyListing from "./getMyListing";
import DashboardButton from "../../components/DashBoardButton";
import ListingCard from "../../Dashboard/ListingCard";

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
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              description={listing.description}
              tags={listing.tags}
              requirements={listing.requirements}
              username={username}
            />
          ))}
        </div>
      </div>
    </div>
  );
}