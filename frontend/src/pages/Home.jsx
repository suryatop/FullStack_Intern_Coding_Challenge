import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [comments, setComments] = useState({});

  const fetchStores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/store/stores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(response.data.stores);

      // Set initial comment state
      const initialComments = {};
      response.data.stores.forEach(store => {
        initialComments[store.store_id] = '';
      });
      setComments(initialComments);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  const handleRate = async (storeId, rating) => {
    try {
      const comment = comments[storeId] || '';
      await axios.post('http://localhost:3000/store/ratings', {
        store_id: storeId,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear comment input after submit
      setComments(prev => ({ ...prev, [storeId]: '' }));
      fetchStores();
    } catch (err) {
      console.error('Rating failed:', err);
    }
  };

  const handleCommentChange = (storeId, value) => {
    setComments(prev => ({ ...prev, [storeId]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.put('http://localhost:3000/auth/update-password', {
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(' Password updated!');
      setNewPassword('');
    } catch (err) {
      alert('Password update failed.');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filteredStores = stores.filter(store =>
    store.username.toLowerCase().includes(search.toLowerCase()) ||
    store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen w-full bg-gray-100 overflow-y-auto">
      {/*Top Bar */}
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <input
          type="text"
          className="px-4 py-2 border rounded w-[60%]"
          placeholder="Search by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/*Update Password */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Update Password</h2>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border px-3 py-2 rounded mr-2"
          />
          <button
            onClick={handlePasswordUpdate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>

        {/*Store List */}
        <h2 className="text-xl font-bold">Available Stores</h2>
        <div className="space-y-6">
          {filteredStores.map(store => (
            <div key={store.store_id} className="bg-white p-4 shadow rounded">
              <h3 className="font-bold text-lg">{store.username}</h3>
              <p className="text-sm text-gray-600">Address: {store.address}</p>
              <p className="text-sm text-gray-800">Overall Rating: {store.average_rating || 'N/A'}</p>
              <p className="text-sm text-gray-800">Your Rating: {store.user_rating || 'Not rated'}</p>
              <p className="text-sm text-gray-800 mb-2">Your Comment: {store.user_comment || '—'}</p>

              {/*Star Rating */}
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-2xl ${
                      store.user_rating >= star ? 'text-yellow-400' : 'text-gray-400'
                    } hover:scale-110 transition-transform`}
                    onClick={() => handleRate(store.store_id, star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/*Comment Box */}
              <textarea
                placeholder="Add or update comment..."
                className="border rounded w-full p-2 mb-2"
                rows={2}
                value={comments[store.store_id]}
                onChange={(e) => handleCommentChange(store.store_id, e.target.value)}
              />

              {/*Submit Button */}
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => handleRate(store.store_id, store.user_rating || 0)}
              >
                Submit Rating
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
