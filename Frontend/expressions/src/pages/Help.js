import React, { useState } from "react";
import "./Help.css";
import axios from "axios";
import { useSession } from "../SessionContext";
import { useEffect } from "react";

function Help() {
  const { startSession, patientData } = useSession();
  useEffect(() => {
    startSession(localStorage.getItem("currentPatientId"));
  }, [startSession]);

  const [formData, setFormData] = useState({
    patientName: "", // Change patientName from patientData
    notes: "",
    reference: "",
  });

  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [reportId, setReportId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:5000/submit_report", {
        patientName: formData.patientName, // Use formData.patientName
        notes: formData.notes,
        reference: formData.reference,
      });

      setReportId(response.data.reportId);
      setConfirmationMessage(response.data.message);

      setFormData({
        patientName: "", // Reset patientName
        notes: "",
        reference: "",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      setConfirmationMessage("Error saving information. Please try again.");
    }
  };

  return (
    <div className="patient-form">
      <h1>Welcome to the reports page</h1>
      <h2>Notes for patient</h2>

      <div className="form-group">
        <label>Patient Name:</label>
        {/* Change input type to text and bind value to formData.patientName */}
        <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Notes:</label>
        <textarea name="notes" value={formData.notes} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Reference:</label>
        <input type="text" name="reference" value={formData.reference} onChange={handleInputChange} />
      </div>

      <button onClick={handleSave}>Save</button>

      {confirmationMessage && <p>{confirmationMessage}</p>}
      {reportId && <p>Report ID: {reportId}</p>}
    </div>
  );
}

export default Help;
