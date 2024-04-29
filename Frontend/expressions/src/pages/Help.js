import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "../SessionContext";
import "./Help.css";

function Help() {
  const { startSession, patientData } = useSession();
  useEffect(() => {
    startSession(localStorage.getItem("currentPatientId"));
  }, [startSession]);

  const [formData, setFormData] = useState({ patientName: "", notes: "", reference: "" });
  const [currentReportId, setCurrentReportId] = useState(null);
  const [reportDetails, setReportDetails] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:5000/submit_report", formData);
      setReportDetails(response.data);
      setCurrentReportId(response.data.reportId);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const fetchReport = async (direction) => {
    try {
      const response = await axios.get(`http://localhost:5000/get_${direction}_report/${currentReportId}`);
      if (response.status === 200) {
        setReportDetails(response.data.report);
        setCurrentReportId(response.data.report._id);
      } else {
        alert("No more reports in this direction.");
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <div className="patient-form">
      <h1>Welcome to the reports page</h1>
      <h2>Notes for patient</h2>
      <div className="form-group">
        <label>Patient Name:</label>
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
      <button onClick={() => fetchReport('next')}>Next Report</button>
      <button onClick={() => fetchReport('previous')}>Previous Report</button>
      {reportDetails.notes && (
        <>
          <h3>Report Details:</h3>
          <p><strong>Notes:</strong> {reportDetails.notes}</p>
          <p><strong>Reference:</strong> {reportDetails.reference}</p>
        </>
      )}
    </div>
  );
}

export default Help;
