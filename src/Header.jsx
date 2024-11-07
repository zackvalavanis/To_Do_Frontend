import { Link } from 'react-router-dom'

export function Header () { 
  return ( 
    <div>
      <Link to='/'>Home</Link>
      <Link to='/Signup'>Signup</Link>
      <Link to='/Login'>Login</Link>
    </div>
  )
}