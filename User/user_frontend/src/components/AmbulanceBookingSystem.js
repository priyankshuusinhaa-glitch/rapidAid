import React from "react";
import { Phone } from "lucide-react";
// import { Link } from "react-router-dom";
import "./AmbulanceBookingSystem.css"; // Import the CSS file
import Navbar from "./Navbar";
import Footer from "./Footer";

const HomePage = () => {
  return (<>
    <div className="home-container">
      <Navbar></Navbar>


      {/* Hero Section */}
      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>
            Emergency Care <br />
            <span className="highlight">When Every Second Counts</span>
          </h1>
          <p>
            24/7 professional ambulance services with real-time tracking and fastest response times
          </p>
          <div className="hero-buttons">
            <button className="btn-yellow">
              <Phone size={18} style={{ marginRight: "8px" }} /> Book Emergency Ambulance
            </button>
            <button className="btn-white">View Services</button>
          </div>
        </div>
      </section>
    </div>

    <section className="emergency-section">
    <h2>Emergency Response Levels</h2>
    <p>We categorize emergencies to ensure appropriate response and pricing</p>
  
    <div className="emergency-cards">
      <div className="card critical">
        <div className="icon">❗</div>
        <h3>Critical</h3>
        <span className="subtitle">Life-threatening</span>
        <p>Cardiac arrest, severe trauma, stroke</p>
        <strong>$250 base fare</strong>
      </div>
  
      <div className="card high">
        <div className="icon">⚠️</div>
        <h3>High</h3>
        <span className="subtitle">Urgent care needed</span>
        <p>Severe bleeding, breathing difficulty</p>
        <strong>$200 base fare</strong>
      </div>
  
      <div className="card medium">
        <div className="icon">ℹ️</div>
        <h3>Medium</h3>
        <span className="subtitle">Stable condition</span>
        <p>Fractures, moderate injuries</p>
        <strong>$150 base fare</strong>
      </div>
  
      <div className="card low">
        <div className="icon">✅</div>
        <h3>Low</h3>
        <span className="subtitle">Non-emergency</span>
        <p>Routine transport, check-ups</p>
        <strong>$100 base fare</strong>
      </div>
    </div>
  </section>
  <section className="features-section">
  <h2>Why Choose RapidCare?</h2>
  <p className="subtitle">Advanced technology meets compassionate care</p>

  <div className="features-grid">
    <div className="feature-card">
      <div className="icon-circle">⌾</div>
      <h3>Real-Time Tracking</h3>
      <p>Track your ambulance location in real-time with accurate ETA updates</p>
    </div>

    <div className="feature-card">
      <div className="icon-circle">⏱</div>
      <h3>5-Minute Response</h3>
      <p>Average response time of 5 minutes with our optimized dispatch system</p>
    </div>

    <div className="feature-card">
      <div className="icon-circle">🛡</div>
      <h3>Certified Professionals</h3>
      <p>All our EMTs and paramedics are certified and experienced professionals</p>
    </div>

    <div className="feature-card">
      <div className="icon-circle">📞</div>
      <h3>24/7 Availability</h3>
      <p>Round-the-clock emergency services with instant booking capability</p>
    </div>

    <div className="feature-card">
      <div className="icon-circle">💳</div>
      <h3>Secure Payments</h3>
      <p>Multiple payment options with transparent pricing and no hidden fees</p>
    </div>

    <div className="feature-card">
      <div className="icon-circle">🏥</div>
      <h3>Hospital  Network</h3>
      <p>Connected with major hospitals for seamless patient handOver</p>
    </div>
  </div>
</section>

<section className="stats-section">
  <div className="stat">
    <h2>10,000+</h2>
    <p>Lives Saved</p>
  </div>
  <div className="stat">
    <h2>5 min</h2>
    <p>Avg Response Time</p>
  </div>
  <div className="stat">
    <h2>150+</h2>
    <p>Ambulances</p>
  </div>
  <div className="stat">
    <h2>24/7</h2>
    <p>Service Available</p>
  </div>
</section>

{/* <!-- Emergency CTA Section --> */}
<section className="cta-section">
  <h2>Medical Emergency? Don't Wait!</h2>
  <p>Book an ambulance instantly or call our emergency hotline</p>
  <div className="cta-buttons">
    <button className="btn-red">🚑 Book Ambulance Now</button>
    <button className="btn-yellow">📞 Call 911</button>
  </div>
</section>

{/* <!-- Footer --> */}
<Footer></Footer>

  </>
  );
};

export default HomePage;
