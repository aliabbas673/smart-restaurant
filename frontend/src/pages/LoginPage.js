import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("❌ Email aur password dono bharo!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError("❌ Email ya password galat hai!");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5",
      fontFamily: "Arial"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>🍽️ Smart Restaurant</h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "24px" }}>
          Admin / Manager Login
        </p>

        {error && (
          <p style={{ color: "red", background: "#ffe0e0", padding: "10px", borderRadius: "6px", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "14px", fontWeight: "600" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "6px", fontSize: "15px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontSize: "14px", fontWeight: "600" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "6px", fontSize: "15px", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: "#2d6a4f",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}>
          {loading ? "Logging in..." : "🔐 Login"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;