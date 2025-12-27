import KanbanCard from "./KanbanCard";
import "./KanbanColumn.css";
export default function KanbanColumn({ title, items, technicians, canAssign, onMove, onAssign }) {
  return (
    <div className="kanban-column">
      <h3>{title}</h3>
      {items.map((item) => (
        <KanbanCard
          key={item.id}
          item={item}
          technicians={technicians}
          canAssign={canAssign}
          onMove={onMove}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}