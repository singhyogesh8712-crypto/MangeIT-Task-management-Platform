import { useState, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout animate-scale-in">
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <div className="brand-mark">MI</div>
          <span className="brand-name">ManageIT</span>
        </div>

        <h1>Sign in</h1>
        <p>Enter your credentials to access your workspace.</p>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: "var(--space-6)" }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7.5 4.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="7.5" cy="10.5" r="0.75" fill="currentColor"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              className="form-control"
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: "var(--space-2)", padding: "11px 18px", fontSize: "0.9375rem" }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup">Create one</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
