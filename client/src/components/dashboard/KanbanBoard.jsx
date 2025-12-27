import { useEffect, useState } from "react";
import { getKanban } from "../../api/requests.api";
import KanbanColumn from "./KanbanColumn";
import "./Kanban.css";

export default function KanbanBoard() {
  const [data, setData] = useState({
    NEW: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getKanban();
        setData(res);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Loading board…</p>;

  return (
    <div className="kanban-board">
      <KanbanColumn title="New" items={data.NEW} />
      <KanbanColumn title="In Progress" items={data.IN_PROGRESS} />
      <KanbanColumn title="Done" items={data.DONE} />
    </div>
  );
}
