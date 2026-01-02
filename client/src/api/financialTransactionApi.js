import apiClient from '../lib/apiClient';

const BASE_URL = '/financial';

export const fetchTransactions = async (params) => {
    return await apiClient.get(BASE_URL, { params });
};

export const fetchTransactionById = async (id) => {
    return await apiClient.get(`${BASE_URL}/${id}`);
};

export const createTransaction = async (data) => {
    return await apiClient.post(BASE_URL, data);
};

export const updateTransaction = async (id, data) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
};

export const deleteTransaction = async (id) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
};
