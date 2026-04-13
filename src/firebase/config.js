import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4ItWMB5bQGAHB2LCz5eesLQn3eX9Llpk",
  authDomain: "query-system-500dc.firebaseapp.com",
  projectId: "query-system-500dc",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
