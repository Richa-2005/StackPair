export default function TechnicianLoad({ rows }) {
  return (
    <div className="panel">
      <div className="panel-title">Technician Load (Active Requests)</div>

      {rows?.length ? (
        <div className="tech-list">
          {rows.map((t) => (
            <div key={t.id} className="tech-row">
              <div className="tech-name">{t.name}</div>
              <div className="tech-count">{t.activeCount}</div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ opacity: 0.7 }}>No technicians found.</p>
      )}
    </div>
  );
}