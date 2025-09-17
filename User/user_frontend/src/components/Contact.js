import React from "react";
import "./Contact.css"; // import css fil
import { useForm } from "react-hook-form";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Contact = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = (data) => {
      alert("✅ Message Sent!\n" + JSON.stringify(data, null, 2));
      reset();
    };
  return (
    <>
    <Navbar/>
    <section className="contact-section">
      <h2>Contact RapidCare</h2>
      <p>
        We're here to help 24/7. Reach out for emergency services, general
        inquiries, or any questions about our medical transportation services.
      </p>

      <div className="contact-grid">
        {/* Emergency */}
        <div className="card">
          <div className="icon">📞</div>
          <h3>Emergency Line</h3>
          <p className="highlight">911</p>
          <p>For immediate life-threatening emergencies</p>
        </div>

        {/* Non-Emergency */}
        <div className="card">
          <div className="icon">📞</div>
          <h3>Non-Emergency</h3>
          <p className="highlight">+1 (555) 123-4567</p>
          <p>For bookings and general inquiries</p>
        </div>

        {/* Email */}
        <div className="card">
          <div className="icon">✉️</div>
          <h3>Email Support</h3>
          <p className="highlight">support@rapidcare.com</p>
          <p>Response within 24 hours</p>
        </div>

        {/* Headquarters */}
        <div className="card">
          <div className="icon">📍</div>
          <h3>Headquarters</h3>
          <p className="highlight">
            123 Emergency Blvd, <br /> Medical District
          </p>
          <p>Main dispatch and administration</p>
        </div>
      </div>
    </section>
    <div className="contact-container">
      {/* Left side form */}
      <div className="contact-form-wrapper">
        <h2>Send Us a Message</h2>
        <p>Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible.</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div>
              <input {...register("firstName", { required: "First Name required" })} placeholder="First Name *" />
              {errors.firstName && <p className="error">{errors.firstName.message}</p>}
            </div>
            <div>
              <input {...register("lastName", { required: "Last Name required" })} placeholder="Last Name *" />
              {errors.lastName && <p className="error">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="row">
            <div>
              <input {...register("email", {
                required: "Email required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" }
              })} placeholder="Email *" />
              {errors.email && <p className="error">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register("phone")} placeholder="Phone Number" />
            </div>
          </div>

          <select {...register("inquiry")}>
            <option>General Inquiry</option>
            <option>Emergency</option>
            <option>Support</option>
          </select>

          <div>
            <input {...register("subject", { required: "Subject required" })} placeholder="Subject *" />
            {errors.subject && <p className="error">{errors.subject.message}</p>}
          </div>

          <div>
            <textarea {...register("message", { required: "Message required" })} placeholder="Message * (0/500)" maxLength={500}></textarea>
            {errors.message && <p className="error">{errors.message.message}</p>}
          </div>

          <button type="submit">Send Message</button>
        </form>
      </div>

      {/* Right side info */}
      <div className="contact-info">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3..."
            title="RapidCare Headquarters Map"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="info-box">
          <h4>Emergency Response Coverage</h4>
          <p>We provide 24/7 emergency medical services across the entire metropolitan area with strategically positioned ambulances for optimal response times.</p>
        </div>

        <div className="hours">
          <h4>Operating Hours</h4>
          <p>Emergency Services: 24/7</p>
          <p>Administrative Office: Mon–Fri 8AM–6PM</p>
          <p>Billing Department: Mon–Fri 9AM–5PM</p>
        </div>
      </div>
    </div>
    <section className="cta-section">
  <h2>Need Immediate Assistance?</h2>
                          <p>For life-threatening emergencies, don't hesitate to call 911. <br></br>For urgent but non-emergency medical transport, contact our dispatch directly.</p>
  <div className="cta-buttons">
    <button className="btn-red">📞
Emergency: 911</button>
<button className="btn-red">📞

Dispatch: +1 (555) 123-4567</button>
  </div>
</section>
<Footer/>
    </>
  );
};

export default Contact;
