import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout, getUser } from "../utils/auth";
import "./AppLayout.css";

export default function AppLayout() {
  const nav = useNavigate();
  const user = getUser();

  return (
    <div>
      <header className="topbar">
        <div className="topbar-left">
          <div className="brand">GearGuard</div>

          <nav className="navlinks">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/kanban"
              className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
            >
              Kanban
            </NavLink>

            <NavLink
              to="/calendar"
              className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
            >
              Calendar
            </NavLink>

            <NavLink
              to="/equipment"
              className={({ isActive }) => (isActive ? "navlink active" : "navlink")}
            >
              Equipment
            </NavLink>
          </nav>
        </div>

        <div className="topbar-right">
          <div className="userpill">
            {user?.name || "User"} <span>({user?.role || "-"})</span>
          </div>

          <button
            className="btn logout-btn"
            onClick={() => {
              logout();
              nav("/", { replace: true });
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}