import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, Button, Alert } from '../components/common/ui';
import easyGeneratorLogo from '../assets/easy-generator-logo.svg';

interface FormData {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  countryCode: string;
  companySize: string;
  agreeToEula: boolean;
  agreeToMarketing: boolean;
}

interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
  phoneNumber?: string;
  countryCode?: string;
  companySize?: string;
  agreeToEula?: string;
  general?: string;
}

const COMPANY_SIZES = [
  '1-99 employees',
  '100-499 employees',
  '500-999 employees',
  '1,000+ employees',
];

const COUNTRY_CODES = [
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+91', country: 'India' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+39', country: 'Italy' },
  { code: '+34', country: 'Spain' },
  { code: '+31', country: 'Netherlands' },
  { code: '+46', country: 'Sweden' },
  { code: '+47', country: 'Norway' },
  { code: '+45', country: 'Denmark' },
  { code: '+358', country: 'Finland' },
  { code: '+48', country: 'Poland' },
  { code: '+7', country: 'Russia' },
  { code: '+380', country: 'Ukraine' },
];

export const SignUpForm: React.FC = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    countryCode: '+1',
    companySize: '',
    agreeToEula: false,
    agreeToMarketing: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        'Password must contain at least one letter, one number, and one special character';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone number validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    // Company size validation
    if (!formData.companySize) {
      newErrors.companySize = 'Please select your company size';
    }

    // EULA agreement validation
    if (!formData.agreeToEula) {
      newErrors.agreeToEula = 'You must agree to the Terms of Service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
    } catch (error) {
      setErrors({
        general: 'Failed to create account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <img
          className='mx-auto h-12'
          src={easyGeneratorLogo}
          alt='Easy Generator'
        />
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
          Create your account
        </h2>
        <p className='mt-2 text-center text-sm text-gray-600'>
          Already have an account?{' '}
          <Link
            to='/login'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <Card>
          {errors.general && (
            <Alert
              type='error'
              className='mb-4'
            >
              {errors.general}
            </Alert>
          )}

          <form
            className='space-y-6'
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className='mt-2 text-sm text-red-600'>{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Full name
              </label>
              <div className='mt-1'>
                <input
                  id='name'
                  name='name'
                  type='text'
                  autoComplete='name'
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className='mt-2 text-sm text-red-600'>{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <div className='mt-1'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='new-password'
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className='mt-2 text-sm text-red-600'>{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor='confirmPassword'
                className='block text-sm font-medium text-gray-700'
              >
                Confirm password
              </label>
              <div className='mt-1'>
                <input
                  id='confirmPassword'
                  name='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  required
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? 'border-red-300'
                      : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className='mt-2 text-sm text-red-600'>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor='phoneNumber'
                className='block text-sm font-medium text-gray-700'
              >
                Phone number
              </label>
              <div className='mt-1 flex rounded-md shadow-sm'>
                <select
                  id='countryCode'
                  name='countryCode'
                  className='appearance-none rounded-l-md border border-r-0 border-gray-300 bg-gray-50 py-2 pl-3 pr-8 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm'
                  value={formData.countryCode}
                  onChange={handleChange}
                >
                  {COUNTRY_CODES.map(({ code, country }) => (
                    <option
                      key={code}
                      value={code}
                    >
                      {code} ({country})
                    </option>
                  ))}
                </select>
                <input
                  type='tel'
                  name='phoneNumber'
                  id='phoneNumber'
                  className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border ${
                    errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder='1234567890'
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              {errors.phoneNumber && (
                <p className='mt-2 text-sm text-red-600'>
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='companySize'
                className='block text-sm font-medium text-gray-700'
              >
                Company size
              </label>
              <div className='mt-1'>
                <select
                  id='companySize'
                  name='companySize'
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                    errors.companySize ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md sm:text-sm`}
                  value={formData.companySize}
                  onChange={handleChange}
                >
                  <option value=''>Select company size</option>
                  {COMPANY_SIZES.map((size) => (
                    <option
                      key={size}
                      value={size}
                    >
                      {size}
                    </option>
                  ))}
                </select>
                {errors.companySize && (
                  <p className='mt-2 text-sm text-red-600'>
                    {errors.companySize}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <input
                    id='agreeToEula'
                    name='agreeToEula'
                    type='checkbox'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    checked={formData.agreeToEula}
                    onChange={handleChange}
                  />
                </div>
                <div className='ml-3'>
                  <label
                    htmlFor='agreeToEula'
                    className='text-sm text-gray-700'
                  >
                    I agree to the{' '}
                    <a
                      href='#'
                      className='font-medium text-blue-600 hover:text-blue-500'
                    >
                      Terms of Service
                    </a>
                  </label>
                  {errors.agreeToEula && (
                    <p className='mt-2 text-sm text-red-600'>
                      {errors.agreeToEula}
                    </p>
                  )}
                </div>
              </div>

              <div className='flex items-start'>
                <div className='flex items-center h-5'>
                  <input
                    id='agreeToMarketing'
                    name='agreeToMarketing'
                    type='checkbox'
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    checked={formData.agreeToMarketing}
                    onChange={handleChange}
                  />
                </div>
                <div className='ml-3'>
                  <label
                    htmlFor='agreeToMarketing'
                    className='text-sm text-gray-700'
                  >
                    I agree to receive marketing communications
                  </label>
                </div>
              </div>
            </div>

            <div>
              <Button
                type='submit'
                className='w-full'
                isLoading={isLoading}
              >
                Create account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
