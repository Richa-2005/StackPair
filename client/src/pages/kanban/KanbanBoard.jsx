import KanbanColumn from "./KanbanColumn";

export default function KanbanBoard({ columns, technicians, onMove, onAssign }) {
  return (
    <div style={{ display: "flex", gap: 20 }}>
      {Object.keys(columns).map(status => (
        <KanbanColumn
          key={status}
          title={status}
          items={columns[status]}
          technicians={technicians}
          onMove={onMove}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}
