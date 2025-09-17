import React from 'react'
import { Link } from "react-router-dom";
import "./Navbar.css"
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div>
       {/* Navbar */}
       <nav className="navbar">
        <div className="logo">
          <span className="plus">+</span>
          <span className="brand">RapidCare</span>
        </div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/service">Services</a>
          <a href="/contact">Contact</a>
          <a href="/bookNow" className="btn-outline">Book Ambulance</a>
          
          {isAuthenticated ? (
            <>
              <span className="user-info" style={{ color: '#333', marginRight: '15px' }}>
                Welcome, User
              </span>
              <button onClick={handleLogout} className="btn-primary">Logout</button>
            </>
          ) : (
            <>
              <button className="btn-primary">Admin Login</button>
              <Link to="/auth/signup" className="btn-primary">Sign up</Link>
              <Link to="/auth/login" className="btn-primary">Login</Link>
            </>
          )}
        </div>
      </nav>
    </div>
  )
}
