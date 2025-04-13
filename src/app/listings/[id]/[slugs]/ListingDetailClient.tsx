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

  if (!currentUsername || currentUsername === posterUsername) {
    return null;
  }

  return (
    <div className="mt-8">
      <ApplicationButton
        projectId={projectId}
        projectTitle={projectTitle}
        applicantUsername={currentUsername}
        posterUsername={posterUsername}
      />
    </div>
  );
}