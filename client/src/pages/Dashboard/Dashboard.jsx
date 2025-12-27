import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

import { getDashboardStats } from "../../api/dashboard.api";
import { listRequests } from "../../api/requests.api";
import { getTechnicians } from "../../api/users.api";

import StatCard from "./components/StatCard";
import RecentRequestsTable from "./components/RecentRequestsTable";
import TechnicianLoad from "./components/TechnicianLoad";
import QuickActions from "./components/QuickActions";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]); // always array
  const [techs, setTechs] = useState([]);       // always array
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ always safe
  const recentRequests = useMemo(() => {
    return Array.isArray(requests) ? requests.slice(0, 5) : [];
  }, [requests]);

  // ✅ Technician load (client-side)
  const techLoad = useMemo(() => {
    const reqArr = Array.isArray(requests) ? requests : [];
    const techArr = Array.isArray(techs) ? techs : [];

    const active = reqArr.filter(
      (r) => r.status === "NEW" || r.status === "IN_PROGRESS"
    );

    const counts = new Map();
    for (const t of techArr) counts.set(t.id, 0);

    for (const r of active) {
      if (r.assigned_to_user_id && counts.has(r.assigned_to_user_id)) {
        counts.set(r.assigned_to_user_id, (counts.get(r.assigned_to_user_id) || 0) + 1);
      }
    }

    return techArr
      .map((t) => ({
        id: t.id,
        name: t.name,
        activeCount: counts.get(t.id) || 0,
      }))
      .sort((a, b) => b.activeCount - a.activeCount);
  }, [requests, techs]);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const [s, rRes, tRes] = await Promise.all([
          getDashboardStats(), // ✅ returns actual stats object (your code returns res.data.data)
          listRequests(),      // ❌ axios response
          getTechnicians(),    // ❌ axios response
        ]);

        if (!alive) return;

        // ✅ parse axios responses safely:
        const reqList = rRes?.data?.data;
        const techList = tRes?.data?.data;

        setStats(s);
        setRequests(Array.isArray(reqList) ? reqList : []);
        setTechs(Array.isArray(techList) ? techList : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.error?.message || "Failed to load dashboard");
        setStats(null);
        setRequests([]);
        setTechs([]);
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div className="dashboard-page">Loading...</div>;
  if (err) return <div className="dashboard-page">{err}</div>;
  if (!stats) return <div className="dashboard-page">Failed to load stats.</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Maintenance Dashboard</h1>
          <p className="dashboard-subtitle">Overview of requests and workload</p>
        </div>
        <QuickActions />
      </div>

      <div className="stats-grid">
        <StatCard label="Total Requests" value={stats.total} tone="blue" />
        <StatCard label="New" value={stats.new_count} tone="orange" />
        <StatCard label="In Progress" value={stats.in_progress_count} tone="blue" />
        <StatCard label="Done" value={stats.done_count} tone="green" />
        <StatCard label="Overdue" value={stats.overdue_count} tone="red" />
        <StatCard label="Avg Duration (hrs)" value={stats.avg_duration_hours} tone="green" />
      </div>

      <div className="dashboard-grid-2">
        <RecentRequestsTable rows={recentRequests} />
        <TechnicianLoad rows={techLoad} />
      </div>
    </div>
  );
}