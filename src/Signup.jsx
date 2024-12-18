import axios from 'axios';
import { useState } from 'react';
import './Signup.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

export function Signup() { 
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (event) => { 
    event.preventDefault();
    setErrors([]);
    const API_URL = import.meta.env.VITE_API_URL
    const params = new FormData(event.target);
    axios
      .post(`${API_URL}/users.json`, params)
      .then((response) => { 
        console.log(response.data);
        event.target.reset();
        toast.success("User Successfully Signed Up.")
        navigate('/Login')
      })
      .catch((error) => { 
        console.log(error.response.data.errors);
        setErrors(error.response.data.errors);
      });
  };

  return ( 
    <div className='signup-container'>
    <div id="signup">
      <div className="signup">
        <h1>Signup</h1>
      </div>
      <ul>
        {errors.map((error) => ( 
          <li key={error}>{error}</li>
        ))}
      </ul>
      <form className="form-signup" onSubmit={handleSubmit}>
        <div>
          Name: <input name="name" type="text" placeholder='Bob Jones'/>
        </div>
        <div>
          Email: <input name="email" type="email" placeholder='example@gmail.com'/>
        </div>
        <div>
          Password: <input name="password" type="password" placeholder='password'/>
        </div>
        <div>
          Password confirmation: <input name="password_confirmation" type="password" placeholder='Retype Password' />
        </div>
        <button type="submit">Signup</button>
      </form>
    </div>
    </div>
  );
}
