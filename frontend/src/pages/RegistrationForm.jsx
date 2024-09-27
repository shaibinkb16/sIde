import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import registrationImage from "../assets/customer.png"; // Update with your actual image path

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    setSuccessMessage(''); // Clear previous success message

    try {
      const response = await axios.post('/api/register', formData);
      console.log(response.data.message);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // Replace '/login' with your login page route
      }, 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError('Failed to register user');
      }
      console.error('Error registering user:', error.message);
    }
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-white">
      <div className="container p-8 bg-gray-800 rounded-3xl  shadow-lg  w-[450px]  bg-opacity-20 backdrop-blur-sm ">
        <div className="flex justify-center mb-4">
          <img src={registrationImage} alt="Logo" className="w-12 h-12 rounded-full" />
        </div>
        <h1 className="text-white text-2xl font-bold mb-2 text-center">Sign Up</h1>
        <p className="text-gray-400 text-sm mb-4 text-center">Create your free account 🤝</p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-400 text-sm mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-gray-700 text-white rounded px-3 py-2 w-full"
            />
          </div>
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
            />
          </div>
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          By signing up, you agree to our <a href="#" className="text-red-500 hover:text-red-600">Terms of Service</a>.
        </p>
        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account? <a href="/login" className="text-red-500 hover:text-red-600">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;
