import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    showConfirmDialog,
    hideConfirmDialog,
    selectConfirmDialogOpen,
    selectFormId,
} from '../store/slices/confirmDialogSlice';

/**
 * Custom hook for managing confirmation dialog state
 * @param {string} formId - Unique identifier for the form
 * @param {function} onConfirm - Callback function to execute when confirmed
 * @returns {object} - Dialog state and handlers
 */
export const useConfirmDialog = (formId, onConfirm) => {
    const dispatch = useDispatch();
    const isOpen = useSelector(selectConfirmDialogOpen);
    const currentFormId = useSelector(selectFormId);

    // Store data locally since it may contain non-serializable values (Dates, etc.)
    const pendingDataRef = useRef(null);

    // Only show if this form triggered it
    const showDialog = isOpen && currentFormId === formId;

    const openDialog = useCallback((data) => {
        pendingDataRef.current = data;
        dispatch(showConfirmDialog({ formId }));
    }, [dispatch, formId]);

    const closeDialog = useCallback(() => {
        pendingDataRef.current = null;
        dispatch(hideConfirmDialog());
    }, [dispatch]);

    const handleConfirm = useCallback(() => {
        if (onConfirm) {
            onConfirm(pendingDataRef.current);
        }
        dispatch(hideConfirmDialog());
        pendingDataRef.current = null;
    }, [dispatch, onConfirm]);

    return {
        isOpen: showDialog,
        openDialog,
        closeDialog,
        handleConfirm,
    };
};

export default useConfirmDialog;
