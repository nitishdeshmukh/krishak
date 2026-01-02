import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, loginSuccess } from '@/store/slices/authSlice';
import { getMe } from '@/api/authApi';
import PageLoader from '@/components/PageLoader';

/**
 * Higher-order component to protect routes that require authentication
 * Handles session hydration on initial load
 */
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(!isAuthenticated);

    useEffect(() => {
        const verifySession = async () => {
            if (isAuthenticated) {
                setIsChecking(false);
                return;
            }

            try {
                const response = await getMe();
                if (response.success) {
                    dispatch(loginSuccess({ user: response.data }));
                }
            } catch (error) {
                // Session verify failed, will redirect below
            } finally {
                setIsChecking(false);
            }
        };

        verifySession();
    }, [isAuthenticated, dispatch]);

    // Show loader while checking session
    if (isChecking) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        // Redirect to login page, saving the attempted location for redirect back
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
