"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const INACTIVE_ROUTE = "py-1 px-2 text-gray-500 hover:bg-gray-700"

export default function DashboardButton() {
    return(
               <ul>
               <li className="mb-2">
                   <Link 
                       href="/Dashboard" 
                       className={usePathname() === "/Dashboard" ? ACTIVE_ROUTE : INACTIVE_ROUTE}
                       style={{ fontSize: "1rem" }}
                   >
                       Dashboard
                   </Link>
               </li>
           </ul>
           )
}