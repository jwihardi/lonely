"use client";
import { SessionProvider } from "next-auth/react";
import { GoogleMapsProvider } from "./GoogleMapsProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <GoogleMapsProvider>
        {children}
      </GoogleMapsProvider>
    </SessionProvider>
  );
}