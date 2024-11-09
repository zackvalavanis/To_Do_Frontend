import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext.jsx'
import React, { useContext } from 'react';

const jwt = localStorage.getItem("jwt")
if(jwt) { 
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`
}

export function Login() { 
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const { setCurrentUser, setIsLoggedIn } = useContext(AuthContext);

  

  const handleSubmit = async (event) => { 
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    try {
      const response = await axios.post("http://localhost:3000/sessions.json", params);
      const { jwt } = response.data;
      axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
      localStorage.setItem("jwt", jwt);
      event.target.reset();

      // Fetch current user data
      const userResponse = await axios.get("http://localhost:3000/users/current.json");
      setCurrentUser(userResponse.data);
      setIsLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.log(error.response);
      setErrors([error.response.data.error || 'Invalid email or password']);
    }
  };

  return (
    <div id="login">
    <h1>Login</h1>
    <ul>
      {errors.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
    <form onSubmit={handleSubmit}>
      <div>
        Email: <input name="email" type="email" />
      </div>
      <div>
        Password: <input name="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
);
}