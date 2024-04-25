import React, { useState } from "react";
import "./AppointmentScheduler.css"; // Add your CSS styling if needed

function AppointmentScheduler() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [streak, setStreak] = useState(0);
  const [streakCompleted, setStreakCompleted] = useState(false);

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const isAppointmentBooked = (newDate, newTime) => {
    return bookedAppointments.some(
      (appointment) => appointment.date === newDate && appointment.time === newTime
    );
  };

  const handleBookAppointment = async () => {
    if (isAppointmentBooked(date, time)) {
      alert("Appointment already booked for this date and time.");
      return;
    }

    const newBooking = {
      date,
      time,
      name,
    };

    setBookedAppointments([...bookedAppointments, newBooking]);

    // Update streak if user booked 3 or more appointments
    if (bookedAppointments.length + 1 >= 3) {
      setStreak((prevStreak) => prevStreak + 1);
      if (!streakCompleted) {
        setStreakCompleted(true);
      }
    }

    // Clear the input boxes
    setDate("");
    setTime("");
    setName("");

    // Save the booking details to the server
    try {
      // Your API call logic here
    } catch (error) {
      console.error("Error saving data:", error.message);
    }
  };

  const handleEditAppointment = (index) => {
    const editedAppointment = bookedAppointments[index];
    // Set the values of date, time, and name to the edited appointment
    setDate(editedAppointment.date);
    setTime(editedAppointment.time);
    setName(editedAppointment.name);

    // Remove the edited appointment from the list
    const updatedAppointments = [...bookedAppointments];
    updatedAppointments.splice(index, 1);
    setBookedAppointments(updatedAppointments);
  };

  const handleDeleteAppointment = (index) => {
    // Remove the appointment from the list
    const updatedAppointments = [...bookedAppointments];
    updatedAppointments.splice(index, 1);
    setBookedAppointments(updatedAppointments);
  };

  return (
    <div className="AppointmentScheduler">
      <h1>Appointment Scheduler</h1>

      {/* Input fields for date, time, and name */}
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

      {/* Booking button */}
      <button onClick={handleBookAppointment}>Book Appointment</button>

      {/* Display streak completion badge or icon */}
      {streakCompleted && (
        <div className="streak-badge">
          <img src="C:/Users/victo/Desktop/VFYP/Frontend/expressions/src/streak.png" alt="Streak Completed Badge" />
          <p>Congratulations! 3 bookings in a row!</p>
        </div>
      )}

      {/* Booked appointments list */}
      {bookedAppointments.length > 0 && (
        <div className="booked-appointments">
          <h2>Booked Appointments</h2>
          {bookedAppointments.map((appointment, index) => (
            <div key={index} className="appointment-details">
              <p>Date: {appointment.date}</p>
              <p>Time: {appointment.time}</p>
              <p>Name: {appointment.name}</p>
              <button onClick={() => handleEditAppointment(index)}>Edit</button>
              <button onClick={() => handleDeleteAppointment(index)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentScheduler;
