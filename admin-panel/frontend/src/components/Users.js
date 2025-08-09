import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`/users/${editingUser._id}`, formData);
      } else {
        await axios.post('/auth/register', formData);
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'User', status: 'active' });
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(`/users/${userId}/status`);
      fetchUsers();
    } catch (error) {
      setError('Failed to update user status');
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>User Management</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setShowForm(true);
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'User', status: 'active' });
          }}
        >
          Add New User
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card">
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
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
              <label>Role:</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="User">User</option>
                <option value="Manager">Manager</option>
                <option value="SuperAdmin">SuperAdmin</option>
                <option value="HelplineOperator">Helpline Operator</option>
                <option value="Dispatcher">Dispatcher</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status:</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <button type="submit" className="btn btn-primary">
                {editingUser ? 'Update User' : 'Add User'}
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3>Users List</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span style={{ 
                    color: user.status === 'active' ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn btn-warning" 
                    onClick={() => handleEdit(user)}
                    style={{ margin: '2px' }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleToggleStatus(user._id, user.status)}
                    style={{ margin: '2px' }}
                  >
                    {user.status === 'active' ? 'Block' : 'Unblock'}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    onClick={() => handleDelete(user._id)}
                    style={{ margin: '2px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p>No users found.</p>}
      </div>
    </div>
  );
}

export default Users;
