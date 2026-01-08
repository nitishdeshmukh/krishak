import apiClient from '../lib/apiClient';

export const getTrucks = async () => {
    const response = await apiClient.get('/trucks');
    return response;
};

export const createTruck = async (truckData) => {
    const response = await apiClient.post('/trucks', truckData);
    return response;
};

export const updateTruck = async (id, truckData) => {
    const response = await apiClient.put(`/trucks/${id}`, truckData);
    return response;
};

export const deleteTruck = async (id) => {
    const response = await apiClient.delete(`/trucks/${id}`);
    return response;
};

export default { getTrucks, createTruck, updateTruck, deleteTruck };
