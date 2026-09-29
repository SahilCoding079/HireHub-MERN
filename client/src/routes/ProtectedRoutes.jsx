import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/common/Loader';

const ProtectedRoutes = ({allowedRoles}) => {
  const { isInitialized, isAuthenticated, user } = useSelector((state) => state.auth);
  if(!isInitialized){
    return <Loader />;
  }
  if(!isAuthenticated || !user){
    return <Navigate to="/login" replace />
  }
  if(allowedRoles && !allowedRoles.includes(user.role)){
    return <Navigate to="/" replace/>
  }
  return <Outlet/>
};

export default ProtectedRoutes;