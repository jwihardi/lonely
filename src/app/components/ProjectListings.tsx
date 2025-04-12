"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ACTIVE_ROUTE = "py-1 px-2 text-gray-300 bg-gray-700";
const INACTIVE_ROUTE = "py-1 px-2 text-gray-500 hover:bg-gray-700";

export default function ProjectListingButton() {
  const pathname = usePathname();

  return (
    <ul>
      <li className="mb-2">
        <Link
          href="/AddListing"
          className={pathname === "/AddListing" ? ACTIVE_ROUTE : INACTIVE_ROUTE}
          style={{ fontSize: "20px", color: "#d9d9d9", padding: "13px" }}
        >
          Add Project Listing
        </Link>
      </li>
    </ul>
  );
}
