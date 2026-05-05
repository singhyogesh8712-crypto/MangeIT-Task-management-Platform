import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Member" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/signup", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Could not create account. Please try again.");
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

        <h1>Create account</h1>
        <p>Set up your workspace and start managing projects.</p>

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
            <label className="form-label" htmlFor="name">Full name</label>
            <input
              id="name"
              className="form-control"
              placeholder="Alex Johnson"
              autoComplete="name"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Work email</label>
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
              placeholder="Min 6 characters"
              autoComplete="new-password"
              required
              minLength="6"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Account role</label>
            <select
              id="role"
              className="form-control"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
            <span className="form-error" style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
              Admins can create projects and assign tasks.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: "var(--space-2)", padding: "11px 18px", fontSize: "0.9375rem" }}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
