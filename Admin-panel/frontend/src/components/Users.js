import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'User', status: 'active' });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      setError('Failed to fetch users');
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) await axios.put(`/users/${editingUser._id}`, formData);
      else await axios.post('/users', formData);
      setShowForm(false); setEditingUser(null);
      setFormData({ name: '', email: '', role: 'User', status: 'active' });
      fetchUsers();
    } catch (error) { setError(error.response?.data?.error || 'Operation failed'); }
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, role: u.role, status: u.status });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try { await axios.delete(`/users/${userId}`); fetchUsers(); } catch { setError('Failed to delete user'); }
  };

  const handleToggleStatus = async (userId) => {
    try { await axios.patch(`/users/${userId}/status`); fetchUsers(); } catch { setError('Failed to update user status'); }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1 className="page-title">User Management</h1>
        <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingUser(null); setFormData({ name: '', email: '', role: 'User', status: 'active' }); }}>Add New User</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card">
          <h3 className="section-title">{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid">
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                  <option value="HelplineOperator">Helpline Operator</option>
                  <option value="Dispatcher">Dispatcher</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">{editingUser ? 'Update' : 'Create'}</button>
              <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditingUser(null); }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="section-title">Users List</h3>
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
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className="badge badge-info">{u.role}</span></td>
                <td>
                  <span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {u.status}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btn btn-outline" onClick={() => handleEdit(u)}>Edit</button>
                    <button className="btn btn-success" onClick={() => handleToggleStatus(u._id)}>
                      {u.status === 'active' ? 'Block' : 'Unblock'}
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(u._id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={{ color: '#6b7280' }}>No users found.</p>}
      </div>
    </div>
  );
}

export default Users;
