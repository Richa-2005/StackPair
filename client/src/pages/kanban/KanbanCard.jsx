export default function KanbanCard({
  item,
  technicians,
  onMove,
  onAssign
}) {
  return (
    <div style={{
      background: "#fff",
      padding: 12,
      marginBottom: 12,
      borderRadius: 8
    }}>
      <h4>{item.title}</h4>
      <p>{item.equipment_name}</p>
      <p>Priority: {item.priority}</p>

      {/* ASSIGN TECHNICIAN DROPDOWN */}
      <select
        value={item.assigned_to_user_id || ""}
        onChange={(e) => onAssign(item.id, e.target.value)}
      >
        <option value="">Assign Technician</option>
        {technicians.map(t => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* STATUS MOVE BUTTONS */}
      <div style={{ marginTop: 8 }}>
        {item.status !== "NEW" && (
          <button onClick={() => onMove(item.id, item.status, "NEW")}>NEW</button>
        )}
        {item.status !== "IN_PROGRESS" && (
          <button onClick={() => onMove(item.id, item.status, "IN_PROGRESS")}>
            IN PROGRESS
          </button>
        )}
        {item.status !== "DONE" && (
          <button onClick={() => onMove(item.id, item.status, "DONE")}>
            DONE
          </button>
        )}
      </div>
    </div>
  );
}
