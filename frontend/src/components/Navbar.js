import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/projects",  label: "Projects"  },
    { path: "/tasks",     label: "Tasks"     },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="brand-mark">MI</div>
          <span className="brand-name">ManageIT</span>
        </Link>

        {/* Nav Links */}
        <nav>
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link${location.pathname === link.path ? " active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {user && (
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
          )}
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
