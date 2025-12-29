/**
 * API service for sack (packaging) sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_SACK_SALES = [
    {
        _id: '1',
        dealNumber: 'SS-2024-001',
        partyName: 'पार्टी 1',
        dealDate: '2024-02-15',
        newPackagingCount: '500',
        newPackagingRate: '50',
        oldPackagingCount: '200',
        oldPackagingRate: '30',
        plasticPackagingCount: '100',
        plasticPackagingRate: '25',
        payableAmount: 33500,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'SS-2024-002',
        partyName: 'पार्टी 2',
        dealDate: '2024-03-10',
        newPackagingCount: '300',
        newPackagingRate: '55',
        oldPackagingCount: '150',
        oldPackagingRate: '35',
        plasticPackagingCount: '80',
        plasticPackagingRate: '28',
        payableAmount: 24990,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_SACK_SALES.slice(startIndex, endIndex);
    const total = DUMMY_SACK_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Sack sales retrieved successfully (DUMMY DATA)',
        data: { sackSales: paginatedData, totalSackSales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchSackSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/sack', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createSackSales = async (salesData) => {
    try {
        const data = await apiClient.post('/sales/sack', salesData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Sack Sales created successfully (SIMULATED)',
            data: { ...salesData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

// Fetch all sack sales for dropdown
export const fetchAllSackSales = async () => {
    return await apiClient.get('/sales/sack/all');
};

// Fetch sack sale by deal number for auto-fill
export const fetchSackSaleByDealNumber = async (dealNumber) => {
    return await apiClient.get(`/sales/sack/by-deal-number/${dealNumber}`);
};

export default { fetchSackSales, createSackSales, fetchAllSackSales, fetchSackSaleByDealNumber };
