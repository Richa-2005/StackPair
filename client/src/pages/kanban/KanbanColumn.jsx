import KanbanCard from "./KanbanCard";

export default function KanbanColumn({
  title,
  items,
  technicians,
  onMove,
  onAssign
}) {
  return (
    <div style={{ width: 320 }}>
      <h3>{title}</h3>

      {items.map(item => (
        <KanbanCard
          key={item.id}
          item={item}
          technicians={technicians}
          onMove={onMove}
          onAssign={onAssign}
        />
      ))}
    </div>
  );
}
