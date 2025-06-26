import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    username: '',
    email: '',
    address: '',
    password: '',
    role_id: '102',
  });
  const [newPassword, setNewPassword] = useState('');
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const mapRoleIdToLabel = (role_id) => {
    switch (role_id) {
      case 101: return 'admin';
      case 102: return 'user';
      case 103: return 'store';
      default: return 'unknown';
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
      fetchUsers();
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.users;
      setUsers(data.filter((u) => u.role_id !== 103));
      setStores(data.filter((u) => u.role_id === 103));
    } catch (err) {
      console.error('User fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const validateForm = () => {
    const { username, email, password, address } = form;
    if (username.length < 20 || username.length > 60) return 'Name must be between 20 and 60 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(password)) return 'Password must be 8-16 chars with uppercase & special char';
    if (address.length > 400) return 'Address too long (max 400 chars)';
    return null;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return alert(validationError);
    try {
      await axios.post('http://localhost:3000/admin/add-user', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('User added successfully');
      setForm({ username: '', email: '', address: '', password: '', role_id: '102' });
      fetchDashboard();
    } catch (err) {
      console.error('Add user error:', err);
      alert('Failed to add user');
    }
  };

  const handlePasswordUpdate = async () => {
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/.test(newPassword)) {
      return alert('Password must be 8–16 characters with uppercase & special character');
    }
    try {
      await axios.put(
        'http://localhost:3000/admin/update-password',
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Password updated!');
      setNewPassword('');
    } catch {
      alert('Password update failed');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const valA = (a[sortConfig.key] || '').toString().toLowerCase();
      const valB = (b[sortConfig.key] || '').toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const filteredUsers = getSortedData(users).filter((u) =>
    u.username.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    u.address.toLowerCase().includes(filter.toLowerCase()) ||
    mapRoleIdToLabel(u.role_id).includes(filter.toLowerCase())
  );

  const filteredStores = getSortedData(stores).filter((u) =>
    u.username.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    u.address.toLowerCase().includes(filter.toLowerCase())
  );

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-red-600">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-600">Total Users</h2>
          <p className="text-xl font-bold text-blue-700">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-600">Total Stores</h2>
          <p className="text-xl font-bold text-green-700">{stats.totalStores}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-gray-600">Total Ratings</h2>
          <p className="text-xl font-bold text-yellow-700">{stats.totalRatings}</p>
        </div>
      </div>

      {/* Password Update */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h2 className="text-lg font-semibold mb-2">Update Password</h2>
        <div className="flex gap-4">
          <input
            type="password"
            placeholder="New password"
            className="border p-2 w-64"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handlePasswordUpdate}
          >
            Update
          </button>
        </div>
      </div>

      {/* Add User */}
      <div className="bg-white p-6 shadow rounded mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-4">
          <input className="border p-2" placeholder="Name" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="border p-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input className="border p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select className="border p-2" value={form.role_id} onChange={(e) => setForm({ ...form, role_id: e.target.value })}>
            <option value="102">Normal User</option>
            <option value="103">Store Owner</option>
            <option value="101">Admin</option>
          </select>
          <button className="bg-blue-600 text-white py-2 rounded">Add User</button>
        </form>
      </div>

      {/* Search Filter */}
      <input className="w-full p-2 border rounded mb-3" placeholder="Search by name, email, address, role" value={filter} onChange={(e) => setFilter(e.target.value)} />

      {/* Users Table */}
      <h2 className="text-lg font-semibold mb-2">Users (Admin & Normal)</h2>
      <table className="w-full bg-white border mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('username')}>Name {renderSortArrow('username')}</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('email')}>Email {renderSortArrow('email')}</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('address')}>Address {renderSortArrow('address')}</th>
            <th className="p-2 border">Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, idx) => (
            <tr key={idx} className="text-sm">
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.address}</td>
              <td className="border p-2">{mapRoleIdToLabel(u.role_id)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stores Table */}
      <h2 className="text-lg font-semibold mb-2">Store Owners</h2>
      <table className="w-full bg-white border">
        <thead className="bg-green-100">
          <tr>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('username')}>Name {renderSortArrow('username')}</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('email')}>Email {renderSortArrow('email')}</th>
            <th className="p-2 border cursor-pointer" onClick={() => handleSort('address')}>Address {renderSortArrow('address')}</th>
            <th className="p-2 border">Rating</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((u, idx) => (
            <tr key={idx} className="text-sm">
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.address}</td>
              <td className="border p-2">{u.average_rating ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminHome;
