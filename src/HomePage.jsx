import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Banner } from './Banner.jsx'
import  AppSlider  from './Slider.jsx'
import './HomePage.css'


export function HomePage () {
  
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