import { db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

//onClick={(e) => {addToFirestore(username, title, description, githubLink, requirements, niceToHaves, tags); e.preventDefault();}}

export default async function addToFirestore(username, title, description, githubLink, tags, requirements, niceToHaves, groupSize, location = 'virtual') {
        try{
        const docRef = await addDoc(collection(db, "projects"), {
            username: username,
            title: title.toUpperCase(),
            description: description,
            githubLink: githubLink,
            tags: tags,
            requirements: requirements,
            niceToHaves: niceToHaves,
            groupSize: groupSize,
            location: location,
        });
        console.log("Document written with ID: ", docRef.id);
        return true;
    } catch (e) {
        console.error("Error adding document: ", e);
        return false;
    }
}