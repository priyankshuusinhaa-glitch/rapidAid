import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Bookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    fromDate: '',
    toDate: '',
    plateNumber: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 20,
        ...filters
      });

      const response = await axios.get(`/booking/booking?${params}`);
      setBookings(response.data.bookings || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0
      });
    } catch (error) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.patch(`/booking/updatebooking/${bookingId}`, { status: newStatus });
      fetchBookings();
    } catch (error) {
      setError('Failed to update booking status');
    }
  };

  const handleAssignDriver = async (bookingId, driverId) => {
    try {
      await axios.patch(`/booking/updatebooking/${bookingId}`, { driverId });
      fetchBookings();
    } catch (error) {
      setError('Failed to assign driver');
    }
  };

  const handleAssignAmbulance = async (bookingId, ambulanceId) => {
    try {
      await axios.patch(`/booking/updatebooking/${bookingId}`, { ambulanceId });
      fetchBookings();
    } catch (error) {
      setError('Failed to assign ambulance');
    }
  };

  const regenerateOTP = async (bookingId) => {
    try {
      await axios.patch(`/booking/updatebooking/${bookingId}`, { regenerateOtp: true });
      fetchBookings();
    } catch (error) {
      setError('Failed to regenerate OTP');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'pending': 'badge-warning',
      'assigned': 'badge-info',
      'enroute': 'badge-primary',
      'arrived': 'badge-secondary',
      'in_transit': 'badge-info',
      'completed': 'badge-success',
      'cancelled': 'badge-danger'
    };
    return <span className={`badge ${statusColors[status] || 'badge-info'}`}>{status}</span>;
  };

  const getEmergencyBadge = (level) => {
    const levelColors = {
      'Critical': 'badge-danger',
      'Medium': 'badge-warning',
      'Low': 'badge-success'
    };
    return <span className={`badge ${levelColors[level] || 'badge-info'}`}>{level}</span>;
  };

  if (loading) return <div className="container">Loading bookings...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Booking Management</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filters */}
      <div className="card">
        <h3 className="section-title">Filters</h3>
        <div className="grid">
          <div className="form-group">
            <label>Status</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Search (Booking ID or OTP)</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by ID or OTP"
            />
          </div>

          <div className="form-group">
            <label>From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => handleFilterChange('toDate', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Ambulance Plate Number</label>
            <input
              type="text"
              value={filters.plateNumber}
              onChange={(e) => handleFilterChange('plateNumber', e.target.value)}
              placeholder="Enter plate number"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="card">
        <h3 className="section-title">Bookings ({pagination.total})</h3>
        
        <table className="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>User</th>
              <th>Emergency Level</th>
              <th>Fare</th>
              <th>OTP</th>
              <th>Status</th>
              <th>Driver</th>
              <th>Ambulance</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>
                  {booking.userId?.name || 'N/A'}<br/>
                  <small>{booking.userId?.email || 'N/A'}</small>
                </td>
                <td>{getEmergencyBadge(booking.emergencyLevel)}</td>
                <td>₹{booking.estimatedFare || booking.finalFare || 0}</td>
                <td>
                  <code>{booking.otp || 'N/A'}</code>
                  <button 
                    className="btn btn-outline btn-sm" 
                    onClick={() => regenerateOTP(booking._id)}
                    style={{ marginLeft: '8px' }}
                  >
                    🔄
                  </button>
                </td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>
                  {booking.driverId?.name || 'Unassigned'}<br/>
                  <small>{booking.driverId?.email || ''}</small>
                </td>
                <td>
                  {booking.ambulanceId?.plateNumber || 'Unassigned'}<br/>
                  <small>{booking.ambulanceId?.status || ''}</small>
                </td>
                <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <select 
                      value={booking.status} 
                      onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                      className="btn btn-outline btn-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="enroute">Enroute</option>
                      <option value="arrived">Arrived</option>
                      <option value="in_transit">In Transit</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        const driverId = prompt('Enter Driver ID:');
                        if (driverId) handleAssignDriver(booking._id, driverId);
                      }}
                    >
                      👤 Assign Driver
                    </button>
                    
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => {
                        const ambulanceId = prompt('Enter Ambulance ID:');
                        if (ambulanceId) handleAssignAmbulance(booking._id, ambulanceId);
                      }}
                    >
                      🚑 Assign Ambulance
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
            No bookings found matching the current filters.
          </p>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <button 
              className="btn btn-outline"
              disabled={pagination.currentPage === 1}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            >
              Previous
            </button>
            
            <span style={{ padding: '10px 16px', display: 'flex', alignItems: 'center' }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button 
              className="btn btn-outline"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
