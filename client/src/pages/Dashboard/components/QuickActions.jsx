import { Link } from "react-router-dom";

export default function QuickActions() {
  // later connect to /kanban, /calendar, /requests/create routes
  return (
    <div className="quick-actions">
      <Link className="btn" to="/dashboard">Refresh</Link>
      {/* replace with real routes once you add them */}
      {/* <Link className="btn" to="/kanban">Kanban</Link>
      <Link className="btn" to="/calendar">Calendar</Link>
      <Link className="btn primary" to="/requests/create">New Request</Link> */}
    </div>
  );
}