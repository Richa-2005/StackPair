export default function RecentRequestsTable({ rows }) {
  return (
    <div className="panel">
      <div className="panel-title">Recent Requests</div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Equipment</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {rows?.length ? (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.subject || r.title}</td>
                  <td>{r.equipment_name}</td>
                  <td>{r.status}</td>
                  <td>{r.assigned_to_name || "-"}</td>
                  <td>{r.priority}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ opacity: 0.7 }}>
                  No requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}