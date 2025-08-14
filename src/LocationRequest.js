import React, { useState } from "react";

function LocationRequest({ onAllowed, onDenied }) {
  const [status, setStatus] = useState(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
      onDenied();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus("Location access granted!");
        onAllowed(position.coords);
      },
      (error) => {
        setStatus("Location access denied or unavailable.");
        onDenied();
      }
    );
  };

  return (
    <div>
      <button onClick={requestLocation}>Enable Location Access</button>
      {status && <p>{status}</p>}
    </div>
  );
}

export default LocationRequest;
