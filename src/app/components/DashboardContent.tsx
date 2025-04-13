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

// Comprehensive US state abbreviation mapping
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
    
    // Check for exact state matches
    const stateRegex = new RegExp(`,\s*(${Object.values(STATE_ABBREVIATIONS).join('|')}|${Object.keys(STATE_ABBREVIATIONS).join('|')})\s*$`, 'i');
    const locationMatch = location.match(stateRegex);
    const filterMatch = filter.match(stateRegex);
    
    if (locationMatch && filterMatch) {
      // Normalize both matches to abbreviations for comparison
      const locationState = locationMatch[1].toUpperCase();
      const filterState = filterMatch[1].toUpperCase();
      
      // If filter is a state name, convert to abbreviation
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
      // Check for exact address match
      listing.location?.toLowerCase() === locationFilter.toLowerCase() ||
      // Check for state matches
      matchesState(listing.location, locationFilter) ||
      // Check for partial matches with various transformations
      (listing.location && listing.location.toLowerCase().includes(locationFilter.toLowerCase().replace(/[^a-z0-9,]/gi, ''))) || // Remove special chars except comma
      (listing.location && listing.location.toLowerCase().includes(locationFilter.toLowerCase().replace(/\s+/g, ''))) || // Remove spaces
      (listing.location && listing.location.toLowerCase().includes(locationFilter.toLowerCase().replace(/\s*,\s*/g, ','))) || // Normalize commas
      // Check for state abbreviation variations
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
      <div className="flex justify-between items-center mb-8">
        {/* Home Button on left */}
        <Link
          href="/"
          className="px-6 py-3 border border-red-500 text-red-500 font-medium rounded-lg hover:bg-red-500/10 transition-colors"
        >
          Home
        </Link>

        {/* Centered Title */}
        <div className="flex-grow text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 via-purple-400 bg-clip-text text-transparent">
            Project Listings
          </h1>
        </div>

        {/* Right-side buttons */}
        <div className="flex gap-4 items-center">
          <Link
            href="/ViewApplications"
            className="px-6 py-3 border border-cyan-400 text-cyan-400 font-medium rounded-lg hover:bg-cyan-400/10 transition-colors"
          >
            View Applications
          </Link>
          <Link
            href="/AddListing/MyListing"
            className="px-6 py-3 border border-green-400 text-green-400 font-medium rounded-lg hover:bg-green-400/10 transition-colors"
          >
            My Listings
          </Link>
          <ProjectListingButton />
        </div>
      </div>

      <div className="mb-4 space-y-4">
        <SearchForm />
        <LocationSearch 
          onLocationSelect={setLocationFilter} 
          onClear={() => setLocationFilter("")}
        />
        <TagFilter />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing: Listing) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            description={listing.description}
            tags={listing.tags}
            username={listing.username}
            location={listing.location}
          />
        ))}
      </div>
    </div>
  );
}
