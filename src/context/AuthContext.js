import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase'; // Make sure Firebase is correctly initialized in this file

// Create the context for user authentication
const AuthContext = createContext();

// AuthProvider component to provide the authentication state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(setCurrentUser);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the current user
export const useAuth = () => {
  return React.useContext(AuthContext);
};
