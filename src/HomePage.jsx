import { useState } from 'react'
import { useNavigate } from 'react-router-dom';


export function HomePage () {
  const [name, setName] = useState("")
  const navigate = useNavigate();

  
  
  const handleClick = (event) => { 
    event.preventDefault();
    setName('johnny')
    console.log(name)
  }

  return ( 
    <div>
      <h1>
        Welcome to your page!
      </h1>
      <button onClick={handleClick}>Click Me</button>
    </div>
  )
}