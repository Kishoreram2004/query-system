import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import QueryDetail from "./pages/QueryDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/query/:id" element={<QueryDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;