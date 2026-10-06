import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../utils/auth';

function Header({ user, onLogout }) {
  const handleLogout = () => {
    logout();
    onLogout();
  };

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <Link to="/dashboard" className="logo">
            <div className="logo-circles">
              <div className="logo-circle green"></div>
              <div className="logo-circle blue"></div>
              <div className="logo-circle orange"></div>
            </div>
            <span>RosterView</span>
          </Link>
          <nav>
            <ul className="nav-links">
              <li>Welcome, {user?.firstName}</li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
