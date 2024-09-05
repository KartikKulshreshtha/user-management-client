import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('https://user-management-server-opiw.onrender.com/api/auth/login', { username, password });
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error.response.data.error);
      }
    };
  
    return (
      <div className="flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl mb-4">Login</h2>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-4"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Login
          </button>
          <br />
          <Link to="/signup">Singup</Link>
        </form>
      </div>
    );
  };


export default Login;