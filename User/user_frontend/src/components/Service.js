import React from "react";
import "./Service.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
// import ambulanceImg from "./ambulance.jpg"; // replace with your image path

export default function Service() {
    const services = [
        {
          icon: "🏥",
          title: "Inter-Hospital Transfers",
          desc: "Safe and efficient transfers between medical facilities with appropriate medical supervision."
        },
        {
          icon: "🩺",
          title: "Event Medical Coverage",
          desc: "On-site medical support for events, sports competitions, and public gatherings."
        },
        {
          icon: "❤️",
          title: "Cardiac Care Transport",
          desc: "Specialized cardiac monitoring and support during transport for heart patients."
        },
        {
          icon: "🚑",
          title: "Critical Care Transfers",
          desc: "Advanced life support for ICU patient transfers with specialized medical equipment."
        },
        {
          icon: "♿",
          title: "Wheelchair Transport",
          desc: "Non-emergency wheelchair accessible transport for medical appointments."
        },
        {
          icon: "✈️",
          title: "Air Medical Coordination",
          desc: "Coordination with helicopter and air ambulance services for critical emergencies."
        }
      ];
    return (
        <>
            <Navbar />
            <div className="service-section">
                <h1 className="service-title">Our Emergency Services</h1>
                <p className="service-intro">
                    RapidCare provides comprehensive emergency medical services with different levels of care
                    tailored to your specific medical needs. Our professional teams are equipped with
                    state-of-the-art medical equipment and ready to respond 24/7.
                </p>

                <div className="service-card">
                    {/* Left Content */}
                    <div className="service-content">
                        <span className="priority">
                            <span className="dot"></span> CRITICAL PRIORITY
                        </span>

                        <h2>Critical Care Transport</h2>

                        <div className="price-time">
                            <span className="price">$250 <small>base fare</small></span>
                            <span className="time">&lt; 3 minutes response time</span>
                        </div>

                        <p className="service-desc">
                            Life-threatening emergencies requiring immediate advanced life support
                            and rapid transport.
                        </p>

                        <h4>Service Features:</h4>
                        <ul className="features">
                            <li>Advanced Cardiac Life Support (ACLS)</li>
                            <li>Mechanical ventilation support</li>
                            <li>Cardiac monitoring and defibrillation</li>
                            <li>IV therapy and medication administration</li>
                            <li>Trauma care and stabilization</li>
                        </ul>

                        <button className="book-btn">Book This Service</button>
                    </div>

                    {/* Right Image */}
                    <div className="service-image">
                        <img src="/creticalservice.png" alt="Critical Care Transport" />
                    </div>
                </div>

                <div className="service-card">
                    {/* Left Content */}
                    <div className="service-content">
                        <span className="priority">
                            <span className="dotyr"></span> High Priority
                        </span>

                        <h2>Emergency Medical Services</h2>

                        <div className="price-time">
                            <span className="price">$200 <small>base fare</small></span>
                            <span className="time">&lt; 5 minutes response time</span>
                        </div>

                        <p className="service-desc">
                            Urgent medical conditions requiring prompt professional medical attention and transport.
                        </p>

                        <h4>Service Features:</h4>
                        <ul className="features">
                            <li>Basic and Advanced Life Support</li>
                            <li>Emergency medication administration</li>
                            <li>Trauma assessment and treatment</li>
                            <li>Respiratory support and oxygen therapy</li>
                            <li>Pain management and stabilization</li>
                        </ul>

                        <button className="book-btnyr">Book This Service</button>
                    </div>

                    {/* Right Image */}
                    <div className="service-image">
                        <img src="/creticalservice.png" alt="Critical Care Transport" />
                    </div>
                </div>

                <div className="service-card">
                    {/* Left Content */}
                    <div className="service-content">
                        <span className="priority">
                            <span className="doty"></span> Medium Priority

                        </span>

                        <h2>Medical Transport
                        </h2>

                        <div className="price-time">
                            <span className="price">$150 <small>base fare</small></span>
                            <span className="time">&lt; 10 minutes response time</span>
                        </div>

                        <p className="service-desc">
                            Non-urgent medical transport with basic life support capabilities for stable patients.


                        </p>

                        <h4>Service Features:</h4>
                        <ul className="features">
                            <li>Basic Life Support (BLS)
                            </li>
                            <li>Patient monitoring and vital signs
                            </li>
                            <li>Comfortable patient transport
                            </li>
                            <li>Medical escort services
                            </li>
                            <li>Inter-facility transfers
                            </li>
                        </ul>

                        <button className="book-btny">Book This Service</button>
                    </div>

                    {/* Right Image */}
                    <div className="service-image">
                        <img src="/creticalservice.png" alt="Critical Care Transport" />
                    </div>
                </div>

                <div className="service-card">
                    {/* Left Content */}
                    <div className="service-content">
                        <span className="priority">
                            <span className="dotg"></span> Low Priority
                        </span>

                        <h2>Routine Transport</h2>

                        <div className="price-time">
                            <span className="price">$100 <small>base fare</small></span>
                            <span className="time">&lt; 15 minutes response time</span>
                        </div>

                        <p className="service-desc">
                            Scheduled medical appointments and routine hospital transfers for non-emergency situations.


                        </p>

                        <h4>Service Features:</h4>
                        <ul className="features">
                            <li>Wheelchair accessible vehicles
                            </li>
                            <li>Assistance with mobility
                            </li>
                            <li>Scheduled appointment transport
                            </li>
                            <li>Basic medical supervision
                            </li>
                            <li>Comfortable and safe transport
                            </li>
                        </ul>

                        <button className="book-btng">Book This Service</button>
                    </div>

                    {/* Right Image */}
                    <div className="service-image">
                        <img src="/creticalservice.png" alt="Critical Care Transport" />
                    </div>
                </div>
            </div>
            <div className="additional-services">
      <h2>Additional Medical Services</h2>
      <p className="subtitle">
        Beyond emergency response, we offer specialized medical transportation 
        and support services to meet various healthcare needs.
      </p>

      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </div>
    <div className="equipment-section">
      <div className="equipment-content">
        <h2>Equipment & Technology</h2>
        <p className="description">
          Our ambulances are equipped with the latest medical technology and
          life-saving equipment to provide the highest quality of care during
          transport. We continuously upgrade our fleet to maintain the most
          advanced emergency medical capabilities.
        </p>

        <div className="equipment-lists">
          <div className="list">
            <h3>Life Support Equipment</h3>
            <ul>
              <li>✔ Defibrillators</li>
              <li>✔ Ventilators</li>
              <li>✔ Cardiac monitors</li>
              <li>✔ IV pumps</li>
            </ul>
          </div>

          <div className="list">
            <h3>Communication Systems</h3>
            <ul>
              <li>✔ GPS tracking</li>
              <li>✔ Digital radios</li>
              <li>✔ Hospital connectivity</li>
              <li>✔ Real-time updates</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="equipment-image">
        <img src="/creticalservice.png" alt="Ambulance Equipment" />
      </div>
    </div>
    <section className="cta-section">
  <h2>Ready for Emergency Care?</h2>
                          <p>Don't wait in an emergency. Our professional medical teams are standing by <br />
                                     24/7 to provide the care you need when you need it most.</p>
  <div className="cta-buttons">
    <button className="btn-red">🚑 Book Service Now</button>
    
  </div>
</section>
<Footer/>
        </>
    );
}
