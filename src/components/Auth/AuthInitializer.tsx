import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { setCredentials, logout, setLoading } from '../../store/slices/authSlice';


/**
 * AuthInitializer component
 *
 * This component runs once when the app loads to validate the stored token
 * and fetch user data. If the token is invalid or expired, it logs the user out.
 */
const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initializeAuth = async () => {
      // Only proceed if we have a token but no user data
      if (token && !user) {
        dispatch(setLoading(true));

        try {
          // Validate token and fetch user data
          const response = await fetch('http://localhost:7337/api/v1/auth/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();

            if (data.success && data.data.user) {
              // Token is valid, update Redux with user data
              // Map backend user fields to match our User interface
              const refreshToken = localStorage.getItem('refreshToken') || '';
              dispatch(setCredentials({
                user: {
                  id: data.data.user.id,
                  email: data.data.user.email,
                  role: data.data.user.role,
                  orgId: data.data.user.orgId,
                  profile: data.data.user.profile || { name: '' },
                  plan: data.data.user.plan,
                  googleCalendar: data.data.user.googleCalendar,
                  isActive: data.data.user.isActive !== undefined ? data.data.user.isActive : true,
                },
                token: token,
                refreshToken: refreshToken,
              }));
            } else {
              // Invalid response format
              dispatch(logout());
            }
          } else {
            // Token is invalid or expired (401, 403, etc.)
            dispatch(logout());
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          // Network error or other issue - logout to be safe
          dispatch(logout());
        } finally {
          dispatch(setLoading(false));
        }
      } else if (token && user) {
        // We have both token and user, no need to fetch again
        dispatch(setLoading(false));
      } else {
        // No token, ensure we're not loading
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]); // Run only once on mount

  // This component doesn't render anything
  return null;
};

export default AuthInitializer;
