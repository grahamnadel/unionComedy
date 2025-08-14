import React, { useState, useEffect} from "react";
import LocationCheck from "./LocationCheck";


function VotingPage({ onAllowed }) {
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Replace with your target location
        const targetLat = 43.914;
        const targetLon = -69.9653;
        const maxDistanceMeters = 500; // allowed radius

        const distance = getDistanceFromLatLonInMeters(
          latitude,
          longitude,
          targetLat,
          targetLon
        );

        if (distance <= maxDistanceMeters) {
          onAllowed();  // User allowed to vote
        } else {
          alert("You are too far from the voting location to vote.");
        }
      },
      (error) => {
        alert("Could not get your location. Please allow location access.");
      }
    );
  }, [onAllowed]);

  return (
    <div>
      <p>Please enable location and be near the voting site to vote.</p>
    </div>
  );
}

// Helper function to calculate distance between two coords
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in meters
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default VotingPage;
