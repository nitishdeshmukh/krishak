/**
 * API service for sack (packaging) purchase deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

export const fetchSackPurchases = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    return await apiClient.get('/purchases/sack', { params });
};

export const createSackPurchase = async (purchaseData) => {
    return await apiClient.post('/purchases/sack', purchaseData);
};

export const fetchAllSackPurchases = async () => {
    return await apiClient.get('/purchases/sack/all');
};

export const fetchSackPurchaseByNumber = async (purchaseNumber) => {
    return await apiClient.get(`/purchases/sack/by-number/${purchaseNumber}`);
};

export default { fetchSackPurchases, createSackPurchase, fetchAllSackPurchases, fetchSackPurchaseByNumber };
