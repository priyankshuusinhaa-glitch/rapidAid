import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navigation({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="nav">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontSize: '18px', fontWeight: 'bold' }}>
            RapidAid Admin
          </Link>
        </div>
        
        <div>
          <Link to="/dashboard" className={isActive('/dashboard')}>
            Dashboard
          </Link>
          <Link to="/users" className={isActive('/users')}>
            Users
          </Link>
          <Link to="/drivers" className={isActive('/drivers')}>
            Drivers
          </Link>
          <Link to="/ambulances" className={isActive('/ambulances')}>
            Ambulances
          </Link>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: 'white' }}>
            {user.name} ({user.role})
          </span>
          <button onClick={onLogout} className="btn btn-danger" style={{ margin: 0 }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
