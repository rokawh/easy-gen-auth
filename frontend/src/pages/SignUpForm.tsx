import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import easyGeneratorLogo from '@assets/easy-generator-logo.svg';
import { useAuth } from '@hooks/useAuth';

import { ApiError } from '@/types/api';

const COMPANY_SIZES = [
  '1-99 employees',
  '100-499 employees',
  '500-999 employees',
  '1000+ employees',
];

const COUNTRY_CODES = [
  { code: '+1', flag: '🇺🇸', name: 'USA' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+33', flag: '🇫🇷', name: 'France' },
  { code: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+32', flag: '🇧🇪', name: 'Belgium' },
  { code: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: '+48', flag: '🇵🇱', name: 'Poland' },
  { code: '+43', flag: '🇦🇹', name: 'Austria' },
  { code: '+420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+353', flag: '🇮🇪', name: 'Ireland' },
  { code: '+30', flag: '🇬🇷', name: 'Greece' },
  { code: '+36', flag: '🇭🇺', name: 'Hungary' },
  { code: '+7', flag: '🇷🇺', name: 'Russia' },
  { code: '+86', flag: '🇨🇳', name: 'China' },
  { code: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: '+82', flag: '🇰🇷', name: 'South Korea' },
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+972', flag: '🇮🇱', name: 'Israel' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
].sort((a, b) => a.name.localeCompare(b.name));

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
    agreeToMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'bg-gray-200',
  });

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let message = '';
    let color = 'bg-gray-200';

    if (password.length >= 8) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    if (password.length >= 12) score++;

    switch (score) {
      case 0:
        message = 'Very weak';
        color = 'bg-red-500';
        break;
      case 1:
        message = 'Weak';
        color = 'bg-red-400';
        break;
      case 2:
        message = 'Fair';
        color = 'bg-yellow-500';
        break;
      case 3:
        message = 'Good';
        color = 'bg-green-400';
        break;
      case 4:
      case 5:
        message = 'Strong';
        color = 'bg-green-500';
        break;
    }

    return { score, message, color };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Enter a valid e-mail';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid e-mail';
    }

    if (!formData.name) {
      newErrors.name = 'Full name should include your first and last names';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Full name should include your first and last names';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (
      !/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}/.test(
        formData.password
      )
    ) {
      newErrors.password =
        'Password must contain at least one letter, one number, and one special character';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!formData.agreeToEula) {
      newErrors.agreeToEula = 'You must agree to the EULA to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await signup(formData);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setErrors({
        submit:
          apiError.response?.data?.message || 'An error occurred during sign up',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex h-screen'>
      {/* Left Section */}
      <div className='w-[60%] flex flex-col bg-white'>
        {/* Header */}
        <div className='sticky top-0 z-10 w-full flex justify-between items-center py-6 px-8 border-b border-gray-100 bg-white'>
          <img
            src={easyGeneratorLogo}
            alt='Easy Generator'
            className='h-12'
          />
          <div className='flex items-center gap-3'>
            <span className='text-sm text-gray-600'>
              Already have an account?
            </span>
            <Link
              to='/login'
              className='btn-primary bg-transparent border border-gray-200 text-gray-900 hover:bg-gray-50'
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className='flex-1 overflow-y-auto px-8 py-6'>
          <div className='max-w-[400px] mx-auto'>
            <div>
              <h1 className='text-[32px] font-light text-gray-900 mb-8'>
                Start creating courses now
              </h1>
            </div>

            <form
              className='space-y-6'
              onSubmit={handleSubmit}
              noValidate
            >
              <div className='space-y-5'>
                <div>
                  <label
                    htmlFor='email'
                    className='block text-sm font-medium text-gray-700 mb-1.5'
                  >
                    Business email
                  </label>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className={`input-field ${errors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className='error-message'>{errors.email}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='name'
                    className='block text-sm font-medium text-gray-700 mb-1.5'
                  >
                    Full name
                  </label>
                  <input
                    id='name'
                    name='name'
                    type='text'
                    autoComplete='name'
                    required
                    className={`input-field ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className='error-message'>{errors.name}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700 mb-1.5'
                  >
                    Password
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='new-password'
                      required
                      className={`input-field ${
                        errors.password ? 'error' : ''
                      }`}
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      pattern='^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$'
                      title='Password must be at least 8 characters long and contain at least one letter, one number, and one special character'
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                          />
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                          />
                        </svg>
                      ) : (
                        <svg
                          className='h-5 w-5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formData.password && (
                    <div className='mt-2'>
                      <div className='flex items-center justify-between mb-1'>
                        <div className='text-sm text-gray-600'>
                          Password strength:
                        </div>
                        <div
                          className='text-sm font-medium'
                          style={{
                            color: passwordStrength.color.replace(
                              'bg-',
                              'text-'
                            ),
                          }}
                        >
                          {passwordStrength.message}
                        </div>
                      </div>
                      <div className='h-1 w-full bg-gray-200 rounded-full overflow-hidden'>
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <div className='error-message mt-2'>{errors.password}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='phoneNumber'
                    className='block text-sm font-medium text-gray-700 mb-1.5'
                  >
                    Phone number
                  </label>
                  <div className='mt-1 flex gap-2'>
                    <div className='relative'>
                      <select
                        name='countryCode'
                        value={formData.countryCode}
                        onChange={handleChange}
                        className={`appearance-none w-[120px] px-3 py-2 border ${
                          errors.phoneNumber
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-8`}
                      >
                        {COUNTRY_CODES.map((country) => (
                          <option
                            key={country.code}
                            value={country.code}
                          >
                            {country.flag} {country.code}
                          </option>
                        ))}
                      </select>
                      <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                        <svg
                          className='h-4 w-4 fill-current'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                        >
                          <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
                        </svg>
                      </div>
                    </div>
                    <input
                      id='phoneNumber'
                      name='phoneNumber'
                      type='tel'
                      className={`input-field ${
                        errors.phoneNumber ? 'error' : ''
                      }`}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder='Enter phone number'
                    />
                  </div>
                  {errors.phoneNumber && (
                    <div className='error-message'>{errors.phoneNumber}</div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='companySize'
                    className='block text-sm font-medium text-gray-700 mb-1.5'
                  >
                    Company size
                  </label>
                  <div className='relative'>
                    <select
                      id='companySize'
                      name='companySize'
                      value={formData.companySize}
                      onChange={handleChange}
                      className='appearance-none w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors pr-8'
                    >
                      {COMPANY_SIZES.map((size) => (
                        <option
                          key={size}
                          value={size}
                        >
                          {size}
                        </option>
                      ))}
                    </select>
                    <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
                      <svg
                        className='h-4 w-4 fill-current'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                      >
                        <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className='space-y-4'>
                <div className='flex items-start'>
                  <input
                    id='agreeToEula'
                    name='agreeToEula'
                    type='checkbox'
                    className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors'
                    checked={formData.agreeToEula}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor='agreeToEula'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    I agree to Easygenerator's{' '}
                    <span className='text-green-600 hover:text-green-700 transition-colors'>
                      End User License Agreement (EULA)
                    </span>
                  </label>
                </div>
                {errors.agreeToEula && (
                  <div className='error-message'>{errors.agreeToEula}</div>
                )}

                <div className='flex items-start'>
                  <input
                    id='agreeToMarketing'
                    name='agreeToMarketing'
                    type='checkbox'
                    className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors'
                    checked={formData.agreeToMarketing}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor='agreeToMarketing'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    I'm interested in receiving product updates and e-learning
                    tips
                  </label>
                </div>
              </div>

              {errors.submit && (
                <div className='error-message'>{errors.submit}</div>
              )}

              <button
                type='submit'
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:-translate-y-0.5 transition-all duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </form>

            {/* Footer */}
            <div className='mt-8 space-y-4'>
              <div className='flex items-center justify-center text-sm text-gray-500'>
                <svg
                  className='h-5 w-5 mr-2 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
                Easygenerator stores your data in the European Union
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className='w-[40%] bg-green-500 p-12 relative'>
        <div className='relative z-10 h-full flex flex-col justify-center text-white space-y-8'>
          <div className='text-[32px] font-light leading-[1.3]'>
            "User interface and course creation is straight forward, meaning
            courses can be created with minimal training required."
          </div>
          <div className='flex items-center space-x-4'>
            <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden'>
              <span className='text-green-500 font-bold'>S</span>
            </div>
            <div>
              <div className='font-medium'>Scott Morris</div>
              <div className='text-sm text-white/90'>
                Operations Manager, Kantar
              </div>
            </div>
          </div>
          <div className='flex space-x-2'>
            <div className='w-8 h-1 bg-white/50 rounded-full'></div>
            <div className='w-8 h-1 bg-white rounded-full'></div>
            <div className='w-8 h-1 bg-white/50 rounded-full'></div>
          </div>
        </div>
        <div className='absolute inset-0 opacity-10'>
          <svg
            className='w-full h-full'
            viewBox='0 0 400 400'
            xmlns='http://www.w3.org/2000/svg'
            preserveAspectRatio='none'
          >
            <path
              d='M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z'
              fill='white'
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};
