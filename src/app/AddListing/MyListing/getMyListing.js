import { db } from "../../firebaseConfig";
import { collection, getDocs, query, where} from "firebase/firestore";

export default async function GetMyListing(username) {
    const listingsRef = collection(db, "projects");
    const q = query(listingsRef, where("username", "==", String(username)));
    const querySnapshot = await getDocs(q);

    const listings = [];
    querySnapshot.forEach((doc) => {
        listings.push({id: doc.id, ...doc.data()});
    });

    console.log("Listings: ", listings);
    return listings;
}

