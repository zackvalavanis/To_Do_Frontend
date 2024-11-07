import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const jwt = localStorage.getItem("jwt")
if(jwt) { 
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`
}

export function Login() { 
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  

  const handleSubmit = (event) => { 
    event.preventDefault();
    setErrors([]);
    const params = new FormData(event.target);
    axios 
      .post("http://localhost:3000/sessions.json", params).then((response) => { 
        console.log(response.data);
        axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
        localStorage.setItem("jwt", response.data.jwt);
        event.target.reset();
        navigate('/');
      })
      .catch((error) => { 
        console.log(error.response);
        setErrors(["invalid Email or Password"]);
      });
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