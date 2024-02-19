import React, { useState } from "react";
import "./AppointmentScheduler.css"; // Add your CSS styling if needed

function AppointmentScheduler() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [bookedAppointments, setBookedAppointments] = useState([]);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBookAppointment = async () => {
    // Save the booking details locally
    const newBooking = {
      date,
      time,
      name,
    };

    setBookedAppointments([...bookedAppointments, newBooking]);

    // Clear the input boxes
    setDate("");
    setTime("");
    setName("");

    // Save the booking details to the server
    try {
      const response = await fetch("http://localhost:5000/save_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient: {
            name: name,
            // Include other patient details if available
            dob: "",
            phone_number: "",
          },
          goal: {
            // Include goal details if needed
            name: "",
            description: "",
            startDate: "",
            endDate: "",
          },
          emotion: {
            // Include emotion details if needed
            emotion: "",
            timestamp: "",
          },
          appointment: {
            patient_id: "", // You'll need to fetch the patient_id from the server or maintain it in your React state
            patient_name: name,
            date: date,
            time: time,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data saved successfully:", data);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error saving data:", error.message);
    }
  };

  return (
    <div className="AppointmentScheduler">
      <h1>Appointment Scheduler</h1>

      <div className="form-group">
        <label>Date:</label>
        <input type="date" value={date} onChange={handleDateChange} />
      </div>

      <div className="form-group">
        <label>Time:</label>
        <input type="time" value={time} onChange={handleTimeChange} />
      </div>

      <div className="form-group">
        <label>Name:</label>
        <input type="text" value={name} onChange={handleNameChange} />
      </div>

      <button onClick={handleBookAppointment}>Book Appointment</button>

      {bookedAppointments.length > 0 && (
        <div className="booked-appointments">
          <h2>Booked Appointments</h2>
          {bookedAppointments.map((appointment, index) => (
            <div key={index} className="appointment-details">
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              <p>Name: {appointment.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentScheduler;