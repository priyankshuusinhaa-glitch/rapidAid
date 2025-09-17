import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [analytics, setAnalytics] = useState({ bookings: [], revenue: [], performance: [], emergency: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRange, setSelectedRange] = useState('day');
  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    completed: 0,
    cancelled: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bookingsRes, revenueRes, perfRes, emergencyRes, bookingStatsRes] = await Promise.all([
        axios.get(`/analytics/bookings?range=${selectedRange}`),
        axios.get(`/analytics/revenue?range=${selectedRange}`),
        axios.get(`/analytics/drivers/performance?range=${selectedRange}`),
        axios.get(`/analytics/emergency?range=${selectedRange}`),
        axios.get('/booking/booking?limit=1000') // Get all bookings for stats
      ]);

      setAnalytics({
        bookings: bookingsRes.data.data,
        revenue: revenueRes.data.data,
        performance: perfRes.data.data,
        emergency: emergencyRes.data.data
      });

      // Calculate booking statistics
      const allBookings = bookingStatsRes.data.bookings || [];
      const stats = {
        total: allBookings.length,
        pending: allBookings.filter(b => b.status === 'pending').length,
        assigned: allBookings.filter(b => b.status === 'assigned').length,
        completed: allBookings.filter(b => b.status === 'completed').length,
        cancelled: allBookings.filter(b => b.status === 'cancelled').length
      };
      
      setBookingStats(stats);

    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="container">Loading dashboard...</div>;

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      <p>Welcome back, {user.name}! Here's what's happening with RapidAid.</p>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Quick Stats */}
      <div className="grid">
        <div className="card">
          <h3 className="section-title">📊 Total Bookings</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
            {bookingStats.total}
          </div>
          <p>Total ambulance requests</p>
        </div>

        <div className="card">
          <h3 className="section-title">⏳ Pending</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {bookingStats.pending}
          </div>
          <p>Awaiting assignment</p>
        </div>

        <div className="card">
          <h3 className="section-title">🚑 Assigned</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
            {bookingStats.assigned}
          </div>
          <p>Currently in progress</p>
        </div>

        <div className="card">
          <h3 className="section-title">✅ Completed</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>
            {bookingStats.completed}
          </div>
          <p>Successfully completed</p>
        </div>
      </div>

      {/* Range Selector */}
      <div className="card">
        <h3 className="section-title">Analytics Period</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['day', 'week', 'month'].map(range => (
            <button
              key={range}
              className={`btn ${selectedRange === range ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid">
        <div className="card">
          <h3 className="section-title">Bookings</h3>
          {analytics.bookings.length === 0 ? <p>No data</p> : (
            <div>
              {analytics.bookings.map((b, idx) => (
                <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <strong>{b._id}</strong>: {b.count} bookings
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Revenue</h3>
          {analytics.revenue.length === 0 ? <p>No data</p> : (
            <div>
              {analytics.revenue.map((r, idx) => (
                <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <strong>{r._id}</strong>: ₹{r.totalRevenue}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Driver Performance</h3>
          {analytics.performance.length === 0 ? <p>No data</p> : (
            <div>
              {analytics.performance.map((p, idx) => (
                <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <strong>{p.driverName}</strong>: {p.completedBookings} completed
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Emergency Levels</h3>
          {analytics.emergency.length === 0 ? <p>No data</p> : (
            <div>
              {analytics.emergency.map((e, idx) => (
                <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <strong>{e.emergencyLevel}</strong>: {e.count} cases
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="section-title">Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => window.location.href = '/bookings'}>
            📋 View All Bookings
          </button>
          <button className="btn btn-success" onClick={() => window.location.href = '/drivers'}>
            👤 Manage Drivers
          </button>
          <button className="btn btn-info" onClick={() => window.location.href = '/ambulances'}>
            🚑 Manage Ambulances
          </button>
          <button className="btn btn-warning" onClick={() => window.location.href = '/users'}>
            👥 Manage Users
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
