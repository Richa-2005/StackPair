import { useEffect, useState } from "react";
import { getKanban, updateRequestStatus, assignRequest } from "../api/requests.api";
import KanbanBoard from "../pages/kanban/KanbanBoard";
import useTechnicians from "../hooks/useTechnicians";
import { getUser } from "../utils/auth";

import "../pages/kanban/Kanban.css";

const EMPTY = { NEW: [], IN_PROGRESS: [], DONE: [] };

export default function Kanban() {
  const [columns, setColumns] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const user = getUser();
  const technicians = useTechnicians();

  const loadKanban = async () => {
    setErr("");
    try {
      const grouped = await getKanban(); // already {NEW, IN_PROGRESS, DONE}
      setColumns(grouped || EMPTY);
    }catch (e) {
      console.log("KANBAN ERROR:", e?.response?.status, e?.response?.data);
      setErr(e?.response?.data?.error?.message || "Failed to load kanban");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKanban();
  }, []);

  const moveCard = async (id, from, to) => {
    setErr("");

    // DONE requires durationHours
    let payload = { status: to };
    if (to === "DONE") {
      const input = prompt("Enter duration hours (example: 2.5)");
      const dur = Number(input);
      if (!Number.isFinite(dur) || dur <= 0) {
        setErr("Duration hours required to mark DONE.");
        return;
      }
      payload.durationHours = dur;
    }

    // optimistic UI
    const prev = columns;
    setColumns((p) => {
      const card = p[from].find((c) => c.id === id);
      if (!card) return p;
      return {
        ...p,
        [from]: p[from].filter((c) => c.id !== id),
        [to]: [{ ...card, status: to }, ...p[to]],
      };
    });

    try {
      await updateRequestStatus(id, payload);
      await loadKanban(); // keep server as source of truth
    } catch (e) {
      setColumns(prev); // rollback
      setErr(e?.response?.data?.error?.message || "Status update failed");
    }
  };

  const assignTechnician = async (id, techId) => {
    setErr("");
    if (user?.role !== "MANAGER") {
      setErr("Only MANAGER can assign technicians.");
      return;
    }

    try {
      await assignRequest(id, Number(techId));
      await loadKanban();
    } catch (e) {
      setErr(e?.response?.data?.error?.message || "Assign failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="kanban-page">
      <h1 className="kanban-title">Kanban</h1>
      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

      <KanbanBoard
        columns={columns}
        technicians={technicians}
        canAssign={user?.role === "MANAGER"}
        onMove={moveCard}
        onAssign={assignTechnician}
      />
    </div>
  );
}