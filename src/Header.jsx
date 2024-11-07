import { Link } from 'react-router-dom'
import { Logout } from './Logout.jsx'

export function Header () { 
  return ( 
    <div>
      <Link to='/'>Home</Link>
      <Link to='/Signup'>Signup</Link>
      <Link to='/Login'>Login</Link>
      <Logout />
    </div>
  )
}