/**
 * API service for Brewers sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchBrewersSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }
    return await apiClient.get('/sales/brewers', { params });
};

export const createBrewersSales = async (salesData) => {
    return await apiClient.post('/sales/brewers', salesData);
};

// Fetch all Brewers sales for dropdown
export const fetchAllBrewersSales = async () => {
    return await apiClient.get('/sales/brewers/all');
};

// Fetch Brewers sale by deal number for auto-fill
export const fetchBrewersSaleByDealNumber = async (dealNumber) => {
    return await apiClient.get(`/sales/brewers/by-deal-number/${dealNumber}`);
};

export default { fetchBrewersSales, createBrewersSales, fetchAllBrewersSales, fetchBrewersSaleByDealNumber };
