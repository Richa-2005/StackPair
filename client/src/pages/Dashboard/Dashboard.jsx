import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/dashboard.api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard-grid">
      <StatCard label="Total Requests" value={stats.total} />
      <StatCard label="New" value={stats.new_count} />
      <StatCard label="In Progress" value={stats.in_progress_count} />
      <StatCard label="Done" value={stats.done_count} />
      <StatCard label="Overdue" value={stats.overdue_count} />
      <StatCard label="Avg Duration (hrs)" value={stats.avg_duration_hours} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <h4>{label}</h4>
      <h2>{value}</h2>
    </div>
  );
}
