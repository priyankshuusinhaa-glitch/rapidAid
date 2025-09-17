import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Default tab = user
  const [tab, setTab] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        role: tab
      });

      if (result.success) {
        navigate("/"); // Redirect to home after successful login
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <Navbar></Navbar>
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-logo">❤️</div>
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your RapidCare account</p>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={tab === "user" ? "tab active" : "tab"}
            onClick={() => setTab("user")}
          >
            User Login
          </button>
          <button
            className={tab === "driver" ? "tab active" : "tab"}
            onClick={() => setTab("driver")}
          >
            Driver Login
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="error-message" style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="form-options">
            <label>
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a href="/" className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="signin-btn" disabled={loading}>
            {loading ? "Signing In..." : (tab === "user" ? "Sign In as User" : "Sign In as Driver")}
          </button>
        </form>

        <p className="signup-text">
          Don’t have an account?{" "}
          <a href="/auth/signup">Sign up here</a>
        </p>
        {tab === "driver" && (
            <div className="requirements">
              
              <ul>
                <li>  Driver accounts require admin approval after registration.</li>
            
                
              </ul>
            </div>
          )}

      </div>
    </div>
    </>
  );
}
