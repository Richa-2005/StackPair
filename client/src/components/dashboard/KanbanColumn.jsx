import RequestCard from "./RequestCard";

export default function KanbanColumn({ title, items }) {
  return (
    <div className="kanban-column">
      <div className="kanban-column-header">
        <h3>{title}</h3>
        <span className="count">{items.length}</span>
      </div>

      <div className="kanban-column-body">
        {items.map((item) => (
          <RequestCard key={item.id} data={item} />
        ))}

        {items.length === 0 && (
          <p className="empty-text">No items</p>
        )}
      </div>
    </div>
  );
}
