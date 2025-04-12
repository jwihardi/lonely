import { db } from "../firebaseConfig"
import { collection, getDocs, query, where} from "firebase/firestore";

export default async function GetAllListings(username) {
    const listingsRef = collection(db, "projects");
    const querySnapshot = await getDocs(listingsRef);

    const listings = [];
    querySnapshot.forEach((doc) => {
        listings.push({id: doc.id, ...doc.data()});
    });

    console.log("Listings: ", listings);
    return listings;
}

