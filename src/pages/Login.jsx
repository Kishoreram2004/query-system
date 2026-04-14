import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err) {
      const message =
        err?.code === "auth/invalid-credential"
          ? "Invalid email or password."
          : "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-grid">
          <div className="auth-side">
            <p className="auth-kicker">Welcome Back</p>
            <h2 className="auth-title">Sign in to Query Hub</h2>
            <p className="auth-copy">
              Track active requests, follow updates, and keep your support loop tight.
            </p>
            <div className="auth-note">
              <p className="auth-note-title">Need quick access?</p>
              <p className="auth-note-text">
                Use the same email you registered with to rejoin your workflow.
              </p>
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
                  placeholder="Your secure password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                />
              </div>

              <button
                onClick={handleLogin}
                className="btn btn-primary auth-submit"
              >
                Login
              </button>
              {error && <div className="alert">{error}</div>}
              <div className="helper">
                New here?{" "}
                <Link to="/register" className="link">
                  Create an account
                </Link>
              </div>
              <p className="helper">
                By signing in, you agree to keep request data accurate and respectful.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
