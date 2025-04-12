"use client"
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Home from "../page";

const ACTIVE_ROUTE = "py-1 px-2 text-gray-300 bg-gray-700"
const INACTIVE_ROUTE = "py-1 px-2 text-gray-500 hover:bg-gray-700"

function HomeButton() {
    const {data: session} = useSession();
    // {session?.user?.name} <br />
    if(session){
        return(
            <ul>
            <li className="mb-2">
                <Link 
                    href="/Dashboard" 
                    className={usePathname() === "/Dashboard" ? ACTIVE_ROUTE : INACTIVE_ROUTE}
                    style={{ fontSize: "2rem" }}
                >
                    Dashboard
                </Link>
            </li>
        </ul>
        )
}
}

function AuthButton() {
    const { data: session } = useSession();
    const buttonStyle = "mt-2 px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600";
    if (session){
        return(
            <>
            <button 
                onClick={() => signOut()} 
                className={INACTIVE_ROUTE}
                style={{ fontSize: "1.4rem" }}
            >
                Sign out
            </button>
            </> 
        );
    }
    return(
        <>
        <button 
            onClick={() => signIn()}
            className={INACTIVE_ROUTE}
            style={{ fontSize: "1.4rem" }}
        >   
            Sign in
        </button>
        </>
    );
}

export default function NavMenu() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center text-white">
            <div className="text-center">
                <HomeButton />
                <hr className="my-4 w-1/2 mx-auto" />
                <AuthButton />
                <ul>        
                    <li className="mb-2">
                        <Link href="/about" className={usePathname() === "/about" ? ACTIVE_ROUTE : INACTIVE_ROUTE}
                        style={{ fontSize: "1.4rem" }}
                        >
                            About
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
