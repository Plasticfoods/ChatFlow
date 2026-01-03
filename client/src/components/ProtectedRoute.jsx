import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/User.jsx';
import Loader from './Loader.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, userLoading } = useUser();
  const location = useLocation();
  console.log(location);

  if (userLoading) {
    return (
        <Loader overlay={true} />
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;