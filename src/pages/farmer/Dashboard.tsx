import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Leaf, CloudSun, TrendingUp, ShoppingBag, BarChart, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useProductStore } from '../../stores/productStore';
import { getUserData } from '../../services/authService';
import Button from '../../components/common/Button';

const FarmerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { farmerProducts, fetchFarmerProducts, loading } = useProductStore();
  const [userData, setUserData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
          
          // Fetch farmer's products
          await fetchFarmerProducts(user.uid);
          
          // For demo purposes, we'll use mock orders
          setRecentOrders([
            {
              id: 'ORD789012',
              customerName: 'Rahul Sharma',
              date: new Date(2023, 5, 15),
              product: 'Organic Tomatoes',
              quantity: 10,
              total: 750,
              status: 'completed'
            },
            {
              id: 'ORD789013',
              customerName: 'Priya Patel',
              date: new Date(2023, 5, 18),
              product: 'Fresh Onions',
              quantity: 15,
              total: 600,
              status: 'processing'
            },
            {
              id: 'ORD789014',
              customerName: 'Amit Kumar',
              date: new Date(2023, 5, 20),
              product: 'Potatoes',
              quantity: 20,
              total: 800,
              status: 'completed'
            }
          ]);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    
    fetchData();
  }, [user, fetchFarmerProducts]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
        <div className="mt-4 md:mt-0">
          <Link to="/farmer/add-product">
            <Button icon={<Plus className="h-4 w-4" />}>
              Add New Product
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Products Listed</p>
              <p className="text-2xl font-bold text-gray-900">{farmerProducts.length}</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Leaf className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/farmer/products" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Manage Products →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Weather</p>
              <p className="text-2xl font-bold text-gray-900">28°C</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-full">
              <CloudSun className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/farmer/weather-forecast" className="text-sm font-medium text-accent-600 hover:text-accent-700">
              View Forecast →
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">₹12,500</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium text-success-600">+15% from last month</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-full">
              <ShoppingBag className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/farmer/orders" className="text-sm font-medium text-warning-600 hover:text-warning-700">
              Process Orders →
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Recent Orders</h2>
              <Link to="/farmer/orders" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.date.toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{order.total}</p>
                      <span 
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-success-100 text-success-800' 
                            : 'bg-warning-100 text-warning-800'
                        }`}
                      >
                        {order.status === 'completed' ? 'Completed' : 'Processing'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {order.customerName} • {order.product} (x{order.quantity})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Market Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Market Insights</h2>
              <Link to="/farmer/market-insights" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-start">
                <BarChart className="h-10 w-10 text-accent-500 mr-4" />
                <div>
                  <h3 className="text-base font-medium text-gray-900">Price Trends</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Tomato prices are expected to rise by 10% in the next month due to seasonal demand.
                    Onion and potato markets are stable.
                  </p>
                  <div className="mt-3">
                    <Link to="/farmer/market-insights" className="text-sm font-medium text-accent-600 hover:text-accent-700">
                      Get detailed analysis →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Weather Forecast */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Weather Forecast</h2>
              <Link to="/farmer/weather-forecast" className="text-sm text-primary-600 hover:text-primary-700">
                Details
              </Link>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-3xl font-bold">28°C</p>
                  <p className="text-sm text-gray-500">Mostly Sunny</p>
                </div>
                <CloudSun className="h-12 w-12 text-accent-500" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p className="text-sm font-medium">65%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Wind</p>
                  <p className="text-sm font-medium">12 km/h</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Precipitation</p>
                  <p className="text-sm font-medium">10%</p>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium mb-3">Next 3 Days</h3>
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Wed</p>
                    <CloudSun className="h-8 w-8 mx-auto my-2 text-accent-500" />
                    <p className="text-sm font-medium">29°C</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Thu</p>
                    <CloudSun className="h-8 w-8 mx-auto my-2 text-accent-500" />
                    <p className="text-sm font-medium">30°C</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Fri</p>
                    <CloudSun className="h-8 w-8 mx-auto my-2 text-accent-500" />
                    <p className="text-sm font-medium">27°C</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <Link to="/farmer/crop-suggestions">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <Leaf className="h-5 w-5 text-primary-500 mr-3" />
                    <span>Get Crop Suggestions</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </Link>
              
              <Link to="/farmer/disease-detection">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <Leaf className="h-5 w-5 text-primary-500 mr-3" />
                    <span>Detect Plant Disease</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </Link>
              
              <Link to="/farmer/market-insights">
                <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 text-primary-500 mr-3" />
                    <span>View Market Insights</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;