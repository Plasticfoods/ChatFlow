import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext.jsx';
import Loader from './Loader.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useUser();
  const location = useLocation();

  if (userLoading) {
    return (
        <Loader  />
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;