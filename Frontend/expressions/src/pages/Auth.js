import {useState} from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';



let authToken = null;

export const isAuthenticated = () => {
  return authToken !== null;
};

export const setAuthToken = (token) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};
function Auth(){

  return(
    <div>
      <Signup/>
    </div>



  )



  
}

export default Auth;

