// Create a new component (e.g., PatientList.js)
import React, { useState, useEffect } from 'react';

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch the list of patients from your backend
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_all_patients');
        if (response.ok) {
          const data = await response.json();
          setPatients(data.patients); // Assuming your backend returns a list of patients
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching patients:', error.message);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <h2>All Patients</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient._id} onClick={() => onSelectPatient(patient)}>
            {patient.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
