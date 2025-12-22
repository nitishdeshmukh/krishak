/**
 * API service for FRK purchase deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_FRK_PURCHASES = [
    {
        _id: '1',
        dealNumber: 'FRK-2024-001',
        partyName: 'पार्टी 1',
        dealDate: '2024-02-15',
        quantity: '100',
        rate: '50',
        amount: 5000,
        gstPercent: '18',
        gstAmount: 900,
        payableAmount: 5900,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'FRK-2024-002',
        partyName: 'पार्टी 2',
        dealDate: '2024-03-10',
        quantity: '150',
        rate: '55',
        amount: 8250,
        gstPercent: '18',
        gstAmount: 1485,
        payableAmount: 9735,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_FRK_PURCHASES.slice(startIndex, endIndex);
    const total = DUMMY_FRK_PURCHASES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'FRK purchases retrieved successfully (DUMMY DATA)',
        data: { frkPurchases: paginatedData, totalFRKPurchases: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchFRKPurchases = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/purchases/frk', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createFRKPurchase = async (purchaseData) => {
    try {
        const data = await apiClient.post('/purchases/frk', purchaseData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'FRK Purchase created successfully (SIMULATED)',
            data: { ...purchaseData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchFRKPurchases, createFRKPurchase };
