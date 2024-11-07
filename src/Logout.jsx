import axios from 'axios'
import { Link } from 'react-router-dom'

export function Logout() { 
  const handleClick = (event) => { 
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    console.log('You have successfully Logged Off')
  }
  return ( 
    <Link to='/' onClick={handleClick}>
      Logout
    </Link>
  );
}