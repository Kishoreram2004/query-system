import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QueryDetail from "./pages/QueryDetail";
import { useAuth } from "./context/AuthContext";

function HomeRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/register" replace />;
  return <Dashboard />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/query/:id" element={<QueryDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
