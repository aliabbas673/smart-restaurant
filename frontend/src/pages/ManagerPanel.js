import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, query, where } from "firebase/firestore";

function ManagerPanel({ restaurantId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!restaurantId) return;
    const q = query(collection(db, "orders"), where("restaurantId", "==", restaurantId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allOrders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      allOrders.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setOrders(allOrders);
    });
    return () => unsubscribe();
  }, [restaurantId]);

  const updateStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
  };

  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order #${order.id.slice(-4)}</title>
          <style>
            body { font-family: Arial; padding: 20px; max-width: 400px; margin: 0 auto; }
            h2 { border-bottom: 2px solid black; padding-bottom: 8px; }
            .item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 18px; font-weight: bold; margin-top: 12px; text-align: right; }
            .kitchen { background: #fff3cd; padding: 16px; margin-bottom: 20px; border-radius: 8px; }
            .bill { background: #d4edda; padding: 16px; border-radius: 8px; }
            .header-info p { margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="kitchen">
            <h2>🍳 Kitchen Slip</h2>
            <div class="header-info">
              <p><b>Table No:</b> ${order.tableNo}</p>
              <p><b>Order ID:</b> #${order.id.slice(-4)}</p>
              <p><b>Time:</b> ${new Date().toLocaleTimeString()}</p>
              <p><b>Payment:</b> ${order.paymentMethod || "cash"}</p>
            </div>
            ${order.items.map((item) => `
              <div class="item">
                <span>${item.emoji} ${item.name}</span>
                <span>x${item.qty}</span>
              </div>
            `).join("")}
          </div>
          <div class="bill">
            <h2>🧾 Customer Bill</h2>
            <div class="header-info">
              <p><b>Table No:</b> ${order.tableNo}</p>
              <p><b>Order ID:</b> #${order.id.slice(-4)}</p>
              <p><b>Time:</b> ${new Date().toLocaleTimeString()}</p>
              <p><b>Payment:</b> ${order.paymentMethod || "cash"}</p>
            </div>
            ${order.items.map((item) => `
              <div class="item">
                <span>${item.emoji} ${item.name} x${item.qty}</span>
                <span>Rs. ${item.price * item.qty}</span>
              </div>
            `).join("")}
            <div class="total">Total: Rs. ${order.totalPrice}</div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const statusColor = {
    pending: "#fff3cd",
    preparing: "#cce5ff",
    ready: "#d4edda",
    served: "#e2e3e5",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "900px", margin: "0 auto" }}>
      <h1>🍳 Manager Panel</h1>
      <p style={{ color: "#888", marginBottom: "20px" }}>Live orders — automatically updating!</p>

      {orders.length === 0 ? (
        <p>No orders yet!</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ background: statusColor[order.status] || "#fff", border: "1px solid #ddd", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>Table {order.tableNo} — Order #{order.id.slice(-4)}</h3>
                <p style={{ color: "#888", fontSize: "13px" }}>
                  {order.createdAt?.toDate?.().toLocaleString?.() || "Just now"}
                </p>
                <p style={{ fontSize: "13px", color: "#555" }}>
                  Payment: {order.paymentMethod === "online" ? "📱 Online" : "💵 Cash"}
                </p>
              </div>
              <span style={{ background: "#333", color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", textTransform: "uppercase" }}>
                {order.status}
              </span>
            </div>
            <div style={{ margin: "12px 0" }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #eee" }}>
                  <span>{item.emoji} {item.name} x{item.qty}</span>
                  <span>Rs. {item.price * item.qty}</span>
                </div>
              ))}
              <p style={{ fontWeight: "bold", marginTop: "8px", textAlign: "right" }}>Total: Rs. {order.totalPrice}</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button onClick={() => updateStatus(order.id, "preparing")} style={{ background: "#007bff", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>👨‍🍳 Preparing</button>
              <button onClick={() => updateStatus(order.id, "ready")} style={{ background: "#28a745", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>✅ Ready</button>
              <button onClick={() => updateStatus(order.id, "served")} style={{ background: "#6c757d", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>🍽️ Served</button>
              <button onClick={() => handlePrint(order)} style={{ background: "#ff6b35", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}>🖨️ Print</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ManagerPanel;