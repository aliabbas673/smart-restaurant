import { useState } from "react";
import "./App.css";

const menuData = {
  Starters: [
    { id: 1, name: "Chicken Soup", price: 250, emoji: "🍲" },
    { id: 2, name: "Spring Rolls", price: 200, emoji: "🥟" },
    { id: 3, name: "Garlic Bread", price: 150, emoji: "🍞" },
    { id: 4, name: "Chicken Wings", price: 350, emoji: "🍗" },
    { id: 5, name: "French Onion Soup", price: 280, emoji: "🧅" },
  ],
  "Main Course": [
    { id: 6, name: "Grilled Chicken", price: 850, emoji: "🍗" },
    { id: 7, name: "Beef Steak", price: 1200, emoji: "🥩" },
    { id: 8, name: "Pasta Alfredo", price: 650, emoji: "🍝" },
    { id: 9, name: "Fish & Chips", price: 750, emoji: "🐟" },
    { id: 10, name: "Chicken Cordon Bleu", price: 950, emoji: "🍽️" },
  ],
  "Fast Food": [
    { id: 11, name: "Zinger Burger", price: 450, emoji: "🍔" },
    { id: 12, name: "Pizza Margherita", price: 650, emoji: "🍕" },
    { id: 13, name: "Crispy Fries", price: 200, emoji: "🍟" },
    { id: 14, name: "Shawarma", price: 400, emoji: "🌯" },
    { id: 15, name: "Hot Dog", price: 300, emoji: "🌭" },
  ],
  "Desi Food": [
    { id: 16, name: "Chicken Biryani", price: 450, emoji: "🍛" },
    { id: 17, name: "Mutton Karahi", price: 1200, emoji: "🫕" },
    { id: 18, name: "Daal Makhani", price: 350, emoji: "🍚" },
    { id: 19, name: "Nihari", price: 500, emoji: "🥘" },
    { id: 20, name: "Chicken Handi", price: 750, emoji: "🍲" },
    { id: 21, name: "Seekh Kabab", price: 550, emoji: "🍢" },
  ],
  BBQ: [
    { id: 22, name: "BBQ Platter", price: 1500, emoji: "🔥" },
    { id: 23, name: "Chicken Tikka", price: 800, emoji: "🍖" },
    { id: 24, name: "Mutton Boti", price: 950, emoji: "🥓" },
    { id: 25, name: "Reshmi Kabab", price: 700, emoji: "🍢" },
  ],
  Drinks: [
    { id: 26, name: "Cola", price: 100, emoji: "🥤" },
    { id: 27, name: "Fresh Juice", price: 200, emoji: "🧃" },
    { id: 28, name: "Lassi", price: 150, emoji: "🥛" },
    { id: 29, name: "Green Tea", price: 120, emoji: "🍵" },
    { id: 30, name: "Mocktail", price: 280, emoji: "🍹" },
  ],
  Desserts: [
    { id: 31, name: "Gulab Jamun", price: 150, emoji: "🍮" },
    { id: 32, name: "Ice Cream", price: 200, emoji: "🍨" },
    { id: 33, name: "Kheer", price: 180, emoji: "🍧" },
    { id: 34, name: "Brownie", price: 250, emoji: "🍫" },
    { id: 35, name: "Fruit Trifle", price: 220, emoji: "🍓" },
  ],
};

function App() {
  const [cart, setCart] = useState([]);
  const [tableNo, setTableNo] = useState(1);
  const [activeCategory, setActiveCategory] = useState("Starters");
  const [cartOpen, setCartOpen] = useState(false);

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

  const placeOrder = () => {
    if (cart.length === 0) {
      alert("❌ Cart khali hai!");
      return;
    }
    alert(`✅ Order place ho gaya! Table ${tableNo}\nTotal: Rs. ${totalPrice}`);
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div className="app">

      {/* Header */}
      <div className="header">
        <div>
          <h1>🍽️ Smart Restaurant</h1>
          <select
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            style={{
              marginTop: "6px",
              padding: "4px 10px",
              borderRadius: "12px",
              border: "none",
              fontSize: "14px",
              cursor: "pointer"
            }}>
            {[1, 2, 3, 4, 5, 6, 7].map((t) => (
              <option key={t} value={t}>Table {t}</option>
            ))}
          </select>
        </div>
        <button className="cart-btn" onClick={() => setCartOpen(!cartOpen)}>
          🛒 Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="categories">
        {Object.keys(menuData).map((cat) => (
          <button
            key={cat}
            className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu-grid">
        {menuData[activeCategory].map((item) => {
          const inCart = cart.find((c) => c.id === item.id);
          return (
            <div key={item.id} className={`item-card ${inCart ? "in-cart" : ""}`}>
              <div className="item-emoji">{item.emoji}</div>
              <h3>{item.name}</h3>
              <p className="price">Rs. {item.price}</p>
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
          );
        })}
      </div>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="cart-sidebar">
          <h2>🛒 Your Order</h2>
          <p style={{ color: "gray", fontSize: "13px" }}>Table {tableNo}</p>
          {cart.length === 0 ? (
            <p>Cart khali hai!</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <span>{item.emoji} {item.name}</span>
                  <span>x{item.qty}</span>
                  <span>Rs. {item.price * item.qty}</span>
                  <button onClick={() => removeFromCart(item.id)}>❌</button>
                </div>
              ))}
              <hr />
              <h3>Total: Rs. {totalPrice}</h3>
              <button className="order-btn" onClick={placeOrder}>
                ✅ Place Order
              </button>
            </>
          )}
          <button className="close-btn" onClick={() => setCartOpen(false)}>
            Close
          </button>
        </div>
      )}

    </div>
  );
}

export default App;