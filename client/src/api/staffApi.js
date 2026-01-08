import apiClient from '../lib/apiClient';

export const getStaff = async () => {
    const response = await apiClient.get('/staff');
    return response;
};

export const createStaff = async (staffData) => {
    const response = await apiClient.post('/staff', staffData);
    return response.data;
};

export const updateStaff = async (id, staffData) => {
    const response = await apiClient.put(`/staff/${id}`, staffData);
    return response.data;
};

export const deleteStaff = async (id) => {
    const response = await apiClient.delete(`/staff/${id}`);
    return response.data;
};

export default { getStaff, createStaff, updateStaff, deleteStaff };
