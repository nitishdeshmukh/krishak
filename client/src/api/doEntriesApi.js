/**
 * API service for DO entry-related endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchDOEntries = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    return await apiClient.get('/do-entries', { params });
};

export const createDOEntry = async (entryData) => {
    const data = await apiClient.post('/do-entries', entryData);
    return data;
};

export const createBulkDOEntries = async (entries) => {
    const data = await apiClient.post('/do-entries/bulk', { entries });
    return data;
};

export const updateDOEntry = async (id, entryData) => {
    const data = await apiClient.put(`/do-entries/${id}`, entryData);
    return data;
};

export const deleteDOEntry = async (id) => {
    const data = await apiClient.delete(`/do-entries/${id}`);
    return data;
};

/**
 * Fetch all DO entries for dropdown/select use (no pagination)
 */
export const fetchAllDOEntries = async () => {
    try {
        const response = await apiClient.get('/do-entries/all');
        return response?.data?.doEntries;
    } catch (error) {
        console.warn('⚠️ API not available for fetching DO entries');
        return { success: false, message: 'Failed to fetch all DO entries' };
    }
};

export default { fetchDOEntries, createDOEntry, createBulkDOEntries, updateDOEntry, deleteDOEntry, fetchAllDOEntries };
