import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StoreHome = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [storeInfo, setStoreInfo] = useState({ username: '', address: '' });
  const [updatedPassword, setUpdatedPassword] = useState('');
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('storage')); // sync with App.jsx
    navigate('/');
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.put('http://localhost:3000/auth/update-password', {
        newPassword: updatedPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Password updated successfully');
      setUpdatedPassword('');
    } catch {
      alert('Error updating password');
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/store/ratings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRatings(res.data.ratings);
      setAverageRating(res.data.average);
    } catch {
      setError('Failed to load ratings');
    }
  };

  const fetchStoreInfo = async () => {
    try {
      const res = await axios.get('http://localhost:3000/auth/home', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStoreInfo({
        username: res.data.user.username,
        address: res.data.user.address,
      });
    } catch {
      setStoreInfo({ username: '', address: '' });
    }
  };

  useEffect(() => {
    fetchStoreInfo();
    fetchRatings();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRatings = [...ratings].sort((a, b) => {
    const valA = a[sortConfig.key]?.toString().toLowerCase();
    const valB = b[sortConfig.key]?.toString().toLowerCase();
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="h-screen w-full bg-green-50">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold text-green-700">Store Owner Dashboard</h2>

        <div className="text-right font-bold animate-pulse text-green-700">
          <p>{storeInfo.username}</p>
          <p className="text-sm text-green-500">{storeInfo.address}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded-md shadow-sm"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Password Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Update Password</h3>
          <input
            type="password"
            value={updatedPassword}
            onChange={(e) => setUpdatedPassword(e.target.value)}
            placeholder="Enter new password"
            className="border px-3 py-2 rounded w-64 mr-2"
          />
          <button
            onClick={handlePasswordUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>

        {/* Ratings Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Store Ratings</h3>
          {error && <p className="text-red-500">{error}</p>}
          <p className="mb-3 text-green-700 font-medium">
            Average Rating: {averageRating || 'N/A'}
          </p>

          <div className="overflow-x-auto shadow rounded">
            <table className="min-w-full border border-green-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="p-3 text-left border cursor-pointer" onClick={() => handleSort('username')}>Name</th>
                  <th className="p-3 text-left border cursor-pointer" onClick={() => handleSort('email')}>Email</th>
                  <th className="p-3 text-center border cursor-pointer" onClick={() => handleSort('rating')}>Rating</th>
                  <th className="p-3 text-left border cursor-pointer" onClick={() => handleSort('comment')}>Comment</th>
                </tr>
              </thead>
              <tbody>
                {sortedRatings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No ratings yet.
                    </td>
                  </tr>
                ) : (
                  sortedRatings.map((r) => (
                    <tr key={r.id} className="bg-white border-b hover:bg-green-50">
                      <td className="p-3 border">{r.username}</td>
                      <td className="p-3 border">{r.email}</td>
                      <td className="p-3 text-center border">{r.rating}</td>
                      <td className="p-3 border">{r.comment?.trim() || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreHome;
