import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSumbit = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const response = await axios.post('http://localhost:3000/auth/login', values)
      if (response.status === 201) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        if (response.data.role === 'admin') {
          navigate('/homeAdmin');
        } else if (response.data.role === 'store') {
          navigate('/homeStore');
        } else {
          navigate('/home');
        }
      }

    } catch (err) {
      if (err.response && err.response.status === 404) {
        setLoginError('User not found. Please check your email.')
      } else if (err.response && err.response.status === 401) {
        setLoginError('Incorrect password. Please try again.')
      } else {
        setLoginError('Login failed. Please try again later.')
      }
      console.log(err.message)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='shadow-lg px-8 py-5 border w-72'>
        <h2 className='text-lg font-bold mb-4'>Login</h2>

        {loginError && (
          <div className='mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded'>
            {loginError}
          </div>
        )}

        <form onSubmit={handleSumbit}>
          <div className="mb-4">
            <label htmlFor="email" className='block text-gray-700'>Email</label>
            <input type="email" placeholder='Enter Email' className='w-full px-3 py-2 border' name="email" onChange={handleChanges} />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className='block text-gray-700'>Password</label>
            <input type="password" placeholder='Enter Password' className='w-full px-3 py-2 border' name="password" onChange={handleChanges} />
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md shadow-sm transition">Submit</button>
        </form>
        <div className="text-center">
          <span>Don't Have Account?</span>
          <Link to='/register' className='text-blue-500'>Signup</Link>
        </div>
      </div>
    </div>
  )
}

export default Login