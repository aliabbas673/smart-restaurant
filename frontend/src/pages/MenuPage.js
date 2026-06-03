import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "../App.css";

function MenuPage() {
  const [menuData, setMenuData] = useState({});
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [tableNo] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("table") || 1;
  });

  useEffect(() => {
    const fetchMenu = async () => {
      const snapshot = await getDocs(collection(db, "menu_items"));
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const organized = { All: items };
      items.forEach((item) => {
        if (!organized[item.category]) organized[item.category] = [];
        organized[item.category].push(item);
      });
      setMenuData(organized);
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const exists = cart.find((c) => c.id === item.id);
    if (exists) {
      setCart(cart.map((c) =>
        c.id === item.id ? { ...c, qty: c.qty + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((c) => c.id !== itemId));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const placeOrder = async (payment) => {
    if (cart.length === 0) {
      alert("❌ Cart khali hai!");
      return;
    }
    try {
      await addDoc(collection(db, "orders"), {
        tableNo: tableNo,
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
          emoji: item.emoji,
        })),
        totalPrice: totalPrice,
        status: "pending",
        paymentMethod: payment,
        paymentStatus: "pending",
        createdAt: new Date(),
      });
      setOrderPlaced(true);
      setCart([]);
      setCartOpen(false);
      setShowPayment(false);
    } catch (error) {
      alert("❌ Order place nahi hua — dobara try karo!");
    }
  };

  const filteredItems = menuData[activeCategory]
    ? menuData[activeCategory].filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "20px"
      }}>
        🍽️ Menu load ho raha hai...
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h1>Order Placed!</h1>
          <p>Table {tableNo} ka order kitchen ko mil gaya!</p>
          <p className="success-sub">Approximate time: 20-30 minutes</p>
          <button onClick={() => setOrderPlaced(false)} className="back-btn">
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">

      <div className="header">
        <div className="header-left">
          <h1>🍽️ Smart Restaurant</h1>
          <p>Welcome! Please place your order</p>
        </div>
        <div className="header-right">
          <span style={{
            background: "white",
            color: "#2d6a4f",
            padding: "6px 14px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "14px"
          }}>
            🪑 Table {tableNo}
          </span>
          <button className="cart-btn" onClick={() => { setCartOpen(!cartOpen); setShowPayment(false); }}>
            🛒 {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            Cart
          </button>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search for food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="categories">
        {Object.keys(menuData).map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => { setActiveCategory(cat); setSearch(""); }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="items-count">
        <p>{filteredItems.length} items</p>
      </div>

      <div className="menu-grid">
        {filteredItems.length === 0 ? (
          <div className="no-results">
            <p>😕 No items found!</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const inCart = cart.find((c) => c.id === item.id);
            return (
              <div key={item.id} className={`item-card ${inCart ? "in-cart" : ""}`}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                ) : (
                  <div className="item-emoji">{item.emoji}</div>
                )}
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="item-desc">{item.description}</p>
                  <div className="item-bottom">
                    <span className="price">Rs. {item.price}</span>
                    {inCart ? (
                      <div className="qty-control">
                        <button onClick={() => {
                          if (inCart.qty === 1) removeFromCart(item.id);
                          else setCart(cart.map((c) =>
                            c.id === item.id ? { ...c, qty: c.qty - 1 } : c
                          ));
                        }}>−</button>
                        <span>{inCart.qty}</span>
                        <button onClick={() => addToCart(item)}>+</button>
                      </div>
                    ) : (
                      <button className="add-btn" onClick={() => addToCart(item)}>
                        + Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {cartOpen && (
        <>
          <div className="overlay" onClick={() => { setCartOpen(false); setShowPayment(false); }} />
          <div className="cart-sidebar">
            <div className="cart-header">
              <h2>🛒 Your Order</h2>
              <p>Table {tableNo}</p>
              <button className="close-btn" onClick={() => { setCartOpen(false); setShowPayment(false); }}>✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>🛒 Cart khali hai!</p>
                <p>Kuch add karo menu se</p>
              </div>
            ) : (
              <div className="cart-body">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <span className="cart-emoji">{item.emoji}</span>
                    <div className="cart-item-info">
                      <p>{item.name}</p>
                      <span>Rs. {item.price * item.qty}</span>
                    </div>
                    <div className="cart-qty">
                      <button onClick={() => {
                        if (item.qty === 1) removeFromCart(item.id);
                        else setCart(cart.map((c) =>
                          c.id === item.id ? { ...c, qty: c.qty - 1 } : c
                        ));
                      }}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => addToCart(item)}>+</button>
                    </div>
                  </div>
                ))}
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <span>Rs. {totalPrice}</span>
                  </div>

                  {!showPayment ? (
                    <button
                      className="order-btn"
                      onClick={() => setShowPayment(true)}>
                      ✅ Place Order
                    </button>
                  ) : (
                    <div>
                      <p style={{ fontWeight: "600", marginBottom: "10px", fontSize: "15px" }}>
                        💳 Payment Method Choose Karo:
                      </p>
                      <button
                        onClick={() => placeOrder("cash")}
                        style={{
                          width: "100%",
                          background: "#2d6a4f",
                          color: "white",
                          border: "none",
                          padding: "12px",
                          borderRadius: "8px",
                          fontSize: "15px",
                          fontWeight: "600",
                          cursor: "pointer",
                          marginBottom: "8px"
                        }}>
                        💵 Cash Payment
                      </button>
                      <button
                        onClick={() => placeOrder("online")}
                        style={{
                          width: "100%",
                          background: "#0070f3",
                          color: "white",
                          border: "none",
                          padding: "12px",
                          borderRadius: "8px",
                          fontSize: "15px",
                          fontWeight: "600",
                          cursor: "pointer",
                          marginBottom: "8px"
                        }}>
                        📱 Online (JazzCash/EasyPaisa)
                      </button>
                      <button
                        onClick={() => setShowPayment(false)}
                        style={{
                          width: "100%",
                          background: "#eee",
                          color: "#333",
                          border: "none",
                          padding: "10px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          cursor: "pointer"
                        }}>
                        ← Back
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
}

export default MenuPage;