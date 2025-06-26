import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const StoreLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });

      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/homeAdmin');
      } else if (role === 'store') {
        navigate('/homeStore');
      } else if (role === 'user') {
        navigate('/home');
      } else {
        setError('Unauthorized role.');
      }
    } catch (err) {
      setError('Login failed. Check credentials.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="shadow-lg px-8 py-5 border w-80">
        <h2 className="text-xl font-bold mb-4 text-green-600">Store Owner Login</h2>

        {error && <div className="text-red-500 mb-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 px-3 py-2 border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 px-3 py-2 border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">Login</button>
        </form>

        <div className="text-center mt-2">
          <span>Don’t have an account? </span>
          <Link to="/store-register" className="text-green-600 font-medium">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default StoreLogin;
