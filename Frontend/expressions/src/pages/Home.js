import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSession } from '../SessionContext';

const Patient = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    dob: '',
    phoneNumber: '',
  });
  const [patients, setPatients] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [showPatients, setShowPatients] = useState(false);
  const [sessionStatus, setSessionStatus] = useState('');
  const { state } = useLocation();
  const username = state?.username;

  const { startSession } = useSession();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/save_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patient: patientData }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setUserMessage(result.user_message || "Patient data submitted successfully.");
        setPatientData({ name: '', dob: '', phoneNumber: '' });
        fetchPatients(); // Refresh the list of patients
        localStorage.setItem('currentPatientId', result.patient_id); // Assuming result.patient_id is the ID
        console.log("Patient created with ID:", result.patient_id); // Log the patient ID
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting patient data:", error.message);
    }
  };
  

  const fetchPatients = async () => {
    try {
        const response = await fetch('http://127.0.0.1:5000/get_all_patients');
        if (response.ok) {
            const data = await response.json();
            console.log(data); // Log to check the structure
            setPatients(data.patients || []); // Fallback to an empty array if undefined
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching patients:', error.message);
    }
};


  const fetchPatientData = async (patientId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_patient_data/${patientId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedPatientData(data.patientData);
        startSession(data.patientData);
        setSessionStatus(`Session started with patient: ${data.patientData.name}`);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error fetching patient data for ID ${patientId}:`, error.message);
    }
  };

  useEffect(() => {
    const savedPatientId = localStorage.getItem('currentPatientId');
    if (savedPatientId) {
      fetchPatientData(savedPatientId);
    } else {
      console.log('No saved patient ID found');
    }
  }, []);
  


  const handleFetchPatients = () => {
    fetchPatients();
    setShowPatients(true);
  };

  return (
    <div>
      <h1>Patient Information</h1>
      <h2>Welcome, {username}</h2>
      <form onSubmit={handlePatientSubmit}>
        <label>Name:<input type="text" name="name" value={patientData.name} onChange={handleInputChange} /></label>
        <label>Date of Birth:<input type="date" name="dob" value={patientData.dob} onChange={handleInputChange} /></label>
        <label>Phone Number:<input type="tel" name="phoneNumber" value={patientData.phoneNumber} onChange={handleInputChange} /></label>
        <button type="submit">Submit Patient Data</button>
      </form>

      {userMessage && <div><p>{userMessage}</p><button onClick={() => setUserMessage('')}>Clear Message</button></div>}

      {sessionStatus && <div><p>{sessionStatus}</p></div>}

      <button onClick={handleFetchPatients}>See All Patients</button>
      {showPatients && patients && Array.isArray(patients) && patients.length > 0 && (
  <div>
    <h2>All Patients</h2>
    <ul>
      {patients.map((patient) => {
        // Correct handling for unique key using patient._id.$oid
        return (
          <li key={patient._id.$oid}>
            {patient.name}
            <button onClick={() => fetchPatientData(patient._id.$oid)}>Select</button>
          </li>
        );
      })}
    </ul>
  </div>
)}




      {selectedPatientData && (
        <div>
          <h2>Session Active For:</h2>
          <p>Name: {selectedPatientData.name}</p>
          <p>Date of Birth: {selectedPatientData.dob}</p>
          <p>Phone Number: {selectedPatientData.phoneNumber}</p>
        </div>
      )}
    </div>
  );
};

export default Patient;
