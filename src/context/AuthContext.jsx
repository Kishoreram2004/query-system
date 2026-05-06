import { createContext, useContext, useEffect, useState } from "react";
import { clearToken, getToken } from "../services/api";
import { getCurrentUser } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
 
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setRole(currentUser.role);
      } catch (_error) {
        clearToken();
        setUser(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading, setUser, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}
