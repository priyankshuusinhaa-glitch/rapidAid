import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./components/AmbulanceBookingSystem";
import Login from "./pages/Login";
import UserSignup from "./pages/UserSignup";
import About from "./components/About";
import Service from "./components/Service";
import Contact from "./components/Contact";
import BookingForm from "./components/BookingForm";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/login" element={<Login/>} />
        <Route path="/auth/signup" element={<UserSignup />} />
        <Route path="/about" element={<About/>} />
        <Route path="/service" element={<Service/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/bookNow" element={<BookingForm/>} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
