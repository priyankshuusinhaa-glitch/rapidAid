import React, { useState } from 'react';
import axios from 'axios';

function BookingsFare() {
  const [bookingId, setBookingId] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [estimatedFare, setEstimatedFare] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [finalFare, setFinalFare] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  const calculate = async () => {
    try {
      setError('');
      const res = await axios.post(`/fares/${bookingId}/calculate`, { distanceKm: parseFloat(distanceKm) });
      setEstimatedFare(res.data.estimatedFare);
      setBreakdown(res.data.fareBreakdown);
    } catch (e) {
      setError(e.response?.data?.error || 'Calculation failed');
    }
  };

  const override = async () => {
    try {
      setError('');
      const res = await axios.post(`/fares/${bookingId}/override`, { finalFare: parseFloat(finalFare), reason: overrideReason });
      alert(res.data.message);
    } catch (e) {
      setError(e.response?.data?.error || 'Override failed');
    }
  };

  const updatePayment = async () => {
    try {
      setError('');
      const res = await axios.patch(`/fares/${bookingId}/payment`, { paymentStatus, paymentMethod });
      alert(res.data.message);
    } catch (e) {
      setError(e.response?.data?.error || 'Payment update failed');
    }
  };

  const fetchHistory = async () => {
    try {
      setError('');
      const res = await axios.get(`/fares/${bookingId}/history`);
      setHistory(res.data.history || []);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to fetch history');
    }
  };

  return (
    <div className="card">
      <h3>Fare Management</h3>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="grid">
        <div>
          <div className="form-group">
            <label>Booking ID</label>
            <input value={bookingId} onChange={(e) => setBookingId(e.target.value)} placeholder="Enter bookingId" />
          </div>
          <div className="form-group">
            <label>Distance (km)</label>
            <input type="number" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} placeholder="e.g., 12.5" />
          </div>
          <button className="btn btn-primary" onClick={calculate}>Calculate Fare</button>
        </div>
        <div>
          <div className="form-group">
            <label>Final Fare Override</label>
            <input type="number" value={finalFare} onChange={(e) => setFinalFare(e.target.value)} placeholder="e.g., 550" />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <input value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} placeholder="Reason for override" />
          </div>
          <button className="btn btn-warning" onClick={override}>Override Fare</button>
        </div>
        <div>
          <div className="form-group">
            <label>Payment Status</label>
            <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="insurance">Insurance</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button className="btn btn-success" onClick={updatePayment}>Update Payment</button>
        </div>
      </div>

      {estimatedFare !== null && (
        <div className="card" style={{ marginTop: 20 }}>
          <h4>Estimated Fare: ₹{estimatedFare}</h4>
          {breakdown && (
            <p>Base: ₹{breakdown.baseFare}, Per Km: ₹{breakdown.perKmRate}, Multiplier: {breakdown.emergencyMultiplier}</p>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Fare History</h3>
        <button className="btn btn-primary" onClick={fetchHistory}>Load History</button>
        {history.length === 0 ? <p>No history</p> : (
          <ul>
            {history.map((h) => (
              <li key={h._id}>
                {new Date(h.createdAt).toLocaleString()} - Estimated: ₹{h.estimatedFare} {h.finalFare ? `(Final: ₹${h.finalFare})` : ''} {h.overrideReason ? `- ${h.overrideReason}` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BookingsFare;
