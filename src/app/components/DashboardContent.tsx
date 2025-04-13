"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Listing } from "../../../types";
import SearchForm from "./SearchForm";
import LocationSearch from "./LocationSearch";
import TagFilter from "./TagFilter";
import ListingCard from "../Dashboard/ListingCard";
import Link from "next/link";
import ProjectListingButton from "./ProjectListings";
const STATE_ABBREVIATIONS = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  NewHampshire: 'NH',
  NewJersey: 'NJ',
  NewMexico: 'NM',
  NewYork: 'NY',
  NorthCarolina: 'NC',
  NorthDakota: 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  RhodeIsland: 'RI',
  SouthCarolina: 'SC',
  SouthDakota: 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  WestVirginia: 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY'
};
interface DashboardContentProps {
  listings: Listing[];
  searchQuery: string;
}
export default function DashboardContent({ listings, searchQuery }: DashboardContentProps) {
  const searchParams = useSearchParams();
  const tagFilter = searchParams.get("tags") || "";
  const [locationFilter, setLocationFilter] = useState("");
  const matchesState = (location: string | undefined, filter: string): boolean => {
    if (!location) return false;
    const stateRegex = new RegExp(`,\s*(${Object.values(STATE_ABBREVIATIONS).join('|')}|${Object.keys(STATE_ABBREVIATIONS).join('|')})\s*$`, 'i');
    const locationMatch = location.match(stateRegex);
    const filterMatch = filter.match(stateRegex);
    if (locationMatch && filterMatch) {
      const locationState = locationMatch[1].toUpperCase();
      const filterState = filterMatch[1].toUpperCase();
      const filterAbbr = Object.entries(STATE_ABBREVIATIONS).find(([state, abbr]) => 
        state.toUpperCase() === filterState
      )?.[1] || filterState;
      return locationState === filterAbbr;
    }
    return false;
  };
  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = !tagFilter || listing.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
    const matchesLocation = !locationFilter || 
      listing.location?.toLowerCase() === locationFilter.toLowerCase() ||
      matchesState(listing.location, locationFilter) ||
      (listing.location && listing.location.toLowerCase().includes(locationFilter.toLowerCase().replace(/[^a-z0-9,]/gi, ''))) || 
      (listing.location && listing.location.toLowerCase().includes(locationFilter.toLowerCase().replace(/\s+/g, ''))) || 
      (listing.location && listing.location.toLowerCase().includes(locationFilter.toLowerCase().replace(/\s*,\s*/g, ','))) || 
      Object.entries(STATE_ABBREVIATIONS).some(([state, abbr]) => {
        return (
          (listing.location && listing.location.toLowerCase().includes(abbr.toLowerCase()) && 
           locationFilter.toLowerCase().includes(state.toLowerCase())) ||
          (listing.location && listing.location.toLowerCase().includes(state.toLowerCase()) && 
           locationFilter.toLowerCase().includes(abbr.toLowerCase()))
        );
      });
    return matchesSearch && matchesTags && matchesLocation;
  });
  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Header with Subtle Glow Effect */}
      <div className="relative mb-10 bg-gradient-to-r from-gray-900/40 to-gray-800/40 py-6 px-8 rounded-2xl border border-gray-800/50 shadow-lg backdrop-blur-sm">
        <div className="absolute inset-0 bg-green-400/5 rounded-2xl blur-xl"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-500/10 hover:shadow-md hover:shadow-red-500/10 transition-all duration-300 transform hover:scale-105"
          >
            Home
          </Link>
          
          <div className="flex-grow text-center my-3 md:my-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x">
              Project Listings
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 items-center">
            <Link
              href="/ViewApplications"
              className="px-5 py-2.5 border border-cyan-400 text-cyan-400 font-medium rounded-lg hover:bg-cyan-400/10 hover:shadow-md hover:shadow-cyan-400/10 transition-all duration-300 transform hover:scale-105"
            >
              View Applications
            </Link>
            <Link
              href="/AddListing/MyListing"
              className="px-5 py-2.5 border border-green-400 text-green-400 font-medium rounded-lg hover:bg-green-400/10 hover:shadow-md hover:shadow-green-400/10 transition-all duration-300 transform hover:scale-105"
            >
              My Listings
            </Link>
            <ProjectListingButton />
          </div>
        </div>
      </div>
      
      {/* Enhanced Search Section */}
      <div className="mb-8 space-y-4 bg-gray-900/40 p-6 rounded-xl border border-gray-800/50 shadow-md backdrop-blur-sm">
        <div className="space-y-4">
          <div>
            <SearchForm />
          </div>
          <div>
            <LocationSearch 
              onLocationSelect={setLocationFilter} 
              onClear={() => setLocationFilter("")}
            />
          </div>
          <div>
            <TagFilter />
          </div>
        </div>
      </div>
      
      {/* Results Stats */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-300">
          <span className="text-green-400">{filteredListings.length}</span> {filteredListings.length === 1 ? 'Project' : 'Projects'} Found
        </h2>
        {locationFilter && (
          <div className="px-4 py-2 bg-gray-800/80 rounded-lg text-gray-300 text-sm">
            <span className="text-green-400 mr-2">📍</span> Filtered by: {locationFilter}
            <button 
              onClick={() => setLocationFilter("")} 
              className="ml-2 text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}
      </div>
      
      {/* Enhanced Card Grid with Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredListings.map((listing: Listing, index: number) => (
          <div key={listing.id} className="transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
            <ListingCard
              id={listing.id}
              title={listing.title}
              description={listing.description}
              tags={listing.tags}
              username={listing.username}
              location={listing.location}
            />
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredListings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-900/40 rounded-2xl border border-gray-800/50">
          <p className="text-xl text-gray-400 mb-4">No projects found matching your criteria</p>
          <button 
            onClick={() => {
              setLocationFilter("");
              // The reset of search happens through the form
              window.location.href = '/Dashboard';
            }}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 font-bold rounded-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}