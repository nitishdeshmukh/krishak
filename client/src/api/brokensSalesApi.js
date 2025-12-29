/**
 * API service for BROKENS sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchBrokensSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    return await apiClient.get('/sales/brokens', { params });
};

export const createBrokensSales = async (salesData) => {
    const data = await apiClient.post('/sales/brokens', salesData);
    return data;
};

// Fetch all Brokens sales for dropdown
export const fetchAllBrokensSales = async () => {
    return await apiClient.get('/sales/brokens/all');
};

// Fetch Brokens sale by deal number for auto-fill
export const fetchBrokensSaleByDealNumber = async (dealNumber) => {
    return await apiClient.get(`/sales/brokens/by-deal-number/${dealNumber}`);
};

export default { fetchBrokensSales, createBrokensSales, fetchAllBrokensSales, fetchBrokensSaleByDealNumber };
