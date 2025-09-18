import React from "react";
import { QRCodeCanvas } from "qrcode.react";

function QRCodeDisplay() {
  // Always use HTTPS URL for mobile
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

  // If you’re testing on your phone, make sure REACT_APP_DEV_URL is the ngrok URL
  const appUrl = isDev
    ? process.env.REACT_APP_DEV_URL || "https://3117ce872c32.ngrok-free.app" // your ngrok URL
    : "https://unioncomedy-2d46f.web.app"; // deployed Firebase app

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Scan to open the app:</h3>
      <QRCodeCanvas value={appUrl} size={256} />
      <p style={{ marginTop: "1rem" }}>
        {isDev
          ? "Currently showing development server (ngrok)"
          : "Currently showing deployed production app"}
      </p>
    </div>
  );
}

export default QRCodeDisplay;
