import apiClient from '../lib/apiClient';

export const getTrucks = async () => {
    const response = await apiClient.get('/trucks');
    return response.data;
};

export const createTruck = async (truckData) => {
    const response = await apiClient.post('/trucks', truckData);
    return response.data;
};
