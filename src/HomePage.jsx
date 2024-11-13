import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Banner } from './Banner.jsx'
import  AppSlider  from './Slider.jsx'
import './HomePage.css'


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
    <Banner>
    </Banner>
    <div className='slider-section'>
      <AppSlider />
    </div>
      {/* <button onClick={handleClick}>Click Me</button> */}
    </div>
  )
}