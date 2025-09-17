import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ user, onLogout }) {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="nav">
      <div className="container nav-content">
        <div className="nav-brand">
          <Link to="/dashboard">RapidAid Admin</Link>
        </div>
        
        <div className="nav-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
          <Link to="/users" className={isActive('/users')}>Users</Link>
          <Link to="/drivers" className={isActive('/drivers')}>Drivers</Link>
          <Link to="/ambulances" className={isActive('/ambulances')}>Ambulances</Link>
          
          {/* Dropdown Menu */}
          <div className="nav-dropdown" ref={dropdownRef}>
            <button 
              className={`nav-dropdown-btn ${isActive('/bookings') || isActive('/otp') || isActive('/fares') ? 'active' : ''}`}
              onClick={toggleDropdown}
            >
              Features ▼
            </button>
            
            {isDropdownOpen && (
              <div className="nav-dropdown-menu">
                <Link 
                  to="/bookings" 
                  className={isActive('/bookings')}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  📋 Bookings
                </Link>
                <Link 
                  to="/otp" 
                  className={isActive('/otp')}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  🔐 OTP Management
                </Link>
                <Link 
                  to="/fares" 
                  className={isActive('/fares')}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  💰 Fares & Analytics
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <div className="nav-user">
          <span className="user-info">{user.name} ({user.role})</span>
          <button onClick={onLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
