import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, MapPin, Phone, Mail } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { getUserData } from '../services/authService';
import Button from '../components/common/Button';

interface Address {
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  farmSize?: string;
  farmType?: string;
}

interface UserData {
  fullName?: string;
  phone?: string;
  address?: Address;
  location?: string;
  farmSize?: string;
  farmType?: string;
}

const Profile: React.FC = () => {
  const { user, userRole } = useAuthStore();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setLoading(true);
        try {
          const data = await getUserData(user.uid);
          setUserData(data);

          // Set form values from fetched data
          setValue('fullName', data.fullName ?? '');
          setValue('email', user.email ?? '');
          setValue('phone', data.phone ?? '');
          setValue('address', data.address?.line1 ?? '');
          setValue('city', data.address?.city ?? '');
          setValue('state', data.address?.state ?? '');
          setValue('pincode', data.address?.pincode ?? '');

          if (userRole === 'farmer') {
            setValue('farmSize', data.farmSize ?? '');
            setValue('farmType', data.farmType ?? '');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user, userRole, setValue]);

  const onSubmit = async (data: ProfileForm) => {
    try {
      // TODO: Call update API to update user profile in backend or Firestore
      console.log('Profile data to update:', data);

      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <aside>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userData?.fullName || 'User'}
              </h2>
              <p className="text-gray-500 capitalize">{userRole || 'N/A'}</p>

              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
                {userData?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                    <span className="text-sm text-gray-600">{userData.phone}</span>
                  </div>
                )}
                {(userData?.location || (userData?.address && (userData.address.city || userData.address.state))) && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" aria-hidden="true" />
                    <span className="text-sm text-gray-600">
                      {userData.location ??
                        [userData.address?.city, userData.address?.state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {userRole === 'farmer' && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-4">Farm Details</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Farm Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    {userData?.farmSize ? `${userData.farmSize} acres` : '-'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="text-sm font-medium text-gray-900">
                    {userData?.location ?? '-'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Products Listed</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Sales</span>
                  <span className="text-sm font-medium text-gray-900">₹12,500</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Edit Profile Form */}
        <section className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6">Edit Profile</h2>

            {updateSuccess && (
              <div
                role="alert"
                className="mb-4 p-3 bg-success-50 text-success-700 rounded-md"
              >
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    className={`block w-full rounded-md border ${
                      errors.fullName ? 'border-error-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    {...register('fullName', { required: 'Full name is required' })}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-error-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    disabled
                    className="block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    {...register('email')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={`block w-full rounded-md border ${
                      errors.phone ? 'border-error-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Enter a valid 10-digit phone number',
                      },
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    className={`block w-full rounded-md border ${
                      errors.address ? 'border-error-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    {...register('address')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    {...register('city')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    {...register('state')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    type="text"
                    className={`block w-full rounded-md border ${
                      errors.pincode ? 'border-error-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                    {...register('pincode', {
                      pattern: {
                        value: /^[1-9][0-9]{5}$/,
                        message: 'Enter a valid 6-digit pincode',
                      },
                    })}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-error-600">{errors.pincode.message}</p>
                  )}
                </div>

                {/* Farmer specific fields */}
                {userRole === 'farmer' && (
                  <>
                    <div>
                      <label
                        htmlFor="farmSize"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Farm Size (acres)
                      </label>
                      <input
                        id="farmSize"
                        type="text"
                        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('farmSize')}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="farmType"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Farm Type
                      </label>
                      <input
                        id="farmType"
                        type="text"
                        className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        {...register('farmType')}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full md:w-auto">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
