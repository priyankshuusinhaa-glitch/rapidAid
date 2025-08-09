import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Drivers({ user }) {
  const [drivers, setDrivers] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ambulanceId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [driversRes, ambulancesRes] = await Promise.all([
        axios.get('/drivers'),
        axios.get('/ambulances')
      ]);
      setDrivers(driversRes.data.drivers || []);
      setAmbulances(ambulancesRes.data.ambulances || []);
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await axios.put(`/drivers/${editingDriver._id}`, formData);
      } else {
        await axios.post('/drivers', formData);
      }
      setShowForm(false);
      setEditingDriver(null);
      setFormData({ name: '', email: '', ambulanceId: '' });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      email: driver.email,
      ambulanceId: driver.ambulanceId?._id || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        await axios.delete(`/drivers/${driverId}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete driver');
      }
    }
  };

  const handleToggleStatus = async (driverId) => {
    try {
      await axios.patch(`/drivers/${driverId}/status`);
      fetchData();
    } catch (error) {
      setError('Failed to update driver status');
    }
  };

  if (loading) return <div>Loading drivers...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Driver Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setShowForm(true);
            setEditingDriver(null);
            setFormData({ name: '', email: '', ambulanceId: '' });
          }}
        >
          Add New Driver
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card">
          <h3>{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Assigned Ambulance:</label>
              <select
                value={formData.ambulanceId}
                onChange={(e) => setFormData({ ...formData, ambulanceId: e.target.value })}
              >
                <option value="">No Ambulance Assigned</option>
                {ambulances.map((ambulance) => (
                  <option key={ambulance._id} value={ambulance._id}>
                    {ambulance.plateNumber} - {ambulance.status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                {editingDriver ? 'Update Driver' : 'Add Driver'}
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => {
                  setShowForm(false);
                  setEditingDriver(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Drivers List</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Assigned Ambulance</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver._id}>
                <td>{driver.name}</td>
                <td>{driver.email}</td>
                <td>
                  <span style={{ 
                    color: driver.status === 'online' ? 'green' : 
                           driver.status === 'offline' ? 'orange' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {driver.status}
                  </span>
                </td>
                <td>
                  {driver.ambulanceId ? (
                    `${driver.ambulanceId.plateNumber} (${driver.ambulanceId.status})`
                  ) : (
                    'No Ambulance Assigned'
                  )}
                </td>
                <td>{new Date(driver.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-warning" 
                    onClick={() => handleEdit(driver)}
                    style={{ margin: '2px' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleToggleStatus(driver._id)}
                    style={{ margin: '2px' }}
                  >
                    Toggle Status
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(driver._id)}
                    style={{ margin: '2px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {drivers.length === 0 && <p>No drivers found.</p>}
      </div>
    </div>
  );
}

export default Drivers;
