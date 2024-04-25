import Navbar from "./Navbar";
import EmotionDetection from "./pages/EmotionDetection";
import Help from "./pages/Help";
import Home from "./pages/Home";
import AppointmentScheduler from "./pages/AppointmentScheduler";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Goal from "./pages/Goal";
import Auth from "./pages/Auth";
import Testing from "./pages/Testing";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./pages/AuthContext";

function App() {
  const [patientId, setPatientId] = useState(null);

  useEffect(() => {
    setPatientId(localStorage.getItem("currentPatientId"));
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/EmotionDetector" element={<EmotionDetection />} />
        <Route path="/Help" element={<Help />} />
        <Route path="/Testing" element={<Testing />} />
        <Route path="/AppointmentScheduler" element={<AppointmentScheduler />} />
        <Route path="/Goal" element={<Goal />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
