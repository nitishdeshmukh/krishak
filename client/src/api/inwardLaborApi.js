/**
 * API service for Inward Labor endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchInwardLabor = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }
    return await apiClient.get('/labor-cost/inward', { params });
};

export const fetchInwardLaborById = async (id) => {
    return await apiClient.get(`/labor-cost/inward/${id}`);
};

export const createInwardLabor = async (laborData) => {
    return await apiClient.post('/labor-cost/inward', laborData);
};

export const updateInwardLabor = async (id, laborData) => {
    return await apiClient.put(`/labor-cost/inward/${id}`, laborData);
};

export const deleteInwardLabor = async (id) => {
    return await apiClient.delete(`/labor-cost/inward/${id}`);
};

export default { fetchInwardLabor, fetchInwardLaborById, createInwardLabor, updateInwardLabor, deleteInwardLabor };
