import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listEquipment, createEquipment } from "../api/equipment.api";
import { getUser } from "../utils/auth";
import "./equipment.css";

const GROUP_OPTIONS = [
  { value: "", label: "No Group" },
  { value: "department", label: "Department" },
  { value: "employee", label: "Employee" },
  { value: "category", label: "Category" },
];

export default function EquipmentList() {
  const user = getUser();
  const isManager = user?.role === "MANAGER";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [groupBy, setGroupBy] = useState("");

  const [error, setError] = useState("");

  // create modal
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    serialNumber: "",
    category: "",
    department: "",
    assignedEmployeeName: "",
    location: "",
    purchaseDate: "",
    warrantyEndDate: "",
    maintenanceTeamId: 1, // adjust to your seeded team ids
    defaultTechnicianId: "", // optional
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listEquipment({ search, groupBy });
      setRows(data);
    } catch (e) {
      setError("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  const grouped = useMemo(() => {
    if (!groupBy) return { All: rows };
    const out = {};
    for (const r of rows) {
      const key = r.group_key || "Unassigned";
      if (!out[key]) out[key] = [];
      out[key].push(r);
    }
    return out;
  }, [rows, groupBy]);

  const onCreate = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: form.name,
        serialNumber: form.serialNumber,
        category: form.category,
        department: form.department || null,
        assignedEmployeeName: form.assignedEmployeeName || null,
        location: form.location,
        purchaseDate: form.purchaseDate || null,
        warrantyEndDate: form.warrantyEndDate || null,
        maintenanceTeamId: Number(form.maintenanceTeamId),
        defaultTechnicianId: form.defaultTechnicianId
          ? Number(form.defaultTechnicianId)
          : null,
      };

      await createEquipment(payload);
      setShowCreate(false);
      setForm({
        name: "",
        serialNumber: "",
        category: "",
        department: "",
        assignedEmployeeName: "",
        location: "",
        purchaseDate: "",
        warrantyEndDate: "",
        maintenanceTeamId: 1,
        defaultTechnicianId: "",
      });
      await load();
    } catch (e2) {
      setError("Create failed (check manager token / required fields)");
    }
  };

  return (
    <div className="equip-page">
      <div className="equip-header">
        <div>
          <h1>Equipment</h1>
          <p className="muted">Search, group, and open an equipment detail page.</p>
        </div>

        {isManager && (
          <button className="btn primary" onClick={() => setShowCreate(true)}>
            + New Equipment
          </button>
        )}
      </div>

      <div className="equip-toolbar">
        <input
          className="input"
          placeholder="Search name / serial / category / dept / employee / location…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn" onClick={load}>
          Search
        </button>

        <div className="spacer" />

        <select
          className="select"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          {GROUP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              Group: {o.label}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="muted">Loading…</div>
      ) : (
        Object.keys(grouped).map((g) => (
          <div key={g} className="equip-group">
            {groupBy && <h3 className="equip-group-title">{g}</h3>}

            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Serial</th>
                    <th>Category</th>
                    <th>Department</th>
                    <th>Employee</th>
                    <th>Location</th>
                    <th>Team</th>
                    <th>Default Tech</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {grouped[g].map((r) => (
                    <tr key={r.id}>
                      <td className="cell-strong">{r.name}</td>
                      <td>{r.serial_number}</td>
                      <td>{r.category}</td>
                      <td>{r.department || "-"}</td>
                      <td>{r.assigned_employee_name || "-"}</td>
                      <td>{r.location}</td>
                      <td>{r.maintenance_team_name}</td>
                      <td>{r.default_technician_name || "-"}</td>
                      <td>
                        {r.is_scrapped ? (
                          <span className="pill red">Scrapped</span>
                        ) : (
                          <span className="pill green">Active</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link className="link" to={`/equipment/${r.id}`}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {grouped[g].length === 0 && (
                    <tr>
                      <td colSpan={10} className="muted">
                        No equipment found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Create Equipment</h2>
              <button className="btn" onClick={() => setShowCreate(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={onCreate} className="grid2">
              <label className="field">
                <span>Name *</span>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </label>

              <label className="field">
                <span>Serial Number *</span>
                <input
                  className="input"
                  value={form.serialNumber}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, serialNumber: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Category *</span>
                <input
                  className="input"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Location *</span>
                <input
                  className="input"
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, location: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Department</span>
                <input
                  className="input"
                  value={form.department}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, department: e.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Assigned Employee</span>
                <input
                  className="input"
                  value={form.assignedEmployeeName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, assignedEmployeeName: e.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Purchase Date</span>
                <input
                  className="input"
                  type="date"
                  value={form.purchaseDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, purchaseDate: e.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Warranty End Date</span>
                <input
                  className="input"
                  type="date"
                  value={form.warrantyEndDate}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, warrantyEndDate: e.target.value }))
                  }
                />
              </label>

              <label className="field">
                <span>Maintenance Team Id *</span>
                <input
                  className="input"
                  type="number"
                  value={form.maintenanceTeamId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, maintenanceTeamId: e.target.value }))
                  }
                  required
                />
              </label>

              <label className="field">
                <span>Default Technician Id</span>
                <input
                  className="input"
                  type="number"
                  value={form.defaultTechnicianId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, defaultTechnicianId: e.target.value }))
                  }
                />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Create
                </button>
              </div>
            </form>

            <p className="muted" style={{ marginTop: 10 }}>
              Note: Team/Tech IDs should match your seeded DB IDs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}