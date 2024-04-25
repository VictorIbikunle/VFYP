import React, { createContext, useContext, useState } from "react";

// Create a context
const SessionContext = createContext();

// Create a provider component
export const SessionProvider = ({ children }) => {
  // State to hold the current session data
  const [currentSession, setCurrentSession] = useState(localStorage.getItem("currentPatientId"));
  const patientId = localStorage.getItem("currentPatientId");
  const [patientData, setPatientData] = useState({
    name: "",
    dob: "",
    phoneNumber: "",
  });

  // Function to start a new session
  const startSession = async (patientData) => {
    console.log(`http://127.0.0.1:5000/get_patient/${patientData}`);
    // Store patient ID in localStorage to allow resuming session
    localStorage.setItem("currentPatientId", patientData);
    console.log("Session started for patient:", patientData);
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_patient/${patientData}`);
      if (response.ok) {
        const data = await response.json();
        setPatientData(data); // Update state with patient data
        setCurrentSession(patientData);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching patient data for ID ${patientId}:`, error.message);
    }
  };

  // Function to end the current session
  const endSession = () => {
    setCurrentSession(null);
    localStorage.removeItem("currentPatientId");
  };

  // Provide default values for context properties
  const contextValue = { currentSession, startSession, endSession, patientData };

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>;
};

// Custom hook to use session context
export const useSession = () => {
  // Use destructuring for context value
  const { currentSession, startSession, endSession, patientData } = useContext(SessionContext);

  // console.log(`http://127.0.0.1:5000/get_patient/${patientId}`);

  console.log("currentSession from sessioncontext", currentSession);
  console.log("patientData from sessioncontext", patientData);
  return { currentSession, startSession, endSession, patientData };
};
