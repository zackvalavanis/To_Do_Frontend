import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';  // Import Slick carousel
import { Link } from 'react-router-dom';  // To navigate between apps
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './slider.css';

const AppSlider = () => {
  const [isLoggedin, setIsLoggedin] = useState(localStorage.jwt ? true : false); // Track the login state

  // Effect to listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedin(localStorage.jwt ? true : false);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Slider settings
  const settings = {
    dots: true,  // Show navigation dots
    infinite: true,  // Infinite scrolling
    speed: 500,  // Transition speed
    slidesToShow: 1,  // Show one slide at a time
    slidesToScroll: 1,  // Scroll one slide at a time
    arrows: true,  // Enable arrow buttons for navigation
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Define slides based on login status
  const slides = [];

  if (isLoggedin) {
    slides.push({
      link: "/Calendar",
      imgSrc: "https://media.istockphoto.com/id/1990126590/photo/october-2024-white-calendar-with-green-blurred-background.webp?b=1&s=612x612&w=0&k=20&c=3O0eRPh3Pe1MjprGyq2sEgye4A15mODLlxnM_6DT8n0=",
      title: "Calendar",
      description: "Your Calendar Awaits",
    });

    slides.push({
      link: '/Stats',
      imgSrc: "https://static-00.iconduck.com/assets.00/stats-icon-1024x1005-44rqhmal.png",
      title: "My Stats", 
      description: "Your Stats",
    });
  } else {
    slides.push({
      link: "/Login",
      imgSrc: "https://media.istockphoto.com/id/531631840/vector/set-of-old-vintage-ribbon-banners-with-word-welcome-open.jpg?s=612x612&w=0&k=20&c=0HIH7GmbWVM8nWE2-vtM6u4JKqoXKPEoJG0TEEwIOug=",
      title: "Sign In Here",
      description: "Welcome Back",
    });

    slides.push({
      link: "/Signup",
      imgSrc: "https://t3.ftcdn.net/jpg/01/28/66/38/360_F_128663879_BhV0XbgJ03pFlW6JyyIj4riXo2whZnwb.jpg",
      title: "Signup",
      description: "Join the community and always be on time",
    });
  }

  return (
    <div className="app-slider-container">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slider-item">
            <Link to={slide.link}>
              <div className="card-1">
                <img className='card-image' src={slide.imgSrc} alt={slide.title} />
              </div>
            </Link>
            <div className='card-text'>
              <h3>{slide.title}</h3>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default AppSlider;
