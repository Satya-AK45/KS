import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { getUserData } from '../../services/authService';

interface Order {
  id: string;
  date: Date;
  products: { name: string; quantity: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [userData, setUserData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setUserData(data);
          
          // For demo purposes, we'll use mock orders
          setRecentOrders([
            {
              id: 'ORD123456',
              date: new Date(2023, 5, 15),
              products: [
                { name: 'Organic Tomatoes', quantity: 2 },
                { name: 'Fresh Spinach', quantity: 1 }
              ],
              total: 350,
              status: 'delivered'
            },
            {
              id: 'ORD123457',
              date: new Date(2023, 5, 20),
              products: [
                { name: 'Red Onions', quantity: 3 },
                { name: 'Potatoes', quantity: 5 }
              ],
              total: 420,
              status: 'shipped'
            },
            {
              id: 'ORD123458',
              date: new Date(2023, 5, 25),
              products: [
                { name: 'Organic Carrots', quantity: 2 },
                { name: 'Cabbage', quantity: 1 }
              ],
              total: 280,
              status: 'processing'
            }
          ]);
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-warning-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-accent-500" />;
      case 'shipped':
        return <ShoppingBag className="h-5 w-5 text-primary-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-success-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Customer Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <ShoppingBag className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium text-primary-600">+25% from last month</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="p-3 bg-accent-100 rounded-full">
              <Package className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium text-accent-600">2 out for delivery</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Spend This Month</p>
              <p className="text-2xl font-bold text-gray-900">₹1,250</p>
            </div>
            <div className="p-3 bg-success-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm font-medium text-success-600">Saved ₹350 vs market price</div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link to="/orders" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentOrders.map((order) => (
            <div key={order.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      {order.date.toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <p className="text-sm font-medium text-gray-900">₹{order.total}</p>
                    <p className="text-sm capitalize text-gray-500">{order.status}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="mt-2 ml-9">
                <p className="text-sm text-gray-500">
                  {order.products.map((p, i) => (
                    <span key={i}>
                      {p.name} (x{p.quantity})
                      {i < order.products.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Browse Marketplace</h2>
          <p className="text-gray-600 mb-4">
            Discover fresh, locally-grown produce directly from farmers near you.
          </p>
          <Link to="/marketplace">
            <button className="btn btn-primary w-full">
              Explore Products
            </button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Your Shopping Cart</h2>
          <p className="text-gray-600 mb-4">
            Continue shopping or proceed to checkout with your selected items.
          </p>
          <Link to="/customer/cart">
            <button className="btn btn-outline w-full">
              View Cart
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;