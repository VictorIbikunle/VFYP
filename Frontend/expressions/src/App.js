import Navbar from "./Navbar";
import EmotionDetection from "./pages/EmotionDetection";
import Help from "./pages/Help";
import Home from "./pages/Home";
import AppointmentScheduler from "./pages/AppointmentScheduler";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Goal from "./pages/Goal";
import Auth from "./pages/Auth";
import Testing from "./pages/Testing";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from "./pages/AuthContext";

function App() {
  let Component = Auth; // Initialize to a default component

  const [patientId, setPatientId] = useState(null);
  console.log("Patient ID:", patientId);

  switch (window.location.pathname) {
    case "/":
      Component = Home;
      break;
    case "/Emotion%20Detector":
      Component = EmotionDetection;
      break;
    case "/Help":
      Component = Help;
      break;
    case "/Testing":
      Component = Testing;
      break;
    case "/AppointmentScheduler":
      Component = AppointmentScheduler;
      break;
    case "/Goal":
      Component = Goal;
      break;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" render={(props) => <Login {...props} test="some String" setPatientId={setPatientId} />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      <Component />
    </>
  );
}

export default App;
