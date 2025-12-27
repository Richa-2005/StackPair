import AuthLayout from "../../layouts/AuthLayout";
import { useState } from "react";
import { login } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import "./Login.css";


  

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const { token, user } = await login(form);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/dashboard");
  } catch (err) {
    const msg = err?.response?.data?.error?.message || "Invalid email or password";
    setError(msg);
  } finally {
    setLoading(false);
  }
}

  return (
    <AuthLayout>
      <form className="login-card" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>

        {error && <p className="login-error">{error}</p>}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <button className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="login-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </form>
    </AuthLayout>
  );
}