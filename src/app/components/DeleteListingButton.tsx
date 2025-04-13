"use server";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import Link from "next/link";
export default async function DeleteListingButton({ listingId, username }: { listingId: string; username: string }) {
  return (
    <Link
      href={`/api/delete-listing?id=${listingId}&username=${username}`}
      className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all duration-300"
    >
      Delete Listing
    </Link>
  );
}