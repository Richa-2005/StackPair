import "./KanbanCard.css";

export default function KanbanCard({ item, technicians, onMove, onAssign }) {
  const p = (item.priority || "MEDIUM").toLowerCase(); // high/medium/low

  return (
    <div className="kanban-card">
      <h4 className="kanban-card-title">{item.title}</h4>

      <p className="kanban-meta">{item.equipment_name}</p>

      <div className={`priority-pill priority-${p}`}>
        Priority: {item.priority}
      </div>

      <select
        className="kanban-select"
        value={item.assigned_to_user_id || ""}
        onChange={(e) => onAssign(item.id, e.target.value)}
      >
        <option value="">Assign Technician</option>
        {technicians.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      <div className="kanban-actions">
        {item.status !== "NEW" && (
          <button className="kanban-btn" onClick={() => onMove(item.id, item.status, "NEW")}>
            NEW
          </button>
        )}
        {item.status !== "IN_PROGRESS" && (
          <button className="kanban-btn primary" onClick={() => onMove(item.id, item.status, "IN_PROGRESS")}>
            IN PROGRESS
          </button>
        )}
        {item.status !== "DONE" && (
          <button className="kanban-btn" onClick={() => onMove(item.id, item.status, "DONE")}>
            DONE
          </button>
        )}
      </div>
    </div>
  );
}