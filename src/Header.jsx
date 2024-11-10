import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Logout } from './Logout.jsx';
import { useEffect } from 'react';
import { AuthContext } from './AuthContext';
import React, { useContext } from 'react';
import './Header.css';
import logo from './assets/Images/calendar-green-icon-png-17.png';
import { Link } from 'react-router-dom'

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
            <img className="navbar-brand" src={logo}></img>
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
                <a className="nav-link active" aria-current="page" href="/">Home</a>
              </li>
              <li className="nav-item">
                {localStorage.jwt ? (
                  <a className="nav-link" href="/Calendar">Calendar</a>
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
                  <li><a className="dropdown-item" href="/">Home</a></li>
                  {!localStorage.jwt && <li><a className="dropdown-item" href="/Login">Login</a></li>}
                  {!localStorage.jwt && <li><a className="dropdown-item" href="/Signup">Signup</a></li>}
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
