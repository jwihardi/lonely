import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("id");
  const posterUsername = searchParams.get("username");
  if (!session?.user?.name || !listingId || !posterUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.name !== posterUsername) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const docRef = doc(db, "projects", listingId);
    await deleteDoc(docRef);
    return NextResponse.redirect(new URL("/AddListing/MyListing", request.url));
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json({ error: "Failed to delete listing" }, { status: 500 });
  }
}