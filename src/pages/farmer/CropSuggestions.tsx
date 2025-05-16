import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plane as Plant, Loader2 } from 'lucide-react';
import { getCurrentWeather } from '../../services/weatherService';
import { getCropSuggestions } from '../../services/geminiService';
import Button from '../../components/common/Button';

interface FormData {
  location: string;
  soilType: string;
  farmSize: string;
}

const CropSuggestions: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSuggestions(null);
    try {
      // Get weather data
      const weatherData = await getCurrentWeather(data.location);

      if (!weatherData || weatherData.error || !weatherData.current) {
        setSuggestions('❌ Unable to fetch weather data. Please check the location and try again.');
        return;
      }

      // Get AI-generated crop suggestions
      const cropSuggestions = await getCropSuggestions(
        data.location,
        weatherData,
        data.soilType,
        data.farmSize
      );

      setSuggestions(cropSuggestions);
    } catch (error) {
      console.error('❌ Error generating crop suggestions:', error);
      setSuggestions('⚠️ Failed to generate crop suggestions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Crop Suggestions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Enter Your Details</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  className={`block w-full rounded-md border ${
                    errors.location ? 'border-red-500' : 'border-gray-300'
                  } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  placeholder="City, State or Pin Code"
                  {...register('location', { required: 'Location is required' })}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 mb-1">
                  Soil Type
                </label>
                <select
                  id="soilType"
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  {...register('soilType')}
                >
                  <option value="">Select soil type (optional)</option>
                  <option value="sandy">Sandy Soil</option>
                  <option value="clay">Clay Soil</option>
                  <option value="silt">Silty Soil</option>
                  <option value="loam">Loamy Soil</option>
                  <option value="chalk">Chalky Soil</option>
                  <option value="peat">Peaty Soil</option>
                </select>
              </div>

              <div>
                <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Size (in acres)
                </label>
                <input
                  id="farmSize"
                  type="text"
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="e.g., 5.5"
                  {...register('farmSize')}
                />
              </div>

              <Button
                type="submit"
                isLoading={loading}
                className="w-full"
                icon={<Plant className="h-4 w-4" />}
              >
                Get Crop Suggestions
              </Button>
            </form>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
            <h2 className="text-lg font-semibold mb-4">AI-Powered Crop Suggestions</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
                <p className="mt-4 text-gray-600">
                  Analyzing weather and generating recommendations...
                </p>
              </div>
            ) : suggestions ? (
              <div className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{
                    __html: suggestions.replace(/\n/g, '<br />'),
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Plant className="h-16 w-16 text-primary-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Get personalized crop recommendations
                </h3>
                <p className="text-gray-600">
                  Enter your location and farm details to receive AI-powered suggestions
                  based on current weather, soil conditions, and market trends.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Input Your Data', 'AI Analysis', 'Get Recommendations'].map((title, index) => (
            <div className="text-center" key={index}>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-bold text-primary-600">{index + 1}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">
                {
                  [
                    'Enter your location, soil type, and farm size to get started.',
                    'Our AI processes weather data, soil conditions, and market trends.',
                    'Receive detailed crop suggestions optimized for your specific conditions.',
                  ][index]
                }
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropSuggestions;
