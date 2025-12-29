/**
 * API service for Other sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchOtherSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }
    return await apiClient.get('/sales/other', { params });
};

export const createOtherSales = async (salesData) => {
    return await apiClient.post('/sales/other', salesData);
};

// Fetch all Other sales for dropdown
export const fetchAllOtherSales = async () => {
    return await apiClient.get('/sales/other/all');
};

// Fetch Other sale by deal number for auto-fill
export const fetchOtherSaleByDealNumber = async (dealNumber) => {
    return await apiClient.get(`/sales/other/by-deal-number/${dealNumber}`);
};

export default { fetchOtherSales, createOtherSales, fetchAllOtherSales, fetchOtherSaleByDealNumber };
