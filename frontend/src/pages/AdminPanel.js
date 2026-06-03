import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where
} from "firebase/firestore";

const CLOUD_NAME = "db9csfo1w";
const UPLOAD_PRESET = "restaurant_uploads";

function AdminPanel({ restaurantId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", category: "Starters", emoji: "", available: true, imageUrl: ""
  });

  const categories = ["Starters", "Main Course", "Fast Food", "Desi Food", "BBQ", "Drinks", "Desserts"];

  const fetchItems = async () => {
    const q = query(collection(db, "menu_items"), where("restaurantId", "==", restaurantId));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { if (restaurantId) fetchItems(); }, [restaurantId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, imageUrl: data.secure_url }));
      alert("✅ Image uploaded!");
    } catch (err) {
      alert("❌ Image upload failed!");
    }
    setImageUploading(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.emoji) {
      alert("❌ Name, price and emoji are required!");
      return;
    }
    if (editItem) {
      await updateDoc(doc(db, "menu_items", editItem.id), {
        ...form, price: Number(form.price), restaurantId
      });
      alert("✅ Item updated!");
    } else {
      await addDoc(collection(db, "menu_items"), {
        ...form, price: Number(form.price), restaurantId
      });
      alert("✅ New item added!");
    }
    setForm({ name: "", description: "", price: "", category: "Starters", emoji: "", available: true, imageUrl: "" });
    setEditItem(null);
    setShowForm(false);
    fetchItems();
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
      price: item.price,
      category: item.category,
      emoji: item.emoji,
      available: item.available,
      imageUrl: item.imageUrl || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteDoc(doc(db, "menu_items", id));
      fetchItems();
    }
  };

  const toggleAvailable = async (item) => {
    await updateDoc(doc(db, "menu_items", item.id), {
      available: !item.available
    });
    fetchItems();
  };

  if (loading) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>👨‍💼 Admin Panel</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditItem(null); setForm({ name: "", description: "", price: "", category: "Starters", emoji: "", available: true, imageUrl: "" }); }}
          style={{ background: "#2d6a4f", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "15px" }}>
          {showForm ? "✕ Cancel" : "+ Add New Item"}
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#f9f9f9", border: "1px solid #ddd", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
          <h3 style={{ marginBottom: "16px" }}>{editItem ? "✏️ Edit Item" : "➕ Add New Item"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Item Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Chicken Burger" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Price (Rs.) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 450" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Emoji *</label>
              <input value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} placeholder="e.g. 🍔" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }}>
                {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Crispy chicken burger with sauce" style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: "14px", fontWeight: "600" }}>Item Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ddd", marginTop: "4px", boxSizing: "border-box" }} />
              {imageUploading && <p style={{ color: "#888", fontSize: "13px" }}>⏳ Uploading image...</p>}
              {form.imageUrl && (<img src={form.imageUrl} alt="preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", marginTop: "8px" }} />)}
            </div>
          </div>
          <button onClick={handleSubmit} style={{ marginTop: "16px", background: "#2d6a4f", color: "white", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "15px" }}>
            {editItem ? "✅ Update Item" : "✅ Add Item"}
          </button>
        </div>
      )}

      <h3 style={{ marginBottom: "12px" }}>📋 All Menu Items ({items.length})</h3>
      {items.length === 0 ? (
        <p style={{ color: "#888" }}>No items yet — add your first item!</p>
      ) : (
        categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: "24px" }}>
              <h4 style={{ background: "#f0f0f0", padding: "8px 12px", borderRadius: "6px", marginBottom: "8px" }}>{cat}</h4>
              {catItems.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", border: "1px solid #eee", borderRadius: "8px", marginBottom: "8px", background: item.available ? "white" : "#f8f8f8", opacity: item.available ? 1 : 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {item.imageUrl ? (<img src={item.imageUrl} alt={item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px" }} />) : (<span style={{ fontSize: "32px" }}>{item.emoji}</span>)}
                    <div>
                      <p style={{ fontWeight: "600", margin: 0 }}>{item.name}</p>
                      <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>{item.description}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: "700", color: "#2d6a4f" }}>Rs. {item.price}</span>
                    <button onClick={() => toggleAvailable(item)} style={{ background: item.available ? "#28a745" : "#dc3545", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>{item.available ? "Available" : "Unavailable"}</button>
                    <button onClick={() => handleEdit(item)} style={{ background: "#007bff", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ background: "#dc3545", color: "white", border: "none", padding: "4px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>🗑️ Delete</button>
                  </div>
                </div>
              ))}
            </div>
          );
        })
      )}
    </div>
  );
}

export default AdminPanel;