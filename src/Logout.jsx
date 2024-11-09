import axios from 'axios'
import { AuthContext } from './AuthContext';
import React, { useContext} from 'react';

export function Logout({ className }) { 
  const { setCurrentUser, setIsLoggedIn, logout} = useContext(AuthContext);

  const handleClick = (event) => { 
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setIsLoggedIn(false);
    console.log('You have successfully Logged Off')
  }
  return ( 
    <button className={className} onClick={handleClick}>
      Logout
    </button>
  );
}