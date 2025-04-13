"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"] as any;

interface GoogleMapsContextType {
  googleMapsLoaded: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google?.maps) {
      setGoogleMapsLoaded(true);
    }
  }, []);

  return (
    <GoogleMapsContext.Provider value={{ googleMapsLoaded }}>
      <LoadScript
        googleMapsApiKey="***REMOVED***"
        libraries={libraries}
        language="en"
        region="US"
        onLoad={() => setGoogleMapsLoaded(true)}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
}

export function useGoogleMaps() {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
}