"use client";

import { useSession } from "next-auth/react";
import ApplicationButton from "../../../components/ApplicationButton";

interface ListingDetailClientProps {
  projectId: string;
  projectTitle: string;
  posterUsername: string;
}

export default function ListingDetailClient({
  projectId,
  projectTitle,
  posterUsername,
}: ListingDetailClientProps) {
  const { data: session } = useSession();
  const currentUsername = session?.user?.name;

  if (currentUsername === posterUsername) {
    return null; // Don't show application button if the user is the poster
  }

  return (
    <div className="mt-8">
      <ApplicationButton
        projectId={projectId}
        projectTitle={projectTitle}
        username={currentUsername || ""}
      />
    </div>
  );
}
