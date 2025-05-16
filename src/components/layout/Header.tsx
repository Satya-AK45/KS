import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, User, LogOut, Tractor, Sprout } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { logoutUser } from '../../services/authService';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userRole, clearAuthState } = useAuthStore();
  const { getItemCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      clearAuthState();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  // Determine header style based on scroll and page
  const headerClass = `fixed top-0 w-full z-40 transition-all duration-300 ${
    isScrolled || !isHomePage 
      ? 'bg-white shadow-sm py-2' 
      : 'bg-white py-4'
  }`;
  
  // Determine logo and link colors based on scroll and page
  const textColorClass = isScrolled || !isHomePage 
    ? 'text-gray-900' 
    : 'text-gray-900';
  
  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className={`h-8 w-8 ${isScrolled || !isHomePage ? 'text-primary-600' : 'text-white'}`} />
            <span className={`text-xl font-bold ${textColorClass}`}>KisanSetu</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/marketplace" 
              className={`font-medium hover:text-primary-500 ${textColorClass}`}
            >
              Marketplace
            </Link>
            
            {userRole === 'farmer' ? (
              <>
                <Link 
                  to="/farmer/dashboard" 
                  className={`font-medium hover:text-primary-500 ${textColorClass}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/farmer/crop-suggestions" 
                  className={`font-medium hover:text-primary-500 ${textColorClass}`}
                >
                  Crop Suggestions
                </Link>
              </>
            ) : userRole === 'customer' ? (
              <Link 
                to="/customer/dashboard" 
                className={`font-medium hover:text-primary-500 ${textColorClass}`}
              >
                Dashboard
              </Link>
            ) : null}
          </nav>
          
          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {userRole === 'customer' && (
                  <Link 
                    to="/customer/cart" 
                    className="relative p-2 rounded-full hover:bg-gray-100"
                  >
                    <ShoppingCart className={textColorClass} />
                    {getItemCount() > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full">
                        {getItemCount()}
                      </span>
                    )}
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      {userRole === 'farmer' ? (
                        <Tractor className="h-5 w-5 text-primary-700" />
                      ) : (
                        <User className="h-5 w-5 text-primary-700" />
                      )}
                    </div>
                    <span className={`font-medium ${textColorClass}`}>
                      {userRole === 'farmer' ? 'Farmer' : 'Customer'}
                    </span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="py-1">
                      <Link 
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="md">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="md">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
          <Link
            to="/marketplace"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Marketplace
          </Link>
          
          {userRole === 'farmer' ? (
            <>
              <Link
                to="/farmer/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/farmer/crop-suggestions"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Crop Suggestions
              </Link>
              <Link
                to="/farmer/disease-detection"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Disease Detection
              </Link>
              <Link
                to="/farmer/market-insights"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Market Insights
              </Link>
            </>
          ) : userRole === 'customer' ? (
            <>
              <Link
                to="/customer/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/customer/cart"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart {getItemCount() > 0 && `(${getItemCount()})`}
              </Link>
            </>
          ) : null}
          
          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;