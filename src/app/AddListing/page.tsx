import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CreateListing from "../components/CreateListing";
export default async function CreateListingsPage(){
    const session = await getServerSession();
    if(!session || !session.user){
        redirect("/api/auth/signin");
    }
    return <CreateListing username={session.user.name} />;
}