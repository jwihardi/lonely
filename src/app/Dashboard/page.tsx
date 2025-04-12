"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


const ACTIVE_ROUTE = "py-1 px-2 text-gray-300 bg-gray-700"
const INACTIVE_ROUTE = "py-1 px-2 text-gray-500 hover:bg-gray-700"

function ProjectListingButton() {
    return(
        <ul>
        <li className="mb-2">
        <Link href="/AddListing" className={usePathname() === "/AddListing" ? ACTIVE_ROUTE : INACTIVE_ROUTE}
        style={{fontSize: "20px", color: "#d9d9d9", padding: "13px"}}
        >
            Add Project Listing
        </Link>
        </li>
    </ul>
    )
};


export default async function HomePage() {
    const session = await getServerSession();
    if(!session || !session.user){
        redirect("/api/auth/signin");
    }

    return (
    <div>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", position: "relative" }}>
        <div style={{ position: "absolute", left: 100, top: 20}}>
            <ProjectListingButton />
        </div>
        <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "10px"}}>
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