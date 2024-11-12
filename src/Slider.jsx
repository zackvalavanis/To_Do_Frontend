import React from 'react';
import Slider from 'react-slick';  // Import Slick carousel
import { Link } from 'react-router-dom';  // To navigate between apps
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.css'

const AppSlider = () => {
  const settings = {
    dots: true,  // Show navigation dots
    infinite: true,  // Infinite scrolling
    speed: 500,  // Transition speed
    slidesToShow: 1,  // Show one slide at a time
    slidesToScroll: 1,  // Scroll one slide at a time
    arrows: true,  // Enable arrow buttons for navigation
    autoplay:true,
    autoplaySpeed: 3000,
  };


  // const cards = [
  //   {id: 1, imageUrl:  }, 
  //   {id: 2, imageUrl: }, 
  //   {id: 3, imageUrl: }
  // ]

  return (
    <div className="app-slider-container">
      <Slider {...settings}>
        <div className="slider-item">
        <Link to="/Calendar">
          <div className ='card-1'>
            <img className='card-image' src="https://media.istockphoto.com/id/1990126590/photo/october-2024-white-calendar-with-green-blurred-background.webp?b=1&s=612x612&w=0&k=20&c=3O0eRPh3Pe1MjprGyq2sEgye4A15mODLlxnM_6DT8n0="></img>
          </div>
        </Link>
          <div className='card-text'>
          <h3>Calendar</h3>
          <p>Your Calendar Awaits</p>
          </div>
        </div>

       <div className="slider-item">
       <Link to="/Login">
        <div className="card-1">
            <img src="https://media.istockphoto.com/id/531631840/vector/set-of-old-vintage-ribbon-banners-with-word-welcome-open.jpg?s=612x612&w=0&k=20&c=0HIH7GmbWVM8nWE2-vtM6u4JKqoXKPEoJG0TEEwIOug="/>
        </div>
        </Link>
        <div className='card-text'>
          <h3>Sign In Here</h3>
          <p>Welcome Back</p>
        </div>
        </div>

        <div className="slider-item">
        <Link to="/Signup">
          <div className='card-1'>
            <img src='https://t3.ftcdn.net/jpg/01/28/66/38/360_F_128663879_BhV0XbgJ03pFlW6JyyIj4riXo2whZnwb.jpg'></img>
          </div>
        </Link>
        <div className='card-text'>
          <h3>Signup</h3>
          <p>Join the community and always be on time</p>
        </div>
       </div>
      </Slider>
    </div>
  );
};

export default AppSlider;
