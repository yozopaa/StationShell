import { Link, useNavigate } from "react-router-dom";
import { authService } from "../service/api";
import React, { useState } from 'react';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    let validationErrors = [];

    // Client-side password validations
    if (trimmedPassword.length < 8) {
      validationErrors.push('Password must be at least 8 characters long');
    }
    if (!/\d/.test(trimmedPassword)) {
      validationErrors.push('Password must contain at least one number');
    }
    const localPart = trimmedEmail.split('@')[0];
    if (trimmedPassword.toLowerCase().includes(localPart.toLowerCase())) {
      validationErrors.push('Password should not contain your email username');
    }

    // If there are validation errors, display them and stop submission
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Proceed with server-side registration
    try {
      await authService.register(trimmedEmail, trimmedPassword);
      console.log("Register success");
      navigate('/login');
    } catch (err) {
      setErrors([err.response?.data?.message || 'Registration failed']);
      console.error(err);
    }
  };

  return (
    <div className="bg-red-900 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Dashboard</h1>
        {errors.length > 0 && (
          <ul className="text-red-600 text-center mb-4">
            {errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-900 text-white font-medium rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Register
          </button>
          <Link to={'/login'} className="block text-center underline text-gray-700 mt-2">
            <h6>Compte déjà existant ?</h6>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;