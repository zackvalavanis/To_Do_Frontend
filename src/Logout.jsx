import axios from 'axios'
import { AuthContext } from './AuthContext';
import React, { useContext} from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'

export function Logout({ className }) { 
  const { setCurrentUser, setIsLoggedIn, logout} = useContext(AuthContext);
  const navigate = useNavigate()

  const handleClick = (event) => { 
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
    toast.success('User successfully Logged Out.')
    navigate('/');
    console.log('You have successfully Logged Off')
  }
  return ( 
    <button className={className} onClick={handleClick}>
      Logout
    </button>
  );
}