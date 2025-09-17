import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserSignup.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function AuthForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [tab, setTab] = useState("User"); // default User tab
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    driverLicense: "",
    vehicleRegistration: "",
    emergencyContactName: "",
    emergencyContactPhone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: tab
      };

      if (tab === "Driver") {
        userData.driverLicense = formData.driverLicense;
        userData.vehicleRegistration = formData.vehicleRegistration;
        userData.emergencyContactName = formData.emergencyContactName;
        userData.emergencyContactPhone = formData.emergencyContactPhone;
      }

      const result = await signup(userData);

      if (result.success) {
        navigate("/"); // Redirect to home after successful signup
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Signup Form */}
      <div className="signup-container">
        <div className="signup-box">
          {/* Icon & Heading */}
          <div className="icon">➕</div>
          <h2>{tab === "User" ? "Create User Account" : "Create Driver Account"}</h2>
          <p>Join RapidCare for emergency services</p>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={tab === "User" ? "tab active" : "tab"}
              onClick={() => setTab("User")}
            >
              User Registration
            </button>
            <button
              className={tab === "Driver" ? "tab active" : "tab"}
              onClick={() => setTab("Driver")}
            >
              Driver Registration
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <div className="row">
              <div className="form-group">
                <label>First Name *</label>
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="Enter first name" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Enter last name" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Enter email address" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="Enter phone number" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group">
                <label>Password *</label>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Create password" 
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            {/* Extra fields only for Driver */}
            {tab === "Driver" && (
              <>
                <div className="row">
                  <div className="form-group">
                    <label>Driver License Number *</label>
                    <input 
                      type="text" 
                      name="driverLicense"
                      placeholder="Enter license number" 
                      value={formData.driverLicense}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Vehicle Registration *</label>
                    <input 
                      type="text" 
                      name="vehicleRegistration"
                      placeholder="Enter vehicle registration" 
                      value={formData.vehicleRegistration}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="form-group">
                    <label>Emergency Contact Name *</label>
                    <input 
                      type="text" 
                      name="emergencyContactName"
                      placeholder="Emergency contact name" 
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact Phone *</label>
                    <input 
                      type="tel" 
                      name="emergencyContactPhone"
                      placeholder="Emergency contact phone" 
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
              </>
            )}

       


          {/* Driver Requirements box */}
          {tab === "Driver" && (
            <div className="requirements">
              <h4>Driver Requirements:</h4>
              <ul>
                <li>Valid commercial driver's license</li>
                <li>Clean driving record (last 3 years)</li>
                <li>Background check verification</li>
                <li>Medical certification required</li>
                <li>Admin approval needed before activation</li>
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Creating Account..." : (tab === "User" ? "Create User Account" : "Create Driver Account")}
          </button>
        </form>
          {/* Already have account */}
          <p className="signin-link">
            Already have an account? <a href="/auth/login">Sign in here</a>
          </p>
        </div>
      </div>
    </>
  );
}
