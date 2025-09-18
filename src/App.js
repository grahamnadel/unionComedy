import React, { useState, useEffect } from "react";
import TeamList from "./teamList";
import "./firebase";
import "./App.css";
import QRCodeFooter from "./qrCode";
import LocationCheck from "./LocationCheck";

/*
  TODO: 
  - on reset, force all open widows to close
*/

function App() {
  const [allowedToVote, setAllowedToVote] = useState(null);
  // New state to manage the temporary "Location Found" message
  const [locationFound, setLocationFound] = useState(false);

  // UnionComedy
  const targetLat = 42.3876;
  const targetLng = -71.0995;

  // This handler will now trigger the temporary "Location Found" message
  const handleAllowed = () => {
    setAllowedToVote(true);
    setLocationFound(true);
  };
  const handleDenied = () => setAllowedToVote(false);

  // New function to handle the retry action
  const handleRetry = () => {
    setAllowedToVote(null); // Reset the state to force LocationCheck to render again
  };

  // Use a useEffect to control the duration of the "Location Found" message
  useEffect(() => {
    if (locationFound) {
      // Set a timer to hide the message after 3 seconds
      const timer = setTimeout(() => {
        setLocationFound(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [locationFound]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cage Match</h1>
      </header>

      <main>
        {/* Render LocationCheck only if the location hasn't been checked yet */}
        {allowedToVote === null && (
          <LocationCheck
            targetLat={targetLat}
            targetLng={targetLng}
            onAllowed={handleAllowed}
            onDenied={handleDenied}
          />
        )}

        {allowedToVote === false && (
          <div className="location-denied-container">
            <p>Sorry, you are not allowed to vote from your location.</p>
            <button onClick={handleRetry}>Try Again</button>
          </div>
        )}

        {/* Display this message if the user is denied access */}
        {allowedToVote === false && (
          <p>Sorry, you are not allowed to vote from your location.</p>
        )}

        {/* If the user is allowed to vote, we first show a temporary
          "Location Found" message. After the timer runs out, 
          the TeamList component is rendered.
        */}
        {allowedToVote === true && (
          <>
            {locationFound ? (
              <p>Location Found!</p>
            ) : (
              <TeamList />
            )}
          </>
        )}

        <QRCodeFooter />
      </main>
    </div>
  );
}

export default App;
