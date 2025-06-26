import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Lobby from './pages/Lobby';
import Login from './pages/Login';
import Register from './pages/Register';
import StoreRegister from './pages/StoreRegister';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister'; 
import StoreLogin from './pages/StoreLogin';
import Home from './pages/Home';
import HomeStore from './pages/StoreHome';
import HomeAdmin from './pages/AdminHome';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const syncStorage = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
    };
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  const getRedirectPage = () => {
    if (!token) return <Lobby />;
    if (role === 'admin') return <Navigate to="/homeAdmin" />;
    if (role === 'store') return <Navigate to="/homeStore" />;
    return <Navigate to="/home" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={getRedirectPage()} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/store-register" element={<StoreRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} /> 
        <Route path="/store-login" element={<StoreLogin />} />

        <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/homeAdmin" element={<PrivateRoute><HomeAdmin /></PrivateRoute>} />
        <Route path="/homeStore" element={<PrivateRoute><HomeStore /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
