import React, { createContext, useContext, useState } from 'react';

// Create a context
const SessionContext = createContext();

// Create a provider component
export const SessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null); // Holds the current session data

  // Function to start a new session
  const startSession = (patientData) => {
    setCurrentSession(patientData);
    // Store patient ID in localStorage to allow resuming session
    localStorage.setItem('currentPatientId', patientData._id);
  };

  // Function to end the current session
  const endSession = () => {
    setCurrentSession(null);
    localStorage.removeItem('currentPatientId');
  };

  return (
    <SessionContext.Provider value={{ currentSession, startSession, endSession }}>
      {children}
    </SessionContext.Provider>
  );
};

// Custom hook to use session context
export const useSession = () => useContext(SessionContext);
