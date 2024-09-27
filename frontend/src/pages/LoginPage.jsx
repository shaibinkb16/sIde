import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/login.css';
import loginImage from "../assets/login.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle Google OAuth token
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axios.get('/api/user/me')
        .then(response => {
          const { username, email } = response.data;
          localStorage.setItem('username', username);
          localStorage.setItem('email', email);

          setSuccessMessage('Login successful! Redirecting to IDE...');
          setTimeout(() => {
            navigate('/ide');
          }, 2000);
        })
        .catch(err => {
          console.error('Error fetching user profile:', err);
          setError('Failed to fetch user profile. Please try again.');
        });
    }
  }, [location.search, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/login', formData);
      const token = response.data.token;

      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const profileResponse = await axios.get('/api/user/me');
        const { username, email } = profileResponse.data;

        localStorage.setItem('username', username);
        localStorage.setItem('email', email);

        setSuccessMessage('Login successful! Redirecting to IDE...');
        setTimeout(() => {
          navigate('/ide');
        }, 2000);
      } else {
        setError('Token not received. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = '/api/auth/google'; // Redirect to Google OAuth route
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-white">
      <div className="login-container p-8 bg-gray-800 bg-opacity-20 backdrop-blur-sm rounded-3xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src={loginImage} alt="Logo" className="w-16 h-16 rounded-full" />
        </div>
        <h1 className="text-white text-3xl font-bold mb-2 text-center">Login</h1>
        <p className="text-gray-400 text-sm mb-4 text-center">Please enter your credentials to access your account</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-400 text-sm mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white rounded px-3 py-2 w-full"
              aria-label="Email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-400 text-sm mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white rounded px-3 py-2 w-full"
              aria-label="Password"
            />
          </div>
          <button
            type="submit"
            className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <div className="my-4">
          <button
            onClick={handleGoogleSignIn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px" height="25px">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-4 text-center">
          By logging in, you agree to our <a href="#" className="text-red-500 hover:text-red-600">Terms of Service</a>.
        </p>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Don't have an account? <a href="/register" className="text-red-500 hover:text-red-600">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
