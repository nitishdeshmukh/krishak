/**
 * API service for Milling Labor endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchMillingLabor = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }
    return await apiClient.get('/labor-cost/milling', { params });
};

export const fetchMillingLaborById = async (id) => {
    return await apiClient.get(`/labor-cost/milling/${id}`);
};

export const createMillingLabor = async (laborData) => {
    return await apiClient.post('/labor-cost/milling', laborData);
};

export const updateMillingLabor = async (id, laborData) => {
    return await apiClient.put(`/labor-cost/milling/${id}`, laborData);
};

export const deleteMillingLabor = async (id) => {
    return await apiClient.delete(`/labor-cost/milling/${id}`);
};

export default { fetchMillingLabor, fetchMillingLaborById, createMillingLabor, updateMillingLabor, deleteMillingLabor };
