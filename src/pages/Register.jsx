import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setRole: setAuthRole } = useAuth();

  const handleRegister = async () => {
    setError("");
    try {
      const user = await registerUser(email, password, role);
      setUser(user);
      setAuthRole(user.role);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-grid">
          <div className="auth-side auth-side-warm">
            <p className="auth-kicker auth-kicker-warm">New Account</p>
            <h2 className="auth-title">Join the Query Hub</h2>
            <p className="auth-copy">
              Create a profile, choose your role, and start organizing requests in minutes.
            </p>
            <div className="auth-list">
              <p>Submit queries with clear titles and descriptions.</p>
              <p>Track progress and resolve items when the work is done.</p>
              <p>Stay aligned with staff and admins in one space.</p>
            </div>
          </div>

          <div className="auth-form">
            <div className="form-stack">
              <div className="form-group">
                <label className="auth-label">Email</label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="auth-label">Password</label>
                <input
                  type="password"
                  placeholder="Create a secure password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="auth-label">Role</label>
                <select
                  onChange={(e) => setRole(e.target.value)}
                  className="select"
                >
                  <option value="student">Student</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                onClick={handleRegister}
                className="btn btn-primary auth-submit"
              >
                Register
              </button>
              {error && <div className="alert">{error}</div>}
              <div className="helper">
                Already have an account?{" "}
                <Link to="/login" className="link">
                  Sign in
                </Link>
              </div>
              <p className="helper">
                Your role can be updated later by an administrator if needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
