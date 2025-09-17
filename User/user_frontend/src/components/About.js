import React from "react";
import "./About.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
// import ambulanceImg from '../public/aboutambulance.jpg'
export default function About() {
  return (
    <>
<Navbar></Navbar>
    <div className="about-section">
      {/* About RapidCare */}
      <h2 className="about-title">About RapidCare</h2>
      <p className="about-text">
        Since 2010, RapidCare has been the leading provider of emergency medical
        services, saving lives through rapid response times, advanced medical
        equipment, and highly trained professionals who are always ready to serve.
      </p>

      {/* Stats */}
      <div className="stats">
        <div className="stat-item">
          <h3>15,000+</h3>
          <p>Lives Saved</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Emergency Coverage</p>
        </div>
        <div className="stat-item">
          <h3>4.8<span className="star">★</span></h3>
          <p>Patient Rating</p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission">
        <div className="mission-text">
          <h2>Our Mission</h2>
          <p>
            To provide the highest quality emergency medical services with
            compassion, professionalism, and rapid response times. We believe that
            every second counts in emergency situations, and our commitment is to
            bridge the gap between medical emergencies and hospital care.
          </p>

          <ul className="mission-list">
            <li> ✔  Advanced Life Support capabilities</li>
            <li> ✔  State-of-the-art medical equipment</li>
            <li> ✔  Certified paramedics and EMTs</li>
          </ul>
        </div>

        <div className="mission-image">
        <img src="/aboutambulance.jpg" alt="Ambulance"   height="550px"/>
        </div>
      </div>

      {/* Core Values */}
      <div className="core-values">
        <h2 className="core-title">Our Core Values</h2>
        <p className="core-subtitle">
          These fundamental principles guide everything we do and shape our
          approach to emergency medical care.
        </p>

        <div className="values-grid">
          <div className="value-card">
            <div className="icon">❤️</div>
            <h3>Compassionate Care</h3>
            <p>
              Every patient receives personalized, compassionate medical
              attention during their most critical moments.
            </p>
          </div>
          <div className="value-card">
            <div className="icon">🛡️</div>
            <h3>Safety First</h3>
            <p>
              Advanced safety protocols and equipment ensure the highest
              standards of patient and crew protection.
            </p>
          </div>
          <div className="value-card">
            <div className="icon">⏱️</div>
            <h3>Rapid Response</h3>
            <p>
              Strategic positioning and efficient dispatch systems enable us to
              reach patients in record time.
            </p>
          </div>
          <div className="value-card">
            <div className="icon">👥</div>
            <h3>Professional Excellence</h3>
            <p>
              Continuous training and certification ensure our team maintains
              the highest professional standards.
            </p>
          </div>
        </div>
      </div>
      {/* Leadership Team Section */}
      <div className="leadership">
        <h2 className="leadership-title">Meet Our Leadership Team</h2>
        <p className="core-subtitle">
          Our experienced leadership team brings decades of combined experience
          in emergency medical services, healthcare management, and patient care.
        </p>

        <div className="team-grid">
          <div className="team-card">
            <img src="https://media.istockphoto.com/id/1270790551/photo/medical-concept-of-indian-beautiful-female-doctor-in-white-coat-with-stethoscope.jpg?s=612x612&w=0&k=20&c=6VY6PXQw2W3nUPiYiGupqC9eDhwNGbLwtkIcmFxpIXg=" alt="Dr. Sarah Johnson" />
            <h3>Dr. Sarah Johnson</h3>
            <p className="role">Chief Medical Officer</p>
            <p className="exp">15+ years</p>
          </div>

          <div className="team-card">
            <img src="https://media.istockphoto.com/id/1470505351/photo/portrait-of-a-smiling-doctor-holding-glasses-and-a-mobile-phone-at-the-office.jpg?s=612x612&w=0&k=20&c=OQX6SG1K5Mn15e3VEli23NhJSbu5k3j-6Ms5ocqBsHY=" alt="Mike Rodriguez" />
            <h3>Mike Rodriguez</h3>
            <p className="role">Emergency Operations Director</p>
            <p className="exp">12+ years</p>
          </div>

          <div className="team-card">
            <img src="https://media.istockphoto.com/id/1587604256/photo/portrait-lawyer-and-black-woman-with-tablet-smile-and-happy-in-office-workplace-african.jpg?s=612x612&w=0&k=20&c=n9yulMNKdIYIQC-Qns8agFj6GBDbiKyPRruaUTh4MKs=" alt="Lisa Chen" />
            <h3>Lisa Chen</h3>
            <p className="role">Fleet Manager</p>
            <p className="exp">10+ years</p>
          </div>

          <div className="team-card">
            <img src="https://media.istockphoto.com/id/1785918657/photo/portrait-of-doctor-with-smile-confidence-and-hospital-employee-with-care-support-and-trust.jpg?s=612x612&w=0&k=20&c=edx0LITtjis5zxtRZIbx24yholpv4oNicE-e69guius=" alt="James Wilson" />
            <h3>James Wilson</h3>
            <p className="role">Technology Director</p>
            <p className="exp">8+ years</p>
          </div>
        </div>
      </div>
    </div>
      <div className="commitment">
      <h2 className="commitment-title">Our Commitment to Excellence</h2>
      <p className="commitment-text">
        We maintain the highest standards of care through continuous training,
        regular equipment updates, and strict quality assurance protocols. Our
        commitment extends beyond medical care to include community education
        and emergency preparedness programs.
      </p>

      <div className="commitment-cards">
        <div className="card">
          <div className="icon-circle">
            <span className="icon">🏅</span>
          </div>
          <h3>Accredited Service</h3>
          <p>Certified by national emergency medical standards</p>
        </div>

        <div className="card">
          <div className="icon-circle">
            <span className="icon">👩‍⚕️</span>
          </div>
          <h3>Expert Staff</h3>
          <p>Ongoing training and professional development</p>
        </div>

        <div className="card">
          <div className="icon-circle">
            <span className="icon">🏥</span>
          </div>
          <h3>Community Focus</h3>
          <p>Active community health and safety programs</p>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  );
}
