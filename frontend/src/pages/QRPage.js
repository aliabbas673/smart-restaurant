import { QRCodeSVG } from "qrcode.react";

function QRPage({ restaurantId, tables }) {
  const baseUrl = "https://smart-restaurant-pk.netlify.app";
  const tableCount = tables || 7;

  const handlePrint = (tableNo) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Table ${tableNo} QR Code</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 40px; }
            h2 { font-size: 24px; margin-bottom: 8px; }
            p { color: #888; margin-bottom: 20px; }
            img { width: 200px; height: 200px; }
          </style>
        </head>
        <body>
          <h2>🍽️ Smart Restaurant</h2>
          <h3>Table ${tableNo}</h3>
          <p>Scan karo aur order karo!</p>
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${baseUrl}?restaurant=${restaurantId}&table=${tableNo}" />
          <p style="margin-top: 20px; font-size: 12px; color: #aaa;">
            ${baseUrl}?restaurant=${restaurantId}&table=${tableNo}
          </p>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "900px", margin: "0 auto" }}>
      <h1>📱 QR Code Generator</h1>
      <p style={{ color: "#888", marginBottom: "24px" }}>
        Har table ka alag QR Code — print karo aur table pe laga do!
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px"
      }}>
        {Array.from({ length: tableCount }, (_, i) => i + 1).map((tableNo) => (
          <div key={tableNo} style={{
            background: "white",
            border: "1px solid #eee",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ marginBottom: "12px" }}>Table {tableNo}</h3>
            <QRCodeSVG
              value={`${baseUrl}?restaurant=${restaurantId}&table=${tableNo}`}
              size={150}
              level="H"
            />
            <p style={{ fontSize: "12px", color: "#888", margin: "8px 0" }}>
              Scan to order
            </p>
            <button
              onClick={() => handlePrint(tableNo)}
              style={{
                background: "#2d6a4f",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                width: "100%",
                marginTop: "8px"
              }}>
              🖨️ Print QR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QRPage;