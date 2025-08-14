import React, { useState, useEffect } from "react";

const RADIUS_METERS = 1000000; // allowed radius

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function LocationCheck({ targetLat, targetLng, onAllowed, onDenied }) {
  const [status, setStatus] = useState("Checking location...");
  const [loading, setLoading] = useState(true);

  const requestLocation = () => {
    setLoading(true);
    setStatus("Checking location...");

    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
      setLoading(false);
      onDenied && onDenied();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got position:", position.coords.latitude, position.coords.longitude);
        const distance = getDistanceFromLatLonInMeters(
          position.coords.latitude,
          position.coords.longitude,
          targetLat,
          targetLng
        );

        if (distance <= RADIUS_METERS) {
          setStatus("You are within the voting area.");
          onAllowed && onAllowed();
        } else {
          setStatus("You are too far from the voting location to vote.");
          onDenied && onDenied();
        }
        setLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === 1) {
          setStatus(
            <>
              Location access denied. Please enable location permissions in your browser.
              <br />
              <button onClick={requestLocation} style={{ marginTop: "1rem" }}>
                Retry Location Request
              </button>
            </>
          );
        } else if (error.code === 2) {
          setStatus("Position unavailable. Please try again.");
        } else if (error.code === 3) {
          setStatus("Location request timed out. Please try again.");
        } else {
          setStatus("Could not get your location. Please allow location access.");
        }

        setLoading(false);
        onDenied && onDenied();
      }
    );
  };

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLat, targetLng]);

  return <div>{loading ? <p>Checking location...</p> : <p>{status}</p>}</div>;
}

export default LocationCheck;
