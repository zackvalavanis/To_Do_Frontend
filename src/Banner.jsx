import { useNavigate } from 'react-router-dom';
import './Banner.css';
import Button from '@mui/material/Button';

export function Banner () {
  const navigate = useNavigate();
  return (
    <div className='banner'>
      {/* Black box on the left side */}
      <div className='black-box'>
        <p>Master Your Time, Master Your Life</p>
      </div>
      
      <div className='banner-info'>
        <p className='text'></p>
        <Button className='button-front' onClick={() => navigate('/Login')}>Login</Button>
      </div>
    </div>
  );
}
