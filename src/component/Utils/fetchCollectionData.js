import { collection, getDocs } from "firebase/firestore";
import { orderBy,query } from "firebase/firestore";
 
import { db } from "../../firebase/Firebase";
/**
 * Fetches data from a Firestore collection
 * @param {string} collectionName - Name of the Firestore collection
 * @returns {Promise<Array>} - Returns array of documents
 */
export const fetchCollectionData = async (collectionName) => {
  try {
   const colRef = collection(db, collectionName);
    const q = query(colRef, orderBy("created_date", "desc"));

    // Execute query
    const snapshot = await getDocs(q);

    // Map results
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return data;
  } catch (error) {
    console.error("Error fetching collection:", error);
    return [];
  }
};
