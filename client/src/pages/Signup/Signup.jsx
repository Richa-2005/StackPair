
import { useState } from "react";
import { signup } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import AuthLayout from "../../layouts/AuthLayout";


export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      navigate("/");
    }catch (err) {
        const msg = err?.response?.data?.error?.message || "Signup failed. Try again.";
        setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <form className="signup-card" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Join GearGuard today</p>

        {error && <p className="signup-error">{error}</p>}

        <div className="input-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        <button className="signup-btn" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="signup-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </form>
    </AuthLayout>
    
  );
}
