import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Users, Leaf, BarChart4, CloudSun, ShieldCheck } from 'lucide-react';
import Button from '../components/common/Button';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg)',
            backgroundBlendMode: 'overlay',
          }}
        ></div>
        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-slide-up">
              Connecting Farmers Directly With Customers
            </h1>
            <p className="text-lg md:text-xl mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              KisanSetu empowers farmers with AI-driven insights while providing customers with fresh, farm-direct produce at fair prices.
            </p>
            <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="lg" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features That Empower</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              KisanSetu provides innovative solutions for both farmers and customers, creating a sustainable agricultural ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Tractor className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Farmer Dashboard</h3>
              <p className="text-gray-600">
                A comprehensive control center for farmers to manage products, track sales, and access agricultural insights.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Direct Marketplace</h3>
              <p className="text-gray-600">
                Connect farmers directly with customers, eliminating middlemen and ensuring fair prices for all.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Leaf className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Crop Suggestions</h3>
              <p className="text-gray-600">
                AI-powered recommendations for optimal crop selection based on local weather, soil conditions, and market trends.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <BarChart4 className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Insights</h3>
              <p className="text-gray-600">
                Real-time market data and price forecasts to help farmers make informed decisions about when to sell.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <CloudSun className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Weather Forecasting</h3>
              <p className="text-gray-600">
                Accurate weather predictions to help plan farming activities and protect crops from adverse conditions.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-fade-in">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Disease Detection</h3>
              <p className="text-gray-600">
                Upload images of plants to identify diseases and get treatment recommendations using AI technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple process that benefits both farmers and customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Farmers List Products</h3>
              <p className="text-gray-600">
                Farmers create profiles, list their available produce, and set fair prices based on market insights.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customers Shop</h3>
              <p className="text-gray-600">
                Customers browse the marketplace, select fresh produce directly from farms, and place orders.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Payment & Delivery</h3>
              <p className="text-gray-600">
                Payments are processed securely through RazorPay, and products are delivered fresh from farm to table.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Agriculture?</h2>
            <p className="text-lg mb-8">
              Join KisanSetu today and be part of the agricultural revolution. Whether you're a farmer looking to maximize profits or a customer seeking fresh, quality produce.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-white text-primary-700 hover:bg-gray-100"
                >
                  Register Now
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-primary-600"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;