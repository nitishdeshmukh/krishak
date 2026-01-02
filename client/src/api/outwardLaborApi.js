import apiClient from '../lib/apiClient';

const BASE_URL = '/labor-cost/outward';

export const fetchAllOutwardLabor = async (params) => {
    return await apiClient.get(BASE_URL, { params });
};

export const fetchOutwardLaborById = async (id) => {
    return await apiClient.get(`${BASE_URL}/${id}`);
};

export const createOutwardLabor = async (data) => {
    return await apiClient.post(BASE_URL, data);
};

export const updateOutwardLabor = async (id, data) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
};

export const deleteOutwardLabor = async (id) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
};
