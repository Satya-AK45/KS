import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './stores/authStore';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Lazy-loaded routes
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const FarmerDashboard = lazy(() => import('./pages/farmer/Dashboard'));
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CropSuggestions = lazy(() => import('./pages/farmer/CropSuggestions'));
const DiseaseDetection = lazy(() => import('./pages/farmer/DiseaseDetection'));
const MarketInsights = lazy(() => import('./pages/farmer/MarketInsights'));
const WeatherForecast = lazy(() => import('./pages/farmer/WeatherForecast'));
const AddProduct = lazy(() => import('./pages/farmer/AddProduct'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { user, setUser, setLoading, loading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={!user ? <Login /> : <Navigate to={user.displayName === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard'} />} />
          <Route path="register" element={!user ? <Register /> : <Navigate to={user.displayName === 'farmer' ? '/farmer/dashboard' : '/customer/dashboard'} />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="product/:id" element={<ProductDetail />} />
          
          {/* Farmer routes */}
          <Route path="farmer" element={<ProtectedRoute allowedRole="farmer" />}>
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="crop-suggestions" element={<CropSuggestions />} />
            <Route path="disease-detection" element={<DiseaseDetection />} />
            <Route path="market-insights" element={<MarketInsights />} />
            <Route path="weather-forecast" element={<WeatherForecast />} />
            <Route path="add-product" element={<AddProduct />} />
          </Route>
          
          {/* Customer routes */}
          <Route path="customer" element={<ProtectedRoute allowedRole="customer" />}>
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
          
          <Route path="profile" element={<ProtectedRoute allowedRole="any" />}>
            <Route index element={<Profile />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;