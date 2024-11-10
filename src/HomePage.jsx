import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import { Banner } from './Banner.jsx'
import  AppSlider  from './Slider.jsx'


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
    <div className="main-content">
      <h1>Welcome to the Homepage</h1>
      <p>This is some content to test the layout.</p>
    </div>

      <AppSlider />
      {/* <button onClick={handleClick}>Click Me</button> */}
    </div>
  )
}