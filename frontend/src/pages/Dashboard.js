import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const STATS_CONFIG = [
  {
    key: "total",
    label: "Total Tasks",
    colorVar: "--status-info",
    bgVar: "--status-info-bg",
    accentColor: "#38bdf8",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="2" rx="1" fill="currentColor" opacity=".9"/>
        <rect x="1" y="7" width="10" height="2" rx="1" fill="currentColor" opacity=".6"/>
        <rect x="1" y="12" width="7" height="2" rx="1" fill="currentColor" opacity=".4"/>
      </svg>
    ),
  },
  {
    key: "completed",
    label: "Completed",
    colorVar: "--status-success",
    bgVar: "--status-success-bg",
    accentColor: "#22c55e",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 8.5L6 12L13.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "pending",
    label: "In Progress",
    colorVar: "--status-warning",
    bgVar: "--status-warning-bg",
    accentColor: "#f59e0b",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 5V8.5L10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: "overdue",
    label: "Overdue",
    colorVar: "--status-danger",
    bgVar: "--status-danger-bg",
    accentColor: "#f43f5e",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2L14.5 13H1.5L8 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M8 7V9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="8" cy="11.5" r="0.75" fill="currentColor"/>
      </svg>
    ),
  },
];

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const completionRate =
    data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;

  return (
    <div className="page-wrapper animate-fade-in">
      <Navbar />

      <main className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm" style={{ marginBottom: "8px" }}>Overview</p>
              <h1>
                Welcome back,{" "}
                <span style={{ color: "var(--accent)" }}>{user?.name}</span>
              </h1>
              <p style={{ marginTop: "8px" }}>
                Here's a summary of your team's current workload.
              </p>
            </div>

            {/* Completion ring — subtle KPI */}
            {!loading && data.total > 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "20px 28px",
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-xl)",
                  minWidth: "120px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.875rem",
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color:
                      completionRate >= 70
                        ? "var(--status-success)"
                        : completionRate >= 40
                        ? "var(--status-warning)"
                        : "var(--text-primary)",
                    lineHeight: 1,
                  }}
                >
                  {completionRate}%
                </span>
                <span className="label-sm" style={{ color: "var(--text-secondary)" }}>
                  complete
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid cols-4 stagger-children" style={{ marginBottom: "var(--space-8)" }}>
          {STATS_CONFIG.map((s) => (
            <div key={s.key} className="stat-card animate-fade-up">
              {/* Accent top bar */}
              <div
                className="stat-accent-bar"
                style={{ background: s.accentColor }}
              />

              {/* Icon */}
              <div
                className="stat-icon"
                style={{
                  background: `rgba(${hexToRgb(s.accentColor)}, 0.12)`,
                  color: s.accentColor,
                }}
              >
                {s.icon}
              </div>

              <div className="stat-value">
                {loading ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 48,
                      height: 36,
                      background: "var(--ink-700)",
                      borderRadius: 6,
                      animation: "fadeIn 1s infinite alternate",
                    }}
                  />
                ) : (
                  data[s.key]
                )}
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Insight strip */}
        {!loading && data.overdue > 0 && (
          <div
            className="animate-fade-up"
            style={{
              padding: "14px 20px",
              background: "var(--status-danger-bg)",
              border: "1px solid var(--status-danger-border)",
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14.5 13H1.5L8 2Z" stroke="#f43f5e" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M8 7V9.5" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round"/>
              <circle cx="8" cy="11.5" r="0.75" fill="#f43f5e"/>
            </svg>
            <span style={{ fontSize: "0.875rem", color: "var(--status-danger)", fontWeight: 500 }}>
              {data.overdue} task{data.overdue !== 1 ? "s are" : " is"} past due — review them in the{" "}
              <a href="/tasks" style={{ color: "var(--status-danger)", textDecoration: "underline" }}>
                Tasks
              </a>{" "}
              view.
            </span>
          </div>
        )}

        {!loading && data.total === 0 && (
          <div className="card" style={{ marginTop: "var(--space-4)" }}>
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No tasks yet</h3>
              <p>Tasks created in your projects will show up here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* tiny helper to convert hex → r,g,b for inline rgba */
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

export default Dashboard;
