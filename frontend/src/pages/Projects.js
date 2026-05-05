import { useEffect, useState, useContext } from "react";
import API from "../utils/api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [addingTo, setAddingTo] = useState(null); // project id where member input is shown
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      await API.post("/projects", { name: name.trim() });
      setName("");
      setShowCreateForm(false);
      fetchProjects();
    } catch {
      alert("Only Admins can create projects.");
    } finally {
      setCreating(false);
    }
  };

  const addMember = async (projectId) => {
    if (!userId.trim()) return;
    try {
      await API.put(`/projects/${projectId}/add-member`, { userId: userId.trim() });
      setUserId("");
      setAddingTo(null);
      fetchProjects();
    } catch {
      alert("Could not add member. Check the user ID.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="page-wrapper animate-fade-in">
      <Navbar />

      <main className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="flex items-center justify-between">
            <div>
              <p className="label-sm" style={{ marginBottom: "8px" }}>Workspace</p>
              <h1>Projects</h1>
              <p style={{ marginTop: "8px" }}>
                {projects.length > 0
                  ? `${projects.length} project${projects.length !== 1 ? "s" : ""} in your workspace.`
                  : "Manage and collaborate on team projects."}
              </p>
            </div>

            {user?.role === "Admin" && (
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateForm((v) => !v)}
              >
                {showCreateForm ? (
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
                    New project
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Create Project Inline Form */}
        {user?.role === "Admin" && showCreateForm && (
          <div
            className="card animate-fade-up"
            style={{ marginBottom: "var(--space-6)", maxWidth: 520 }}
          >
            <h3 style={{ marginBottom: "var(--space-5)", fontSize: "1rem" }}>
              New project
            </h3>
            <form onSubmit={createProject}>
              <div className="form-group" style={{ marginBottom: "var(--space-4)" }}>
                <label className="form-label">Project name</label>
                <input
                  className="form-control"
                  placeholder="e.g. Website Redesign"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={creating || !name.trim()}
                >
                  {creating ? "Creating…" : "Create project"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setShowCreateForm(false); setName(""); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Project Grid */}
        {loading ? (
          <div className="grid cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="project-card" style={{ opacity: 0.4 }}>
                <div style={{ height: 20, width: "60%", background: "var(--ink-700)", borderRadius: 4 }} />
                <div style={{ height: 40, background: "var(--ink-700)", borderRadius: 4 }} />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">🗂</div>
              <h3>No projects yet</h3>
              <p>
                {user?.role === "Admin"
                  ? "Create your first project to get started."
                  : "Ask an Admin to create a project and add you as a member."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid cols-3 stagger-children">
            {projects.map((p) => (
              <ProjectCard
                key={p._id}
                project={p}
                isAdmin={user?.role === "Admin"}
                userId={userId}
                setUserId={setUserId}
                addingTo={addingTo}
                setAddingTo={setAddingTo}
                onAddMember={addMember}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function ProjectCard({ project: p, isAdmin, userId, setUserId, addingTo, setAddingTo, onAddMember }) {
  const isAddingHere = addingTo === p._id;

  return (
    <div className="project-card animate-fade-up">
      {/* Title */}
      <div>
        <p className="label-sm" style={{ marginBottom: "8px" }}>Project</p>
        <div className="project-card-title">{p.name}</div>
      </div>

      {/* Members */}
      <div>
        <p className="project-members-label">
          Members · {p.members?.length ?? 0}
        </p>
        <div className="flex flex-wrap gap-2">
          {p.members?.length > 0 ? (
            p.members.map((m) => (
              <span key={m._id} className="badge badge-member">
                {m.name}
              </span>
            ))
          ) : (
            <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)" }}>
              No members added
            </span>
          )}
        </div>
      </div>

      {/* Admin: Add Member */}
      {isAdmin && (
        <div className="project-card-footer">
          {!isAddingHere ? (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setAddingTo(p._id);
                setUserId("");
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              Add member
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className="form-group">
                <label className="form-label">User ID</label>
                <input
                  className="form-control"
                  placeholder="Paste user ID…"
                  value={userId}
                  autoFocus
                  onChange={(e) => setUserId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") onAddMember(p._id); }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onAddMember(p._id)}
                  disabled={!userId.trim()}
                >
                  Add
                </button>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setAddingTo(null); setUserId(""); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Projects;
