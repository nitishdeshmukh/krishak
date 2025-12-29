/**
 * API service for Other Labor endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchOtherLabor = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }
    return await apiClient.get('/labor-cost/other', { params });
};

export const fetchOtherLaborById = async (id) => {
    return await apiClient.get(`/labor-cost/other/${id}`);
};

export const createOtherLabor = async (laborData) => {
    return await apiClient.post('/labor-cost/other', laborData);
};

export const updateOtherLabor = async (id, laborData) => {
    return await apiClient.put(`/labor-cost/other/${id}`, laborData);
};

export const deleteOtherLabor = async (id) => {
    return await apiClient.delete(`/labor-cost/other/${id}`);
};

export default { fetchOtherLabor, fetchOtherLaborById, createOtherLabor, updateOtherLabor, deleteOtherLabor };
