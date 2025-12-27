import KanbanColumn from "./KanbanColumn";
import "./KanbanBoard.css"

export default function KanbanBoard({ columns, technicians, canAssign, onMove, onAssign }) {
  return (
    <div className="kanban-board">
      {Object.keys(columns).map((status) => (
        <KanbanColumn
          key={status}
          title={status}
          items={columns[status]}
          technicians={technicians}
          canAssign={canAssign}
          onMove={onMove}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}