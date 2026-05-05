import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/projects" element={
          <ProtectedRoute><Projects /></ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute><Tasks /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;