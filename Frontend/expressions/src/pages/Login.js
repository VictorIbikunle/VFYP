import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

function Login({ setPatientId }) {  // Change here from setUsername to setPatientId
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { test } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { username, password });

      console.log(response);

      if (response.data.message === 'Login successful') {
        console.log('Successfully logged in');

        // Store the token in local storage
        localStorage.setItem('authToken', response.data.token);

        console.log(test);
        setPatientId(response.data.patient_id); // Use setPatientId directly

        // Navigate to the root of the application
        navigate('/', { state: { username } });
      } else {
        console.log('Login failed: ' + response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log('Rendering Login component');

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-5 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username">
              <strong>Username</strong>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              autoComplete="off"
              name="username"
              className="form-control rounded-0"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              className="form-control rounded-0"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </button>
        </form>
        <p>Don't have an account?</p>
        <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
