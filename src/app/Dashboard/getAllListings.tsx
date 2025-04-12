import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export default async function GetAllListings(searchQuery: string = '') {
    const listingsRef = collection(db, "projects");
    
    let q = query(listingsRef);
    let title_q;
    let username_q;


    if (searchQuery) {
        title_q = query(
            listingsRef,
            where("title", ">=", searchQuery.toLowerCase()),
            where("title", "<=", searchQuery.toLowerCase() + "\uf8ff")
        );
        username_q = query(
            listingsRef,
            where("username", ">=", searchQuery.toLowerCase()),
            where("username", "<=", searchQuery.toLowerCase() + "\uf8ff")
        );
    }
    
    const nameSnapshot = await getDocs(searchQuery ? title_q! : q);
    const usernameSnapshot = await getDocs(searchQuery ? username_q! : q);
    const listings: any[] = [];
    
    nameSnapshot.forEach((doc) => {
        listings.push({ id: doc.id, ...doc.data() });
    });
    
    usernameSnapshot.forEach((doc) => {
        listings.push({ id: doc.id, ...doc.data() });
    });
    const uniqueListings = listings.filter((listing, index, self) =>
        index === self.findIndex((t) => t.id === listing.id)
    );
    listings.length = 0;
    listings.push(...uniqueListings);

    return listings;
}