import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import MenuPage from "./pages/MenuPage";
import AdminPanel from "./pages/AdminPanel";
import ManagerPanel from "./pages/ManagerPanel";
import QRPage from "./pages/QRPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "20px" }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      {user && (
        <div style={{ background: "#2d6a4f", color: "white", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "16px" }}>
            <a href="/manager" style={{ color: "white", textDecoration: "none" }}>🍳 Manager</a>
            <a href="/admin" style={{ color: "white", textDecoration: "none" }}>👨‍💼 Admin</a>
            <a href="/qr" style={{ color: "white", textDecoration: "none" }}>📱 QR Codes</a>
          </div>
          <button
            onClick={handleLogout}
            style={{ background: "white", color: "#2d6a4f", border: "none", padding: "6px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>
            Logout
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<MenuPage />} />
        <Route path="/login" element={!user ? <LoginPage onLogin={() => {}} /> : <Navigate to="/manager" />} />
        <Route path="/manager" element={user ? <ManagerPanel /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/login" />} />
        <Route path="/qr" element={user ? <QRPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;