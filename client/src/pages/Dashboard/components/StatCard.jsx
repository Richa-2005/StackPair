export default function StatCard({ label, value, tone = "blue" }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-value">{value ?? "-"}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}