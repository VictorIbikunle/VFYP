import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "./SessionContext"; // Import the session provider
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "./styles.css";
import Modal from "react-modal";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import axios from "axios";

Modal.setAppElement("#root");

// Set the default headers for all Axios requests
const authToken = localStorage.getItem("authToken");
axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;

ReactDOM.render(
  <SessionProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </SessionProvider>,
  document.getElementById("root")
);

reportWebVitals();
