import AppRouter from './routes/AppRouter';
import { useDispatch, useSelector } from 'react-redux';
import { initializeAuthFailure, initializeAuthStart, initializeAuthSuccess } from './redux/slices/authSlice';
import { getUser } from './service/auth.service';
import Toast from './components/common/Toast';
import ScrollToTop from './components/common/ScrollToTop';
import { useEffect } from 'react';
import { getNotifications } from './service/notification.service';
import {
  notificationsCleared,
  notificationsFailure,
  notificationsStart,
  notificationsSuccess,
} from './redux/slices/notificationSlice';

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeAuth = async() => {
      dispatch(initializeAuthStart());
      try {
        const response = await getUser();
        dispatch(initializeAuthSuccess(response.data));
      } catch {
        dispatch(initializeAuthFailure());
      }
    }
    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      dispatch(notificationsCleared());
      return;
    }

    const loadNotifications = async () => {
      dispatch(notificationsStart());
      try {
        dispatch(notificationsSuccess(await getNotifications()));
      } catch (requestError) {
        dispatch(
          notificationsFailure(
            requestError.response?.data?.message ||
              'Unable to load notifications.',
          ),
        );
      }
    };

    loadNotifications();
  }, [dispatch, isAuthenticated, user]);
  return (
    <>
    <Toast/>
      <ScrollToTop />
      <AppRouter />
    </>
  )
}

export default App;
