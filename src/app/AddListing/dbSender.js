import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

//onClick={(e) => {addToFirestore(username, title, description, githubLink, requirements, niceToHaves, tags); e.preventDefault();}}

export default async function addToFirestore(username, title, description, githubLink, tags, requirements, niceToHaves, groupSize, location = 'virtual') {
    try {
        // Make sure db is initialized before using it
        if (!db) {
            throw new Error("Firestore database is not initialized");
        }
        
        // Create the collection reference
        const projectsCollection = collection(db, "projects");
        
        // Add the document to the collection
        const docRef = await addDoc(projectsCollection, {
            username: username,
            title: title.toUpperCase(),
            description: description,
            githubLink: githubLink,
            tags: tags,
            requirements: requirements,
            niceToHaves: niceToHaves,
            groupSize: groupSize,
            location: location,
            applications: [], // Initialize with empty applications array
            createdAt: new Date().toISOString()
        });
        
        console.log("Document written with ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e; // Rethrow to handle in the component
    }
}