import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const role_id = 101; // Admin role ID for roledb
      const res = await axios.post('http://localhost:3000/admin/register', {
        username,
        email,
        password,
        address,
        role_id,
      });

      if (res.status === 201) {
        alert('Admin registered successfully!');
        navigate('/admin-login');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError('User with this email already exists.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Validation failed.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="shadow-lg px-8 py-6 border w-96 bg-white rounded">
        <h2 className="text-xl font-bold mb-4 text-red-600">Admin Register</h2>

        {error && <div className="text-red-500 mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name (20–60 characters)"
            className="w-full mb-3 px-3 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address (max 400 characters)"
            className="w-full mb-3 px-3 py-2 border rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (8–16 chars, 1 uppercase & special)"
            className="w-full mb-4 px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/admin-login" className="text-red-600 font-medium hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
