export default function RequestCard({ data }) {
  return (
    <div className={`request-card priority-${data.priority?.toLowerCase()}`}>
      <h4 className="request-title">{data.title}</h4>

      <p className="request-equipment">
        🏭 {data.equipment_name}
      </p>

      {data.assigned_to_name && (
        <p className="request-assignee">
          👨‍🔧 {data.assigned_to_name}
        </p>
      )}

      <div className="request-footer">
        <span className="priority">{data.priority}</span>
      </div>
    </div>
  );
}
