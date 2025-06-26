import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StoreRegister = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    address: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors = {};

    if (values.username.length < 20 || values.username.length > 60) {
      newErrors.username = 'Name must be between 20 and 60 characters.';
    }

    if (values.address.length > 400) {
      newErrors.address = 'Address must be 400 characters or less.';
    }

    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(values.password)) {
      newErrors.password = 'Password must be 8-16 characters, include one uppercase and one special character.';
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(values.email)) {
      newErrors.email = 'Invalid email format.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setServerError('');
  setSuccessMessage('');

  if (!validate()) return;

  try {
    const response = await axios.post('http://localhost:3000/auth/register', {
      ...values,
      role_id: 103 // Store Owner for roledb
    });

    if (response.status === 201 || response.status === 301) {
      setSuccessMessage('Store registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/store-login');
      }, 2000);
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 409) {
        setServerError(err.response.data?.message || 'Email already exists.');
      } else if (err.response.status === 400) {
        setServerError(err.response.data?.message || 'Validation failed.');
      } else {
        setServerError(err.response.data?.message || 'Unexpected server error.');
      }
    } else {
      setServerError('Network error or server not reachable.');
    }
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="shadow-lg px-8 py-6 border bg-white w-96 rounded-md">
        <h2 className="text-xl font-bold mb-4 text-green-600 text-center">Store Owner Register</h2>

        {serverError && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {serverError}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-800 rounded">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Name</label>
            <input
              type="text"
              name="username"
              placeholder="Enter Name"
              className="w-full px-3 py-2 border rounded"
              onChange={handleChanges}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">Address</label>
            <textarea
              name="address"
              placeholder="Enter Address"
              className="w-full px-3 py-2 border rounded"
              onChange={handleChanges}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="w-full px-3 py-2 border rounded"
              onChange={handleChanges}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="w-full px-3 py-2 border rounded"
              onChange={handleChanges}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow-sm transition"
          >
            Submit
          </button>
        </form>

        <div className="text-center mt-4">
          <span>Already registered? </span>
          <button
            onClick={() => navigate('/store-login')}
            className="text-green-600 hover:underline font-medium"
          >
            Store Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreRegister;
