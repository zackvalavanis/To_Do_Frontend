import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Logout } from './Logout.jsx';
import { useEffect } from 'react';
import { AuthContext } from './AuthContext';
import React, { useContext } from 'react';
import './Header.css';
import logo from './assets/Images/calendar-green-icon-png-17.png';
import { Link } from 'react-router-dom';

export function Header() {
  const { currentUser, isLoggedIn, logout } = useContext(AuthContext);

  useEffect(() => { 
    if (!localStorage.jwt){ 
      console.log('user Logged out');
    }
  }, []);

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to='/'>
            <img className="navbar-brand" src={logo} alt="Logo" />
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/" aria-current="page">Home</Link>
              </li>
              <li className="nav-item">
                {localStorage.jwt ? (
                  <Link className="nav-link" to="/Calendar">Calendar</Link>
                ) : null}
              </li>
              <li className="nav-item">
                {localStorage.jwt ? (
                  <Link className="nav-link" to="/Stats">Stats</Link>
                ) : null}
              </li>
            </ul>
            <ul className="navbar-nav ms-auto"> {/* Align dropdown to the right */}
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <ul className="dropdown-menu dropdown-menu-end"> {/* Dropdown aligns to the right */}
                  <li><Link className="dropdown-item" to="/">Home</Link></li>
                  {!localStorage.jwt && <li><Link className="dropdown-item" to="/Login">Login</Link></li>}
                  {!localStorage.jwt && <li><Link className="dropdown-item" to="/Signup">Signup</Link></li>}
                  {localStorage.jwt && <li><Logout className="dropdown-item" /></li>}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
