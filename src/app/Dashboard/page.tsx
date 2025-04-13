// No "use client" here!
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import GetAllListings from "./getAllListings";
import DashboardContent from "../components/DashboardContent";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { q?: string; tags?: string };
}) {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const resolvedSearchParams = await Promise.resolve(searchParams);

  const searchQuery = resolvedSearchParams?.q || '';
  const tagFilter = resolvedSearchParams?.tags || '';
  const listings = await GetAllListings(searchQuery);

  // Filter listings by tags if tags are selected
  const filteredListings = tagFilter
    ? listings.filter(listing => 
        listing.tags?.some(tag => 
          tagFilter.split(',').includes(tag)
        )
      )
    : listings;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <DashboardContent 
        listings={listings}
        searchQuery={searchQuery}
        tagFilter={tagFilter}
      />
    </div>
  );
}