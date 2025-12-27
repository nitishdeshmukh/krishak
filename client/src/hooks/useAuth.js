"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../api/authApi';
import {
    loginStart,
    loginSuccess,
    loginFailure,
    logout as logoutAction,
    selectUser,
    selectIsAuthenticated,
    selectIsLoading,
    selectAuthError
} from '../store/slices/authSlice';
import { toast } from 'sonner';

/**
 * Hook for user login with Redux state management
 */
export const useLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: login,
        onMutate: () => {
            dispatch(loginStart());
        },
        onSuccess: (data) => {
            dispatch(loginSuccess(data.data));
            toast.success('Welcome back!');
            queryClient.setQueryData(['currentUser'], data.data.user);
            navigate('/entry');
        },
        onError: (error) => {
            const message = error.response?.data?.message || error.message || 'Login failed';
            dispatch(loginFailure(message));
            toast.error(message);
        }
    });
};

/**
 * Hook for user logout with Redux state management
 */
export const useLogout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            dispatch(logoutAction());
            toast.success('Logged out successfully');
            queryClient.setQueryData(['currentUser'], null);
            queryClient.clear();
            navigate('/');
        },
        onError: (error) => {
            const message = error.response?.data?.message || error.message || 'Logout failed';
            toast.error(message);
        }
    });
};

/**
 * Hook to access auth state from Redux
 */
export const useAuth = () => {
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectAuthError);

    return {
        user,
        isAuthenticated,
        isLoading,
        error
    };
};

export default {
    useLogin,
    useLogout,
    useAuth
};
