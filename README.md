# ManageIT

A role-based project and task management application built for small teams. Admins manage the workspace — creating projects, assigning tasks, and tracking progress. Members update their own task statuses and stay on top of deadlines.

---

## Tech Stack

**Frontend** — React, React Router v6, Context API, Custom CSS  
**Backend** — Node.js, Express.js  
**Database** — MongoDB with Mongoose  
**Auth** — JWT + bcryptjs

---

## Features

- JWT authentication with protected routes
- Role-based access control — Admin and Member permissions
- Project management with team member assignment
- Task lifecycle management — Todo → In Progress → Done
- Dashboard with live stats: total, completed, pending, and overdue tasks
- Overdue task detection based on due dates

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB connection URI (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`. The frontend expects the backend at `http://localhost:5000/api` — update `src/utils/api.js` if your port differs.

---

## API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | All | List all projects |
| POST | `/api/projects` | Admin | Create a project |
| PUT | `/api/projects/:id/add-member` | Admin | Add a member by user ID |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | All | Get tasks (filtered by role) |
| POST | `/api/tasks` | Admin | Create and assign a task |
| PUT | `/api/tasks/:id` | All | Update task status |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Returns total, completed, pending, overdue counts |

---

## Project Structure

```
├── backend/
│   ├── models/          # Mongoose schemas (User, Project, Task)
│   ├── routes/          # Express route handlers
│   ├── middleware/       # JWT auth middleware
│   └── server.js
│
└── frontend/
    └── src/
        ├── components/  # Navbar, ProtectedRoute
        ├── context/     # AuthContext
        ├── pages/       # Dashboard, Projects, Tasks, Login, Signup
        └── utils/       # Axios instance
```

---

## Roles

| Action | Admin | Member |
|--------|-------|--------|
| Create project | ✓ | — |
| Add member to project | ✓ | — |
| Create & assign task | ✓ | — |
| View projects | ✓ | ✓ |
| View assigned tasks | ✓ | ✓ |
| Update task status | ✓ | ✓ |
| View dashboard | ✓ | ✓ |

---

## Deployment

- **Backend** — Render / Railway (pending)
- **Frontend** — Render (pending)

For production, set `REACT_APP_API_URL` in your frontend environment on Render to point to your backend's deployed URL (e.g., `https://your-backend.onrender.com/api`). The application is already configured to use this automatically.