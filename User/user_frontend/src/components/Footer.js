import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <div>
      <footer className="footer">
  <div className="footer-top">
    <div className="footer-brand">
      <div className="logof">
        <span className="plus">+</span> <span className="brand">RapidCare</span>
      </div>
      <p>
        RapidCare provides 24/7 emergency ambulance services with real-time tracking, professional
        medical staff, and fastest response times in the city.
      </p>
      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f">f</i></a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer"><i className="fab fa-twitter">i</i></a>
        <a href="https://instagram.com" target="_blank" rel="noreferrer"><i className="fab fa-instagram">t</i></a>
      </div>
    </div>

    <div className="footer-links">
      <h3>Quick Links</h3>
      <a href="/about">About Us</a>
      <a href="/service">Services</a>
      <a href="/contact">Contact</a>
      <a href="/bookNow">Book Ambulance</a>
    </div>

    <div className="footer-contact">

      <h3>Emergency Services</h3>
      <p>Critical Care Transport</p>
      <p>Basic Life Support</p>
      <p>Advanced Life Support</p>
      <p>Non-Emergency Transport</p>
    </div>
    <div className="footer-contact">
      <h3>Emergency Contact</h3>
      <p>📞 911 / 108</p>
      <p>✉️ emergency@rapidcare.com</p>
      <p>📍 24/7 Available</p>
    </div>
  </div>
  
  <div className="footer-bottom">
    <p>© 2024 RapidCare Ambulance Services. All rights reserved. |
      <a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a>
    </p>
  </div>
</footer>
    </div>
  )
}
