import { useEffect, useState } from "react";
import { getKanban, updateRequestStatus, assignRequest } from "../api/requests.api";
import KanbanBoard from "../components/kanban/KanbanBoard";
import useTechnicians from "../hooks/useTechnicians";

export default function Kanban() {
  const [columns, setColumns] = useState({
    NEW: [],
    IN_PROGRESS: [],
    DONE: []
  });

  const technicians = useTechnicians();

  useEffect(() => {
    loadKanban();
  }, []);

  const loadKanban = async () => {
    const res = await getKanban();
    setColumns(res.data.data);
  };

  const moveCard = async (id, from, to) => {
    setColumns(prev => {
      const card = prev[from].find(c => c.id === id);
      return {
        ...prev,
        [from]: prev[from].filter(c => c.id !== id),
        [to]: [...prev[to], { ...card, status: to }]
      };
    });

    await updateRequestStatus(id, { status: to });
  };

  const assignTechnician = async (id, techId) => {
    await assignRequest(id, Number(techId));
    loadKanban();
  };

  return (
    <KanbanBoard
      columns={columns}
      technicians={technicians}
      onMove={moveCard}
      onAssign={assignTechnician}
    />
  );
}
