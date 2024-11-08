import axios from 'axios'

export function Logout({ className }) { 
  const handleClick = (event) => { 
    event.preventDefault();
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("jwt");
    console.log('You have successfully Logged Off')
  }
  return ( 
    <button className={className} onClick={handleClick}>
      Logout
    </button>
  );
}