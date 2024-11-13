import { useNavigate } from 'react-router-dom';
import './Banner.css';
import Button from '@mui/material/Button';

export function Banner () {
  const navigate = useNavigate();
  return (
    <div className='banner'>
      <div className='black-box'>
        <p>Master Your Time, Master Your Life</p>
        <Button className='button-front' onClick={() => navigate('/Login')}>Login</Button>
      </div>
    </div>
  );
}
