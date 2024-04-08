// api.js
import axios from 'axios';

const authToken = localStorage.getItem('authToken');

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${authToken}`,
  },
});

export default api;
