// No "use client" here!
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ProjectListingButton from "../components/ProjectListings"; // client component

export default async function HomePage() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", position: "relative" }}>
        <div style={{ position: "absolute", left: 100, top: 20 }}>
          <ProjectListingButton />
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" }}>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{ 
              padding: "10px", 
              width: "50%", 
              border: "1px solid #ccc", 
              borderRadius: "4px" 
            }} 
          />
        </div>
      </div>
    </div>
  );
}
