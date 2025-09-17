import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Ambulances({ user }) {
  const [ambulances, setAmbulances] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAmbulance, setEditingAmbulance] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: '',
    driverId: '',
    currentLocation: {
      type: 'Point',
      coordinates: [0, 0]
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ambulancesRes, driversRes] = await Promise.all([
        axios.get('/ambulances'),
        axios.get('/drivers')
      ]);
      setAmbulances(ambulancesRes.data.ambulances || []);
      setDrivers(driversRes.data.drivers || []);
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
      if (editingAmbulance) {
        await axios.put(`/ambulances/${editingAmbulance._id}`, formData);
      } else {
        await axios.post('/ambulances', formData);
      }
      setShowForm(false);
      setEditingAmbulance(null);
      setFormData({
        plateNumber: '',
        driverId: '',
        currentLocation: {
          type: 'Point',
          coordinates: [0, 0]
        }
      });
      fetchData();
    } catch (error) {
      setError(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (ambulance) => {
    setEditingAmbulance(ambulance);
    setFormData({
      plateNumber: ambulance.plateNumber,
      driverId: ambulance.driverId?._id || '',
      currentLocation: ambulance.currentLocation || {
        type: 'Point',
        coordinates: [0, 0]
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (ambulanceId) => {
    if (window.confirm('Are you sure you want to delete this ambulance?')) {
      try {
        await axios.delete(`/ambulances/${ambulanceId}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete ambulance');
      }
    }
  };

  const handleUpdateLocation = async (ambulanceId) => {
    const longitude = prompt('Enter longitude:');
    const latitude = prompt('Enter latitude:');
    
    if (longitude && latitude) {
      try {
        await axios.patch(`/ambulances/${ambulanceId}/location`, {
          currentLocation: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          }
        });
        fetchData();
      } catch (error) {
        setError('Failed to update location');
      }
    }
  };

  if (loading) return <div>Loading ambulances...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Ambulance Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setShowForm(true);
            setEditingAmbulance(null);
            setFormData({
              plateNumber: '',
              driverId: '',
              currentLocation: {
                type: 'Point',
                coordinates: [0, 0]
              }
            });
          }}
        >
          Add New Ambulance
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card">
          <h3>{editingAmbulance ? 'Edit Ambulance' : 'Add New Ambulance'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Plate Number:</label>
              <input
                type="text"
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Assigned Driver:</label>
              <select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
              >
                <option value="">No Driver Assigned</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name} - {driver.status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                {editingAmbulance ? 'Update Ambulance' : 'Add Ambulance'}
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => {
                  setShowForm(false);
                  setEditingAmbulance(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Ambulances List</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Plate Number</th>
              <th>Status</th>
              <th>Assigned Driver</th>
              <th>Location</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ambulances.map((ambulance) => (
              <tr key={ambulance._id}>
                <td>{ambulance.plateNumber}</td>
                <td>
                  <span style={{ 
                    color: ambulance.status === 'available' ? 'green' : 
                           ambulance.status === 'busy' ? 'orange' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {ambulance.status}
                  </span>
                </td>
                <td>
                  {ambulance.driverId ? (
                    `${ambulance.driverId.name} (${ambulance.driverId.status})`
                  ) : (
                    'No Driver Assigned'
                  )}
                </td>
                <td>
                  {ambulance.currentLocation?.coordinates ? (
                    `${ambulance.currentLocation.coordinates[1].toFixed(4)}, ${ambulance.currentLocation.coordinates[0].toFixed(4)}`
                  ) : (
                    'No Location'
                  )}
                </td>
                <td>{new Date(ambulance.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-warning" 
                    onClick={() => handleEdit(ambulance)}
                    style={{ margin: '2px' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleUpdateLocation(ambulance._id)}
                    style={{ margin: '2px' }}
                  >
                    Update Location
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(ambulance._id)}
                    style={{ margin: '2px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ambulances.length === 0 && <p>No ambulances found.</p>}
      </div>

      <div className="card">
        <h3>Available Ambulances</h3>
        <button 
          className="btn btn-primary" 
          onClick={async () => {
            try {
              const response = await axios.get('/ambulances/available');
              alert(`Available ambulances: ${response.data.length}`);
            } catch (error) {
              setError('Failed to fetch available ambulances');
            }
          }}
        >
          Check Available Ambulances
        </button>
      </div>
    </div>
  );
}

export default Ambulances;
