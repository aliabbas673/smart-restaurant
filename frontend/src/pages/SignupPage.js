import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function SignupPage() {
  const [form, setForm] = useState({
    restaurantName: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    tables: 7
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!form.restaurantName || !form.email || !form.password || !form.phone) {
      setError("❌ Sab fields bharo!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth, form.email, form.password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "restaurants", uid), {
        restaurantName: form.restaurantName,
        address: form.address,
        phone: form.phone,
        email: form.email,
        tables: Number(form.tables),
        createdAt: new Date()
      });

      alert("✅ Restaurant register ho gaya!");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("❌ Email already registered hai!");
      } else {
        setError("❌ Error aaya — dobara try karo!");
      }
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
        maxWidth: "450px"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "8px" }}>🍽️ Smart Restaurant</h1>
        <p style={{ textAlign: "center", color: "#888", marginBottom: "24px" }}>
          Apna restaurant register karo
        </p>

        {error && (
          <p style={{ color: "red", background: "#ffe0e0", padding: "10px", borderRadius: "6px", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>Restaurant Name *</label>
            <input
              value={form.restaurantName}
              onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
              placeholder="e.g. Pizza House"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. Lahore, Punjab"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>Phone *</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="e.g. 0300-1234567"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="owner@restaurant.com"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>Password *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "14px", fontWeight: "600" }}>Number of Tables</label>
            <input
              type="number"
              value={form.tables}
              onChange={(e) => setForm({ ...form, tables: e.target.value })}
              min="1"
              max="50"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <button
          onClick={handleSignup}
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
            opacity: loading ? 0.7 : 1,
            marginTop: "20px"
          }}>
          {loading ? "Registering..." : "🚀 Register Restaurant"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#888" }}>
          Already registered?{" "}
          <a href="/login" style={{ color: "#2d6a4f", fontWeight: "600" }}>Login karo</a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;