import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import easyGeneratorLogo from '../assets/easy-generator-logo.svg';

const COMPANY_SIZES = [
  '1-99 employees',
  '100-499 employees',
  '500-999 employees',
  '1000+ employees'
];

export const SignUpForm: React.FC = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    phoneNumber: '',
    countryCode: '+20',
    companySize: '1-99 employees',
    agreeToEula: false,
    agreeToMarketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter, one number, and one special character';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.agreeToEula) {
      newErrors.agreeToEula = 'You must agree to the EULA to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup(formData);
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || 'An error occurred during sign up'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="w-full flex justify-between items-center p-6">
          <img src={easyGeneratorLogo} alt="Easy Generator" className="h-10" />
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Already have an account?</span>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-900 hover:bg-gray-50"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-4 pb-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Start creating courses now
              </h1>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Business email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`block w-full px-3 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {showPassword ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1 flex">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="block w-24 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="+20">🇪🇬 +20</option>
                    {/* Add more country codes as needed */}
                  </select>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    className={`ml-2 flex-1 block w-full px-3 py-2 border ${
                      errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                  Company size
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  {COMPANY_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    id="agreeToEula"
                    name="agreeToEula"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    checked={formData.agreeToEula}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeToEula" className="ml-2 block text-sm text-gray-700">
                    I agree to Easygenerator's{' '}
                    <Link to="/eula" className="text-blue-600 hover:text-blue-500">
                      End User License Agreement (EULA)
                    </Link>
                  </label>
                </div>
                {errors.agreeToEula && (
                  <p className="text-sm text-red-600">{errors.agreeToEula}</p>
                )}

                <div className="flex items-start">
                  <input
                    id="agreeToMarketing"
                    name="agreeToMarketing"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    checked={formData.agreeToMarketing}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeToMarketing" className="ml-2 block text-sm text-gray-700">
                    I'm interested in receiving product updates and e-learning tips
                  </label>
                </div>
              </div>

              {errors.submit && (
                <div className="rounded-lg bg-red-50 p-4">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-center text-sm text-gray-500">
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Easygenerator stores your data in the European Union
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Testimonials */}
      <div className="hidden lg:block w-[40%] bg-green-500 p-12 relative overflow-hidden">
        <div className="relative z-10 h-full flex flex-col justify-center text-white space-y-8">
          <div className="text-4xl font-light leading-tight">
            "User interface and course creation is straight forward, meaning courses can be created with minimal training required."
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-500 font-bold">K</span>
              </div>
              <div>
                <div className="font-semibold">Scott Morris</div>
                <div className="text-sm opacity-90">Operations Manager, Kantar</div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-1 bg-white rounded-full opacity-50"></div>
            <div className="w-8 h-1 bg-white rounded-full"></div>
            <div className="w-8 h-1 bg-white rounded-full opacity-50"></div>
          </div>
        </div>
        {/* Background wave effect */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" fill="white"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}; 