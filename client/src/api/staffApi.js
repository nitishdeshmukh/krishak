import apiClient from '../lib/apiClient';

export const getStaff = async () => {
    const response = await apiClient.get('/staff');
    return response;
};

export const createStaff = async (staffData) => {
    const response = await apiClient.post('/staff', staffData);
    return response.data;
};
