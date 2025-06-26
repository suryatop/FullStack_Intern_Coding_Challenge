import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // null: loading, true/false: result

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/auth/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (err) {
        console.log('Token expired or invalid:', err.message);
        localStorage.removeItem('token');
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) {
    return <div className="text-center mt-20 text-blue-500 text-lg">Checking session...</div>;
  }

  return isValid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
