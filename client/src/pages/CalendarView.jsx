import { useEffect, useMemo, useState } from "react";
import { getCalendarRequests } from "../api/calendar.api";
import "./CalendarView.css";

function pad(n) {
  return String(n).padStart(2, "0");
}

function toYMD(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function startOfCalendarGrid(monthDate) {
  // start from Sunday
  const first = startOfMonth(monthDate);
  const day = first.getDay(); // 0=Sun
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - day);
  return gridStart;
}

function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export default function CalendarView() {
  const [month, setMonth] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(null);

  const from = useMemo(() => toYMD(startOfMonth(month)), [month]);
  const to = useMemo(() => toYMD(endOfMonth(month)), [month]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");

    getCalendarRequests({ from, to })
      .then((data) => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!mounted) return;
        setErr(e?.response?.data?.error?.message || "Failed to load calendar");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [from, to]);

  // Group by scheduled date
  const byDate = useMemo(() => {
    const map = new Map();
    for (const r of items) {
      // handle possible backend field names
      const dateStr =
        r.scheduled_date ||
        r.scheduledDate ||
        r.date ||
        null;

      if (!dateStr) continue;

      // sometimes ISO date-time might come, keep just YYYY-MM-DD
      const key = String(dateStr).slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }

    // sort each day's items a bit
    for (const [k, arr] of map.entries()) {
      arr.sort((a, b) => (a.priority || "").localeCompare(b.priority || ""));
      map.set(k, arr);
    }

    return map;
  }, [items]);

  const gridStart = useMemo(() => startOfCalendarGrid(month), [month]);
  const gridDays = useMemo(() => {
    // 6 weeks = 42 cells
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [gridStart]);

  const monthLabel = useMemo(() => {
    return month.toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [month]);

  const goPrev = () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const goNext = () => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  const goToday = () => setMonth(new Date());

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Calendar</h1>

        <div className="calendar-controls">
          <button className="btn" onClick={goPrev}>◀</button>
          <button className="btn" onClick={goToday}>Today</button>
          <button className="btn" onClick={goNext}>▶</button>
        </div>
      </div>

      <div className="calendar-subtitle">
        <span className="month-pill">{monthLabel}</span>
        <span className="range">Showing scheduled requests: {from} → {to}</span>
      </div>

      {loading && <div className="calendar-info">Loading…</div>}
      {!loading && err && <div className="calendar-error">{err}</div>}

      {!loading && !err && (
        <>
          <div className="calendar-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="weekday">{d}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {gridDays.map((d) => {
              const key = toYMD(d);
              const dayItems = byDate.get(key) || [];
              const isCurrentMonth = d.getMonth() === month.getMonth();
              const isToday = toYMD(d) === toYMD(new Date());

              return (
                <div
                  key={key}
                  className={[
                    "day-cell",
                    isCurrentMonth ? "" : "muted",
                    isToday ? "today" : "",
                  ].join(" ")}
                >
                  <div className="day-top">
                    <span className="day-num">{d.getDate()}</span>
                    {dayItems.length > 0 && (
                      <span className="count-badge">{dayItems.length}</span>
                    )}
                  </div>

                  <div className="day-items">
                    {dayItems.slice(0, 3).map((r) => (
                      <button
                        key={r.id}
                        className={`event-pill ${String(r.priority || "").toLowerCase()}`}
                        onClick={() => setSelected(r)}
                        title={r.title || r.subject}
                      >
                        <span className="event-title">
                          {r.title || r.subject || "Request"}
                        </span>
                        <span className="event-sub">
                          {r.equipment_name || r.equipmentName || "Equipment"}
                        </span>
                      </button>
                    ))}

                    {dayItems.length > 3 && (
                      <div className="more-text">+{dayItems.length - 3} more…</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Simple Modal */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{selected.title || selected.subject || "Request"}</h3>
              <button className="btn" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="kv">
                <div className="k">Equipment</div>
                <div className="v">{selected.equipment_name || selected.equipmentName || "-"}</div>
              </div>

              <div className="kv">
                <div className="k">Scheduled Date</div>
                <div className="v">{String(selected.scheduled_date || "").slice(0, 10) || "-"}</div>
              </div>

              <div className="kv">
                <div className="k">Status</div>
                <div className="v">{selected.status || "-"}</div>
              </div>

              <div className="kv">
                <div className="k">Priority</div>
                <div className="v">{selected.priority || "-"}</div>
              </div>

              <div className="kv">
                <div className="k">Assigned To</div>
                <div className="v">{selected.assigned_to_name || selected.assignedToName || "-"}</div>
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn primary" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}