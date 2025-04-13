"use client";

import { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "./GoogleMapsProvider";

// Comprehensive US state abbreviation mapping
const STATE_ABBREVIATIONS: { [key: string]: string } = {
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

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
  onClear: () => void;
}

export default function LocationSearch({ onLocationSelect, onClear }: LocationSearchProps) {
  const [location, setLocation] = useState("");
  const [hasSelection, setHasSelection] = useState(false);
  const { googleMapsLoaded } = useGoogleMaps();

  const handlePlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    if (place?.formatted_address) {
      setLocation(place.formatted_address);
      const addressComponents = place.address_components || [];
      const stateComponent = addressComponents.find(
        (component: google.maps.GeocoderAddressComponent) =>
          component.types.includes('administrative_area_level_1')
      );
      
      if (stateComponent?.long_name) {
        // Check if it's already an abbreviation
        const isAbbreviation = stateComponent.long_name.length === 2;
        const stateName = isAbbreviation 
          ? Object.entries(STATE_ABBREVIATIONS).find(([_, abbr]) => abbr === stateComponent.long_name)?.[0] 
          : stateComponent.long_name;
        if (stateName) {
          const stateAbbreviation = STATE_ABBREVIATIONS[stateName] || stateName;
          onLocationSelect(`${place.formatted_address}, ${stateAbbreviation}`);
        } else {
          onLocationSelect(place.formatted_address);
        }
      } else {
        onLocationSelect(place.formatted_address);
      }
      setHasSelection(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    // Only clear the selection if the input is empty AND we had a previous selection
    if (value === "" && hasSelection) {
      onClear();
      setHasSelection(false);
    }
  };

  return (
    <div className="relative">
      <style jsx global>{`
        .pac-container {
          background-color: #1f2937 !important;
          color: #ffffff !important;
          border-radius: 0.5rem !important;
          border: 1px solid #374151 !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        }
        
        .pac-item {
          background-color: #1f2937 !important;
          color: #ffffff !important;
          border-bottom: 1px solid #374151 !important;
        }
        
        .pac-item:hover {
          background-color: #374151 !important;
          color: #ffffff !important;
        }
        
        .pac-item-query {
          color: #ffffff !important;
        }
      `}</style>
      <div className="relative">
        <Autocomplete
          onLoad={(autocomplete) => {
            autocomplete.setFields(['formatted_address', 'address_components']);
            autocomplete.addListener("place_changed", () => {
              const place = autocomplete.getPlace();
              handlePlaceSelect(place);
            });
          }}
        >
          <input
            type="text"
            value={location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 placeholder-gray-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
            placeholder="Enter location..."
            disabled={!googleMapsLoaded}
          />
        </Autocomplete>
        {hasSelection && (
          <button
            onClick={() => {
              setLocation("");
              onClear();
              setHasSelection(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400"
            aria-label="Clear location"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
