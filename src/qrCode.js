import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // ✅ Correct for latest version


function QRCodeDisplay() {
  // const appUrl = "https://unioncomedy-2d46f.web.app/"; // Change this to your deployed URL
  const appUrl = "unioncomedy-2d46f.firebaseapp.com"

  return (
    <div>
      <h3>Scan to open the app:</h3>
      <QRCodeCanvas value={appUrl} size={256} />
    </div>
  );
}

export default QRCodeDisplay;
