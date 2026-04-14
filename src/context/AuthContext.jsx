import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole } from "../services/authService";

const AuthContext = createContext(); //  Creates a shared "container" for auth data (like user info and role)

export const useAuth = () => useContext(AuthContext); //useAuth() - A hook that lets any component "grab" the current user and role data easily 
 
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const r = await getUserRole(u.uid);
        setRole(r);
      } else {
        setUser(null);
        setRole(null);
      }
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role }}>
      {children}
    </AuthContext.Provider>
  );
}