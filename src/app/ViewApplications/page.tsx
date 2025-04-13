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
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full filter blur-3xl animate-float opacity-30" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header with Subtle Glow Effect */}
        <div className="relative mb-10 bg-gradient-to-r from-gray-900/40 to-gray-800/40 py-6 px-8 rounded-2xl border border-gray-800/50 shadow-lg backdrop-blur-sm">
          <div className="absolute inset-0 bg-green-400/5 rounded-2xl blur-xl"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-grow">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent animate-text-shimmer relative inline-block">
                My Applications
                <span className="absolute -bottom-1 left-0 w-1/3 h-px bg-gradient-to-r from-green-400/50 to-transparent" />
              </h1>
              <p className="text-gray-400 mt-2">Projects you've applied to join</p>
            </div>
            <DashboardButton />
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="bg-gray-900/40 rounded-xl p-12 border border-gray-800/50 backdrop-blur-sm text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-transparent to-cyan-400/5 opacity-60 animate-pulse" />

            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-6 text-gray-600 opacity-50">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="8" y1="12" x2="16" y2="12"></line>
              <line x1="12" y1="8" x2="12" y2="16"></line>
            </svg>
            
            <p className="text-gray-300 text-xl font-semibold mb-2">You haven&apos;t applied to any projects yet</p>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Find exciting projects from developers around the world and start collaborating today</p>
            
            <div className="relative group/button cursor-pointer inline-block">
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-green-400 to-cyan-400 opacity-30 blur transition duration-1000 group-hover/button:opacity-75 animate-gradient-x"></div>
              <Link
                href="/Dashboard"
                className="relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white font-bold rounded-lg hover:shadow-xl hover:shadow-green-500/20 transition-all duration-300 transform hover:scale-[1.02]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover/button:translate-x-1">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                Browse Projects
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <div key={listing.id} className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1" style={{ animationDelay: `${index * 100}ms` }}>
                <ListingCard
                  id={listing.id}
                  title={listing.title}
                  description={listing.description}
                  tags={listing.tags}
                  location={listing.location}
                  username={listing.username}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}