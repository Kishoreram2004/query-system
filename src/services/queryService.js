import { db } from "../firebase/config";
//import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import {
  addDoc,
  collection,
  where,
  onSnapshot,
  updateDoc,
  doc,
  query,
  deleteDoc,
  getDocs,
  writeBatch
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

// Delete query and all its comments
export const deleteQueryAndComments = async (queryId) => {
  const batch = writeBatch(db);
  const commentsQuery = query(
    collection(db, "comments"),
    where("queryId", "==", queryId)
  );
  const commentSnaps = await getDocs(commentsQuery);
  commentSnaps.forEach((snap) => batch.delete(snap.ref));
  batch.delete(doc(db, "queries", queryId));
  await batch.commit();
};

// Get single query (real-time)
export const getQueryById = (id, callback) => {
  return onSnapshot(doc(db, "queries", id), (snapshot) => {
    callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
  });
};

// Add comment
export const addComment = async (comment) => {
  await addDoc(collection(db, "comments"), comment);
};

// Delete single comment
export const deleteComment = (commentId) => {
  return deleteDoc(doc(db, "comments", commentId));
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
