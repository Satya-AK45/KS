import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sprout, Eye, EyeOff, User, Tractor } from 'lucide-react';
import { registerUser } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/common/Button';

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: 'farmer' | 'customer';
  location?: string;
  farmSize?: string;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'customer'
    }
  });
  const navigate = useNavigate();
  const { setUser, setUserRole } = useAuthStore();
  
  const selectedRole = watch('role');
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create additional user data based on role
      const userData: Record<string, any> = {
        fullName: data.fullName,
        phone: data.phone
      };
      
      if (data.role === 'farmer') {
        userData.location = data.location || '';
        userData.farmSize = data.farmSize || '';
      }
      
      const user = await registerUser(data.email, data.password, data.role, userData);
      setUser(user);
      setUserRole(data.role);
      
      // Redirect based on role
      if (data.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError('Registration failed. Please try again.');
      }
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Sprout className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-3 bg-error-50 text-error-600 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`
                  flex items-center p-4 border rounded-lg cursor-pointer 
                  ${selectedRole === 'customer' 
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                    : 'border-gray-300 hover:bg-gray-50'
                  }
                `}>
                  <input
                    type="radio"
                    value="customer"
                    className="sr-only"
                    {...register('role')}
                  />
                  <User className={`h-6 w-6 mr-2 ${selectedRole === 'customer' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={selectedRole === 'customer' ? 'text-primary-700 font-medium' : 'text-gray-700'}>
                    Customer
                  </span>
                </label>
                
                <label className={`
                  flex items-center p-4 border rounded-lg cursor-pointer
                  ${selectedRole === 'farmer' 
                    ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                    : 'border-gray-300 hover:bg-gray-50'
                  }
                `}>
                  <input
                    type="radio"
                    value="farmer"
                    className="sr-only"
                    {...register('role')}
                  />
                  <Tractor className={`h-6 w-6 mr-2 ${selectedRole === 'farmer' ? 'text-primary-600' : 'text-gray-400'}`} />
                  <span className={selectedRole === 'farmer' ? 'text-primary-700 font-medium' : 'text-gray-700'}>
                    Farmer
                  </span>
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  type="text"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.fullName ? 'border-error-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('fullName', { 
                    required: 'Full name is required' 
                  })}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-error-600">{errors.fullName.message}</p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-error-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-error-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-error-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  type="tel"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.phone ? 'border-error-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  placeholder="e.g., +91 1234567890"
                  {...register('phone', { 
                    required: 'Phone number is required'
                  })}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                )}
              </div>
            </div>
            
            {selectedRole === 'farmer' && (
              <>
                <div className="md:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Farm Location
                  </label>
                  <div className="mt-1">
                    <input
                      id="location"
                      type="text"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="City, State"
                      {...register('location')}
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700">
                    Farm Size (in acres)
                  </label>
                  <div className="mt-1">
                    <input
                      id="farmSize"
                      type="text"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="e.g., 5.5"
                      {...register('farmSize')}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-4">
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </div>
          
          <div className="text-sm text-center">
            By signing up, you agree to our{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Privacy Policy
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;