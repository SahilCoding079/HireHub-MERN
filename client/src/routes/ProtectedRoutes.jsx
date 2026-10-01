import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/common/Loader';

const ProtectedRoutes = ({allowedRoles}) => {
  const { isInitialized, isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();
  if(!isInitialized){
    return <Loader />;
  }
  if(!isAuthenticated || !user){
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if(allowedRoles && !allowedRoles.includes(user.role)){
    return <Navigate to="/" replace/>
  }
  return <Outlet/>
};

export default ProtectedRoutes;