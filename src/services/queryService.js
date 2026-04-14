import { db } from "../firebase/config";
//import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import {
  addDoc,
  collection,
  where,
  onSnapshot,
  updateDoc,
  doc,
  query
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


// Add comment
export const addComment = async (comment) => {
  await addDoc(collection(db, "comments"), comment);
};

// Get comments for a query
export const getComments = (queryId, callback) => {
  const q = query(
    collection(db, "comments"),
    where("queryId", "==", queryId)
  );

  return onSnapshot(q, (snapshot) => {
    const comments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(comments);
  });
};