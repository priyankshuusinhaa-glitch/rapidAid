import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    users: 0,
    drivers: 0,
    ambulances: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, driversRes, ambulancesRes] = await Promise.all([
        axios.get('/users?limit=1'),
        axios.get('/drivers?limit=1'),
        axios.get('/ambulances?limit=1')
      ]);

      setStats({
        users: usersRes.data.total || 0,
        drivers: driversRes.data.total || 0,
        ambulances: ambulancesRes.data.total || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {user.name}! You are logged in as {user.role}.</p>
      
      <div className="grid">
        <div className="card">
          <h3>Users</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff' }}>{stats.users}</p>
          <p>Total registered users</p>
        </div>
        
        <div className="card">
          <h3>Drivers</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#28a745' }}>{stats.drivers}</p>
          <p>Total drivers</p>
        </div>
        
        <div className="card">
          <h3>Ambulances</h3>
          <p style={{ fontSize: '2em', fontWeight: 'bold', color: '#ffc107' }}>{stats.ambulances}</p>
          <p>Total ambulances</p>
        </div>
      </div>

      <div className="card">
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => window.location.href = '/users'}>
            Manage Users
          </button>
          <button className="btn btn-success" onClick={() => window.location.href = '/drivers'}>
            Manage Drivers
          </button>
          <button className="btn btn-warning" onClick={() => window.location.href = '/ambulances'}>
            Manage Ambulances
          </button>
        </div>
      </div>

      <div className="card">
        <h3>API Health Check</h3>
        <button 
          className="btn btn-primary" 
          onClick={async () => {
            try {
              const response = await axios.get('/health');
              alert(`API Status: ${response.data.status}\nMessage: ${response.data.message}`);
            } catch (error) {
              alert(`API Error: ${error.message}`);
            }
          }}
        >
          Test API Connection
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
