import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import './styles.css';
import Modal from 'react-modal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';


Modal.setAppElement('#root');

ReactDOM.render(
  
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        
      </Routes>
      <App />
    </BrowserRouter>,
  
  document.getElementById('root')
);

reportWebVitals();
