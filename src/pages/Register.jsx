import { useState } from "react";
import { registerUser } from "../services/authService";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleRegister = async () => {
    await registerUser(email, password, role);
    alert("User Registered");
  };

  return (
    <div>
      <h2>Register</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="staff">Staff</option>
        <option value="admin">Admin</option>
      </select>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}