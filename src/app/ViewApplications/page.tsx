import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { collection, query, getDocs, where } from "firebase/firestore";
import DashboardButton from "../components/DashBoardButton";
import { db } from "../firebaseConfig";
import ListingCard from "../Dashboard/ListingCard";
import { Listing } from "../../../types";

async function GetMyApplications(username: string) {
  const listingsRef = collection(db, "projects");
  const querySnapshot = await getDocs(listingsRef);
  const listings: Listing[] = [];

  for (const doc of querySnapshot.docs) {
    const data = doc.data() as Listing;
    const applications = data.applications || [];
    
    if (applications.some(app => app.applicantUsername === username)) {
      listings.push({
        ...data,
        id: doc.id
      });
    }
  }

  return listings;
}

export default async function ViewApplicationsPage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const username = session.user.name!;
  const listings = await GetMyApplications(username);

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            My Applications
          </h1>
          <DashboardButton />


        </div>

        {listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">You haven&apos;t applied to any projects yet.</p>
            <Link
              href="/Dashboard"
              className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 font-bold rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                description={listing.description}
                tags={listing.tags}
                requirements={listing.requirements}
                username={listing.username}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
