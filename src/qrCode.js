import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Correct for latest version


function QRCodeDisplay() {
  const appUrl = "https://yourdomain.com"; // Change this to your deployed URL

  return (
    <div>
      <h3>Scan to open the app:</h3>
      <QRCodeCanvas value={appUrl} size={256} />
    </div>
  );
}

export default QRCodeDisplay;
