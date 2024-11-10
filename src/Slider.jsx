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
  };

  return (
    <div className="app-slider-container">
      <Slider {...settings}>
        <div className="slider-item">
          <h3>Calendar</h3>
          <p>Check Our Your Calendar</p>
          <Link to="/Calendar">Go to App 1</Link>
        </div>

        {/* Slide 2 */}
        <div className="slider-item">
          <h3>App 2</h3>
          <p>Description of App 2</p>
          <Link to="/app2">Go to App 2</Link>
        </div>

        {/* Slide 3 */}
        <div className="slider-item">
          <h3>App 3</h3>
          <p>Description of App 3</p>
          <Link to="/app3">Go to App 3</Link>
        </div>

        {/* Add more slides as needed */}
      </Slider>
    </div>
  );
};

export default AppSlider;
