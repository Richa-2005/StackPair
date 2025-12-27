import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser(); // { name, role } from localStorage (as you already do)

  const logout = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand">GearGuard</div>

        <nav className="navlinks">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Dashboard
          </NavLink>
          <NavLink to="/kanban" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Kanban
          </NavLink>
          <NavLink to="/calendar" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Calendar
          </NavLink>
          <NavLink to="/equipment" className={({ isActive }) => (isActive ? "navlink active" : "navlink")}>
            Equipment
          </NavLink>
        </nav>
      </div>

      <div className="topbar-right">
        <div className="userpill">
          {user?.name || "User"} <span>({user?.role || "-"})</span>
        </div>
        <button className="btn logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}