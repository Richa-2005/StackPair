import "./AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-bg" />

      {/* Content */}
      <div className="auth-wrapper">

        {/* HEADER */}
        <header className="auth-header">
          <h1>GearGuard</h1>
        </header>

        {/* MAIN SECTION */}
        <div className="auth-main">
<div className="auth-desc-wrapper">
          {/* LEFT DESCRIPTION CARD */}
          <div className="auth-desc-card">
            <h2>Smart Maintenance Tracking</h2>
            <p className="desc-subtitle">
              For Modern Organizations
            </p>

            <ul>
              <li>📦 Track complete equipment lifecycle</li>
              <li>🛠 Manage corrective & preventive requests</li>
              <li>📊 Visualize work via Kanban & Calendar</li>
              <li>⚡ Reduce downtime intelligently</li>
            </ul>

            <p className="desc-footer">
              Built for teams. Designed for efficiency.
            </p>
          </div>
          </div>

          {/* RIGHT AUTH CARD */}
          <div className="auth-form-wrapper">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
