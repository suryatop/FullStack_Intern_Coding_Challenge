import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Lobby = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <Logo />
      <div className="mt-10 space-y-4">
        <button
          onClick={() => navigate('/admin-login')}
          className="w-60 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow"
        >
          Admin Login
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-60 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition shadow"
        >
          Normal User Login
        </button>
        <button
          onClick={() => navigate('/store-login')}
          className="w-60 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition shadow"
        >
          Store Owner Login
        </button>
      </div>
    </div>
  );
};

export default Lobby;
