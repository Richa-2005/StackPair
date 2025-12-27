import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEquipment, getEquipmentRequests, updateEquipment } from "../api/equipment.api";
import { getUser } from "../utils/auth";
import "./equipment.css";

export default function EquipmentDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const user = getUser();
  const isManager = user?.role === "MANAGER";

  const [item, setItem] = useState(null);
  const [reqs, setReqs] = useState([]);
  const [openCount, setOpenCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [edit, setEdit] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const eq = await getEquipment(id);
      const r = await getEquipmentRequests(id);
      setItem(eq);
      setEdit({
        name: eq.name,
        serialNumber: eq.serial_number,
        category: eq.category,
        department: eq.department || "",
        assignedEmployeeName: eq.assigned_employee_name || "",
        location: eq.location,
        purchaseDate: eq.purchase_date ? String(eq.purchase_date).slice(0, 10) : "",
        warrantyEndDate: eq.warranty_end_date ? String(eq.warranty_end_date).slice(0, 10) : "",
        maintenanceTeamId: eq.maintenance_team_id,
        defaultTechnicianId: eq.default_technician_id || "",
        isScrapped: !!eq.is_scrapped,
      });

      setReqs(r.rows || []);
      setOpenCount(r.openCount || 0);
    } catch (e) {
      setError("Failed to load equipment detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateEquipment(id, {
        name: edit.name,
        serialNumber: edit.serialNumber,
        category: edit.category,
        department: edit.department || null,
        assignedEmployeeName: edit.assignedEmployeeName || null,
        location: edit.location,
        purchaseDate: edit.purchaseDate || null,
        warrantyEndDate: edit.warrantyEndDate || null,
        maintenanceTeamId: Number(edit.maintenanceTeamId),
        defaultTechnicianId: edit.defaultTechnicianId ? Number(edit.defaultTechnicianId) : null,
        isScrapped: !!edit.isScrapped,
      });
      await load();
    } catch (e) {
      setError("Save failed (manager only / invalid values)");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="muted">Loading…</div>;
  if (!item) return <div className="error">Not found</div>;

  return (
    <div className="equip-page">
      <div className="equip-header">
        <div>
          <h1>{item.name}</h1>
          <p className="muted">
            Serial: <b>{item.serial_number}</b> • Open Requests: <b>{openCount}</b>
          </p>
        </div>

        <div className="row">
          <button className="btn" onClick={() => nav("/equipment")}>
            ← Back
          </button>
          {isManager && (
            <button className="btn primary" onClick={onSave} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="detail-grid">
        <div className="card">
          <h3>Equipment Info</h3>

          <div className="kv">
            <div><span>Name</span><b>{item.name}</b></div>
            <div><span>Serial</span><b>{item.serial_number}</b></div>
            <div><span>Category</span><b>{item.category}</b></div>
            <div><span>Location</span><b>{item.location}</b></div>
            <div><span>Department</span><b>{item.department || "-"}</b></div>
            <div><span>Employee</span><b>{item.assigned_employee_name || "-"}</b></div>
            <div><span>Team</span><b>{item.maintenance_team_name}</b></div>
            <div><span>Default Tech</span><b>{item.default_technician_name || "-"}</b></div>
          </div>
        </div>

        <div className="card">
          <h3>Requests for this equipment</h3>

          {reqs.length === 0 ? (
            <div className="muted">No requests found.</div>
          ) : (
            <div className="req-list">
              {reqs.map((r) => (
                <div key={r.id} className="req-row">
                  <div>
                    <div className="cell-strong">{r.subject || r.title}</div>
                    <div className="muted">
                      {r.request_type} • Priority: {r.priority} • Status: {r.status}
                    </div>
                  </div>
                  <div className="muted" style={{ textAlign: "right" }}>
                    Assigned: {r.assigned_to_name || "-"}
                    <br />
                    Created: {r.created_by_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manager editor */}
      {isManager && edit && (
        <div className="card" style={{ marginTop: 18 }}>
          <h3>Edit (Manager)</h3>

          <div className="grid2">
            <label className="field">
              <span>Name</span>
              <input className="input" value={edit.name}
                onChange={(e) => setEdit((p) => ({ ...p, name: e.target.value }))} />
            </label>

            <label className="field">
              <span>Serial Number</span>
              <input className="input" value={edit.serialNumber}
                onChange={(e) => setEdit((p) => ({ ...p, serialNumber: e.target.value }))} />
            </label>

            <label className="field">
              <span>Category</span>
              <input className="input" value={edit.category}
                onChange={(e) => setEdit((p) => ({ ...p, category: e.target.value }))} />
            </label>

            <label className="field">
              <span>Location</span>
              <input className="input" value={edit.location}
                onChange={(e) => setEdit((p) => ({ ...p, location: e.target.value }))} />
            </label>

            <label className="field">
              <span>Department</span>
              <input className="input" value={edit.department}
                onChange={(e) => setEdit((p) => ({ ...p, department: e.target.value }))} />
            </label>

            <label className="field">
              <span>Assigned Employee</span>
              <input className="input" value={edit.assignedEmployeeName}
                onChange={(e) => setEdit((p) => ({ ...p, assignedEmployeeName: e.target.value }))} />
            </label>

            <label className="field">
              <span>Purchase Date</span>
              <input className="input" type="date" value={edit.purchaseDate}
                onChange={(e) => setEdit((p) => ({ ...p, purchaseDate: e.target.value }))} />
            </label>

            <label className="field">
              <span>Warranty End Date</span>
              <input className="input" type="date" value={edit.warrantyEndDate}
                onChange={(e) => setEdit((p) => ({ ...p, warrantyEndDate: e.target.value }))} />
            </label>

            <label className="field">
              <span>Maintenance Team Id</span>
              <input className="input" type="number" value={edit.maintenanceTeamId}
                onChange={(e) => setEdit((p) => ({ ...p, maintenanceTeamId: e.target.value }))} />
            </label>

            <label className="field">
              <span>Default Technician Id</span>
              <input className="input" type="number" value={edit.defaultTechnicianId}
                onChange={(e) => setEdit((p) => ({ ...p, defaultTechnicianId: e.target.value }))} />
            </label>

            <label className="field checkbox">
              <input type="checkbox" checked={edit.isScrapped}
                onChange={(e) => setEdit((p) => ({ ...p, isScrapped: e.target.checked }))} />
              <span>Mark as scrapped</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}