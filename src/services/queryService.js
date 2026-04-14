import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

// Add Query
export const addQuery = async (query) => {
  await addDoc(collection(db, "queries"), query);
};

// Get Queries (real-time)
export const getQueries = (callback) => {
  return onSnapshot(collection(db, "queries"), (snapshot) => {
    const queries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(queries);
  });
};

// Update status
export const updateQueryStatus = (id, status) => {
  return updateDoc(doc(db, "queries", id), { status });
};