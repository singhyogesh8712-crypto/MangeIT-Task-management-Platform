import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const STATUS_BADGE = {
  "Todo":        "badge badge-todo",
  "In Progress": "badge badge-progress",
  "Done":        "badge badge-done",
};

const STATUS_TRANSITIONS = {
  "Todo":        { label: "Start task",  next: "In Progress" },
  "In Progress": { label: "Mark done",   next: "Done"        },
  "Done":        { label: "Completed",   next: null           },
};

function Tasks() {
  const [tasks, setTasks]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter]     = useState("all"); // all | todo | progress | done | overdue

  const [form, setForm] = useState({
    title: "",
    projectId: "",
    assignedTo: "",
    dueDate: "",
  });

  const { user } = useContext(AuthContext);

  const fetchData = async () => {
    try {
      const [taskRes, projectRes, usersRes] = await Promise.all([
        API.get("/tasks"),
        API.get("/projects"),
        API.get("/users").catch(() => ({ data: null }))
      ]);

      setTasks(taskRes.data);
      setProjects(projectRes.data);

      let allUsers = usersRes.data;
      if (!allUsers) {
        allUsers = [];
        const seen = new Set();
        projectRes.data.forEach((p) => {
          (p.members || []).forEach((m) => {
            if (!seen.has(m._id)) {
              seen.add(m._id);
              allUsers.push(m);
            }
          });
        });
      }
      setUsers(allUsers);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.assignedTo || !form.dueDate) return;
    setCreating(true);
    try {
      await API.post("/tasks", form);
      setForm({ title: "", projectId: "", assignedTo: "", dueDate: "" });
      setShowForm(false);
      fetchData();
    } catch {
      alert("Only Admins can create tasks.");
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status });
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status } : t))
      );
    } catch {
      alert("Could not update task status.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const now = new Date();
  const isOverdue = (t) => t.status !== "Done" && new Date(t.dueDate) < now;

  const filtered = tasks.filter((t) => {
    if (filter === "all")      return true;
    if (filter === "overdue")  return isOverdue(t);
    if (filter === "todo")     return t.status === "Todo";
    if (filter === "progress") return t.status === "In Progress";
    if (filter === "done")     return t.status === "Done";
    return true;
  });

  const counts = {
    all:      tasks.length,
    todo:     tasks.filter((t) => t.status === "Todo").length,
    progress: tasks.filter((t) => t.status === "In Progress").length,
    done:     tasks.filter((t) => t.status === "Done").length,
    overdue:  tasks.filter((t) => isOverdue(t)).length,
  };

  const FILTER_TABS = [
    { key: "all",      label: "All" },
    { key: "todo",     label: "Todo" },
    { key: "progress", label: "In Progress" },
    { key: "done",     label: "Done" },
    { key: "overdue",  label: "Overdue" },
  ];

  return (
    <div className="page-wrapper animate-fade-in">
      <Navbar />

      <main className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm" style={{ marginBottom: "8px" }}>Workspace</p>
              <h1>Tasks</h1>
              <p style={{ marginTop: "8px" }}>
                Track and update your team's assignments.
              </p>
            </div>
            {user?.role === "Admin" && (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm((v) => !v)}
              >
                {showForm ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    New task
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Create Task Form (Admin only) */}
        {user?.role === "Admin" && showForm && (
          <div className="card animate-fade-up" style={{ marginBottom: "var(--space-6)" }}>
            <h3 style={{ marginBottom: "var(--space-5)", fontSize: "1rem" }}>
              New task
            </h3>
            <form onSubmit={createTask}>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: "var(--space-4)",
                  marginBottom: "var(--space-5)",
                }}
              >
                <div className="form-group">
                  <label className="form-label">Task title *</label>
                  <input
                    className="form-control"
                    placeholder="e.g. Design homepage mockup"
                    value={form.title}
                    autoFocus
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Project</label>
                  <select
                    className="form-control"
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  >
                    <option value="">No project</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Assign to *</label>
                  <select
                    className="form-control"
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  >
                    <option value="">Select member</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due date *</label>
                  <input
                    className="form-control"
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={creating || !form.title.trim() || !form.assignedTo || !form.dueDate}
                >
                  {creating ? "Creating…" : "Create task"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setShowForm(false); setForm({ title: "", projectId: "", assignedTo: "", dueDate: "" }); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div
          className="flex gap-2"
          style={{ marginBottom: "var(--space-5)", flexWrap: "wrap" }}
        >
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`btn btn-sm ${filter === tab.key ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter(tab.key)}
              style={tab.key === "overdue" && counts.overdue > 0 ? { color: "var(--status-danger)", borderColor: "var(--status-danger-border)" } : {}}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span
                  style={{
                    background: filter === tab.key ? "rgba(255,255,255,0.2)" : "var(--ink-600)",
                    color: filter === tab.key ? "#fff" : "var(--text-secondary)",
                    padding: "1px 7px",
                    borderRadius: 100,
                    fontSize: "0.6875rem",
                    fontWeight: 600,
                    marginLeft: 2,
                  }}
                >
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Task Grid */}
        {loading ? (
          <div className="grid cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="task-card" style={{ opacity: 0.35 }}>
                <div style={{ height: 20, width: "50%", background: "var(--ink-700)", borderRadius: 4 }} />
                <div style={{ height: 48, background: "var(--ink-700)", borderRadius: 4, marginTop: 8 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">
                {filter === "overdue" ? "⚠️" : "✓"}
              </div>
              <h3>
                {filter === "all"
                  ? "No tasks yet"
                  : filter === "overdue"
                  ? "No overdue tasks"
                  : `No ${filter === "progress" ? "in-progress" : filter} tasks`}
              </h3>
              <p>
                {filter === "all"
                  ? user?.role === "Admin"
                    ? "Create your first task using the button above."
                    : "No tasks have been assigned to you yet."
                  : "Nothing here. Adjust the filter to see more."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid cols-3 stagger-children">
            {filtered.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                isOverdue={isOverdue(t)}
                onUpdateStatus={updateStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TaskCard({ task: t, isOverdue, onUpdateStatus }) {
  const transition = STATUS_TRANSITIONS[t.status];

  return (
    <div className={`task-card animate-fade-up${isOverdue ? " overdue" : ""}`}>
      {/* Header row: status badge + overdue */}
      <div className="task-card-header">
        <span className={STATUS_BADGE[t.status]}>{t.status}</span>
        {isOverdue && (
          <span className="badge badge-overdue">Overdue</span>
        )}
      </div>

      {/* Title */}
      <div className="task-title">{t.title}</div>

      {/* Meta */}
      <div className="task-meta">
        <div className="task-meta-item">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" opacity=".6">
            <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M4 1V3M8 1V3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M1 5H11" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
          <span>Due {new Date(t.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
        {t.projectId?.name && (
          <div className="task-meta-item">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" opacity=".6">
              <path d="M1 3L6 1L11 3V10L6 12L1 10V3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M6 1V12" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M1 3L11 3" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            <span>{t.projectId.name}</span>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="task-card-actions">
        {transition.next ? (
          <button
            className="btn btn-ghost btn-sm w-full"
            style={{ justifyContent: "center" }}
            onClick={() => onUpdateStatus(t._id, transition.next)}
          >
            {transition.label}
          </button>
        ) : (
          <button
            className="btn btn-sm w-full"
            style={{
              justifyContent: "center",
              background: "var(--status-success-bg)",
              color: "var(--status-success)",
              border: "1px solid var(--status-success-border)",
              cursor: "default",
            }}
            disabled
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1.5 6L4.5 9L10.5 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Done
          </button>
        )}
      </div>
    </div>
  );
}

export default Tasks;
