import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import MenuPage from "./pages/MenuPage";
import AdminPanel from "./pages/AdminPanel";
import ManagerPanel from "./pages/ManagerPanel";
import QRPage from "./pages/QRPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

function App() {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const restaurantDoc = await getDoc(doc(db, "restaurants", currentUser.uid));
        if (restaurantDoc.exists()) {
          setRestaurant({ id: currentUser.uid, ...restaurantDoc.data() });
        }
      } else {
        setRestaurant(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
    setRestaurant(null);
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
      {user && restaurant && (
        <div style={{ background: "#2d6a4f", color: "white", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <span style={{ fontWeight: "bold" }}>🍽️ {restaurant.restaurantName}</span>
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
        <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/manager" />} />
        <Route path="/login" element={!user ? <LoginPage onLogin={() => {}} /> : <Navigate to="/manager" />} />
        <Route path="/manager" element={user ? <ManagerPanel restaurantId={restaurant?.id} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user ? <AdminPanel restaurantId={restaurant?.id} /> : <Navigate to="/login" />} />
        <Route path="/qr" element={user ? <QRPage restaurantId={restaurant?.id} tables={restaurant?.tables || 7} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;