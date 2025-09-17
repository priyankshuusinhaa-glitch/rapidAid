import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AmbulanceTracking from "./AmbulanceTracking";
import "./BookingForm.css";
import { useAuth } from "../context/AuthContext";
import { bookingAPI, otpAPI } from "../services/api";

const BookingForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    emergencyLevel: "",
    pickupAddress: "",
    dropAddress: "",
    patientName: "",
    patientAge: "",
    contactNumber: "",
    condition: "",
    insurance: "",
    specialReq: "",
  });
  const [bookingMeta, setBookingMeta] = useState({ bookingId: null, otp: null });
  const [otpInput, setOtpInput] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle emergency selection
  const handleSelectEmergency = (level) => {
    setFormData({ ...formData, emergencyLevel: level });
  };

  // go to next step
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Check authentication
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
    }
  }, [isAuthenticated, navigate]);

  // final submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Please login to book an ambulance");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const bookingData = {
        userId: user._id,
        emergencyLevel: formData.emergencyLevel,
        pickupAddress: formData.pickupAddress,
        dropAddress: formData.dropAddress,
        patientName: formData.patientName,
        patientAge: formData.patientAge,
        contactNumber: formData.contactNumber,
        condition: formData.condition,
        insurance: formData.insurance,
        specialReq: formData.specialReq
      };

      const response = await bookingAPI.createBooking(bookingData);
      setBookingMeta({ bookingId: response.data.booking._id, otp: response.data.otp });
      setSuccess(`✅ Booking Created. Check your email for the OTP.`);
      
      // Reset form after successful booking
      setTimeout(() => {
        setStep(1);
        setFormData({
          emergencyLevel: "",
          pickupAddress: "",
          dropAddress: "",
          patientName: "",
          patientAge: "",
          contactNumber: "",
          condition: "",
          insurance: "",
          specialReq: "",
        });
        setSuccess("");
      }, 5000);

    } catch (error) {
      setError(error.response?.data?.error || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError("");
      await otpAPI.verify({ bookingId: bookingMeta.bookingId, otpCode: otpInput });
      setSuccess("✅ OTP verified. Ambulance will be assigned shortly.");
      setOtpVerified(true);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
       <>
    <Navbar/>
     <div className="booking-container">
      <h2>Book Your Ambulance</h2>
      <p>Quick and easy 3-step booking process for emergency medical services</p>

      {/* Error and Success Messages */}
      {error && (
        <div className="error-message" style={{ 
          backgroundColor: '#fee', 
          color: '#c33', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" style={{ 
          backgroundColor: '#efe', 
          color: '#363', 
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {success}
        </div>
      )}

      {/* Step Indicator */}
      <div className="steps">
        <span className={step === 1 ? "active" : ""}>1</span>
        <span className={step === 2 ? "active" : ""}>2</span>
        <span className={step === 3 ? "active" : ""}>3</span>
      </div>

      <form onSubmit={handleSubmit}>
        {/* STEP 1 */}
        {step === 1 && (
          <div className="card">
            <h3>Select Emergency Level</h3>
           <p className="card-p">Choose the appropriate urgency level for your medical emergency</p>
            <div className="emergency-options">
              {["Critical", "High", "Medium", "Low"].map((level) => (
                <div
                  key={level}
                  className={`option-card ${
                    formData.emergencyLevel === level ? "selected" : ""
                  }`}
                  onClick={() => handleSelectEmergency(level)}
                >
                  <h4>{level}</h4>
                  <p>
                    {level === "Critical" && "Life-threatening emergency"}
                    {level === "High" && "Urgent medical attention"}
                    {level === "Medium" && "Non-urgent medical care"}
                    {level === "Low" && "Routine medical transport"}
                  </p>
                  <strong>
                    {level === "Critical" && "$250"}
                    {level === "High" && "$200"}
                    
                    {level === "Medium" && "$150"}
                    {level === "Low" && "$100"}
                  </strong>
                  <br/>
                    Base Fare .&lt; 5 minutes

                </div>
              ))}
            </div>
            <div className="form-nav">
              <button type="button" onClick={nextStep} disabled={!formData.emergencyLevel}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="card">
            <h3>Pickup & Destination</h3>
            <p className="card-p">Provide pickup and destination locations for the ambulance service</p>
            <p className="selected-info">
              Selected: <b>{formData.emergencyLevel}</b>
            </p>

            <label>Pickup Location *</label>
            <input
              type="text"
              name="pickupAddress"
              placeholder="Enter pickup address"
              value={formData.pickupAddress}
              onChange={handleChange}
              required
            />

            <label>Destination (Hospital/Facility) *</label>
            <input
              type="text"
              name="dropAddress"
              placeholder="Enter destination hospital"
              value={formData.dropAddress}
              onChange={handleChange}
              required
            />

            <div className="info-box">
              📍 GPS Tracking Available – Once booked, you'll receive real-time updates.
            </div>

            <div className="form-nav">
              <button type="button" onClick={prevStep}>← Previous</button>
              <button type="button" onClick={nextStep} disabled={!formData.pickupAddress || !formData.dropAddress}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="card">
            <h3>Patient Information</h3>

            <label>Patient Full Name *</label>
            <input
              type="text"
              name="patientName"
              placeholder="Enter patient's full name"
              value={formData.patientName}
              onChange={handleChange}
              required
            />

            <label>Patient Age *</label>
            <input
              type="number"
              name="patientAge"
              placeholder="Enter age"
              value={formData.patientAge}
              onChange={handleChange}
              required
            />

            <label>Contact Phone Number *</label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="Enter phone number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />

            <label>Medical Condition</label>
            <input
              type="text"
              name="condition"
              placeholder="Brief description"
              value={formData.condition}
              onChange={handleChange}
            />

            <label>Insurance Provider</label>
            <input
              type="text"
              name="insurance"
              placeholder="Enter insurance provider"
              value={formData.insurance}
              onChange={handleChange}
            />

            <label>Special Requirements (0/500)</label>
            <textarea
              name="specialReq"
              placeholder="Any medical equipment, mobility assistance..."
              value={formData.specialReq}
              onChange={handleChange}
              maxLength="500"
            />

            <div className="warning-box">
              ⚠️ Important: An OTP will be sent to confirm booking.
            </div>

            <div className="form-nav">
              <button type="button" onClick={prevStep}>← Previous</button>
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "✅ Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </form>
      {bookingMeta.bookingId && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Verify OTP</h3>
          <p>Enter the 6-digit code sent to your registered email.</p>
          <input
            type="text"
            maxLength={6}
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            placeholder="Enter OTP"
          />
          <div className="form-nav">
            <button type="button" onClick={handleVerifyOtp} disabled={loading || otpInput.length !== 6}>
              Verify OTP
            </button>
          </div>
        </div>
      )}

      {otpVerified && bookingMeta.bookingId && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Live Ambulance Tracking</h3>
          <AmbulanceTracking bookingId={bookingMeta.bookingId} />
        </div>
      )}
    </div>
    </>

  );
};

export default BookingForm;
