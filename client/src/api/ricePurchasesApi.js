/**
 * API service for rice purchase deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchRicePurchases = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    return await apiClient.get('/purchases/rice', { params });
};

export const createRicePurchase = async (purchaseData) => {
    return await apiClient.post('/purchases/rice', purchaseData);
};

export const fetchAllRicePurchases = async () => {
    return await apiClient.get('/purchases/rice/all');
};

// Fetch rice purchase details by purchase number (for auto-fill)
export const fetchRicePurchaseByNumber = async (purchaseNumber) => {
    return await apiClient.get(`/purchases/rice/by-number/${purchaseNumber}`);
};

export default { fetchRicePurchases, createRicePurchase, fetchAllRicePurchases, fetchRicePurchaseByNumber };

