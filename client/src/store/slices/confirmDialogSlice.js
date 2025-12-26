import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    formId: null, // To identify which form triggered the dialog
    onConfirmCallback: null,
};

const confirmDialogSlice = createSlice({
    name: 'confirmDialog',
    initialState,
    reducers: {
        showConfirmDialog: (state, action) => {
            state.isOpen = true;
            state.formId = action.payload.formId;
        },
        hideConfirmDialog: (state) => {
            state.isOpen = false;
            state.formId = null;
        },
        confirmAction: (state) => {
            // This is handled by the component that triggered it
            state.isOpen = false;
        },
        resetDialog: () => initialState,
    },
});

export const {
    showConfirmDialog,
    hideConfirmDialog,
    confirmAction,
    resetDialog,
} = confirmDialogSlice.actions;

// Selectors
export const selectConfirmDialogOpen = (state) => state.confirmDialog.isOpen;
export const selectFormId = (state) => state.confirmDialog.formId;

export default confirmDialogSlice.reducer;
