import React, { useEffect, useState } from "react";
import { auth, onAuthStateChanged, signInAnonymously } from "./firebase";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser(firebaseUser);
        console.log("firebaseUser: ", firebaseUser)
      } else {
        // No user signed in, sign in anonymously
        signInAnonymously(auth).catch(console.error);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={user}>
      {children}
    </AuthContext.Provider>
  );
}

export const AuthContext = React.createContext(null);

export default AuthProvider;
