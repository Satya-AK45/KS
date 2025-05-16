import { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getUserRole } from '../../services/authService';
import LoadingScreen from '../common/LoadingScreen';

interface ProtectedRouteProps {
  allowedRole: 'farmer' | 'customer' | 'any';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  const { user, loading, userRole, setUserRole } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      if (user && !userRole) {
        try {
          const role = await getUserRole(user);
          setUserRole(role as 'farmer' | 'customer' | null);
        } catch (error) {
          console.error('Error checking user role:', error);
          navigate('/login');
        }
      }
    };

    checkUserRole();
  }, [user, userRole, setUserRole, navigate]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole !== 'any' && userRole !== allowedRole) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;