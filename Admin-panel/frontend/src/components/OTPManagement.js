import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function OTPManagement({ user }) {
  const [otps, setOtps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    verified: '',
    expired: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    expired: 0,
    pending: 0
  });

  const fetchOTPs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 20,
        ...filters
      });

      const response = await axios.get(`/otp/list?${params}`);
      setOtps(response.data.otps || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        total: response.data.total || 0
      });
    } catch (error) {
      setError('Failed to fetch OTPs');
      console.error('Error fetching OTPs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/otp/stats/overview');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching OTP stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchOTPs();
    fetchStats();
  }, [fetchOTPs, fetchStats]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const regenerateOTP = async (bookingId) => {
    try {
      await axios.post(`/otp/regenerate/${bookingId}`);
      fetchOTPs();
      fetchStats();
    } catch (error) {
      setError('Failed to regenerate OTP');
    }
  };

  const cleanupExpiredOTPs = async () => {
    if (!window.confirm('Are you sure you want to cleanup expired OTPs? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axios.post('/otp/cleanup');
      alert(`Successfully cleaned up ${response.data.deletedCount} expired OTPs`);
      fetchOTPs();
      fetchStats();
    } catch (error) {
      setError('Failed to cleanup expired OTPs');
    }
  };

  const getStatusBadge = (verified, expired) => {
    if (verified) return <span className="badge badge-success">Verified</span>;
    if (expired) return <span className="badge badge-danger">Expired</span>;
    return <span className="badge badge-warning">Pending</span>;
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleString();
  };

  const getTimeRemaining = (sentTime) => {
    const now = new Date();
    const sent = new Date(sentTime);
    const expiryTime = new Date(sent.getTime() + 10 * 60 * 1000); // 10 minutes
    const remaining = expiryTime - now;
    
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="container">Loading OTPs...</div>;

  return (
    <div className="container">
      <h1 className="page-title">OTP Management</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {/* OTP Statistics */}
      <div className="grid">
        <div className="card">
          <h3 className="section-title">📊 Total OTPs</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
            {stats.total}
          </div>
          <p>Total generated OTPs</p>
        </div>

        <div className="card">
          <h3 className="section-title">✅ Verified</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
            {stats.verified}
          </div>
          <p>Successfully verified</p>
        </div>

        <div className="card">
          <h3 className="section-title">⏳ Pending</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats.pending}
          </div>
          <p>Awaiting verification</p>
        </div>

        <div className="card">
          <h3 className="section-title">❌ Expired</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
            {stats.expired}
          </div>
          <p>Expired OTPs</p>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h3 className="section-title">Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-warning" onClick={cleanupExpiredOTPs}>
            🗑️ Cleanup Expired OTPs
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h3 className="section-title">Filters</h3>
        <div className="grid">
          <div className="form-group">
            <label>Status</label>
            <select 
              value={filters.verified} 
              onChange={(e) => handleFilterChange('verified', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
          </div>

          <div className="form-group">
            <label>Expired</label>
            <select 
              value={filters.expired} 
              onChange={(e) => handleFilterChange('expired', e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Expired Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* OTPs List */}
      <div className="card">
        <h3 className="section-title">OTPs ({pagination.total})</h3>
        
        <table className="table">
          <thead>
            <tr>
              <th>OTP Code</th>
              <th>Booking ID</th>
              <th>User</th>
              <th>Emergency Level</th>
              <th>Status</th>
              <th>Sent Time</th>
              <th>Expires In</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {otps.map((otp) => (
              <tr key={otp._id}>
                <td>
                  <code style={{ fontSize: '16px', fontWeight: 'bold' }}>{otp.code}</code>
                </td>
                <td>{otp.bookingId?._id || 'N/A'}</td>
                <td>
                  {otp.bookingId?.userId?.name || 'N/A'}<br/>
                  <small>{otp.bookingId?.userId?.email || 'N/A'}</small>
                </td>
                <td>
                  <span className={`badge ${
                    otp.bookingId?.emergencyLevel === 'Critical' ? 'badge-danger' :
                    otp.bookingId?.emergencyLevel === 'Medium' ? 'badge-warning' : 'badge-success'
                  }`}>
                    {otp.bookingId?.emergencyLevel || 'N/A'}
                  </span>
                </td>
                <td>{getStatusBadge(otp.verified, otp.expired)}</td>
                <td>{formatTime(otp.sentTime)}</td>
                <td>
                  {otp.verified ? 'N/A' : getTimeRemaining(otp.sentTime)}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => regenerateOTP(otp.bookingId?._id)}
                      disabled={otp.verified}
                    >
                      🔄 Regenerate
                    </button>
                    
                    <button 
                      className="btn btn-info btn-sm"
                      onClick={() => {
                        navigator.clipboard.writeText(otp.code);
                        alert('OTP copied to clipboard!');
                      }}
                    >
                      📋 Copy
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {otps.length === 0 && (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>
            No OTPs found matching the current filters.
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

export default OTPManagement;
