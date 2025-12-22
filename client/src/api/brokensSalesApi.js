/**
 * API service for BROKENS sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_BROKENS_SALES = [
    {
        _id: '1',
        dealNumber: 'LS-2024-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        dealDate: '2024-02-15',
        khandaQuantity: '100',
        khandaRate: '500',
        khandaAmount: 50000,
        discountPercent: '2',
        discountAmount: 1000,
        brokeragePerQuintal: '10',
        brokerPayable: 1000,
        totalPayable: 49000,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'LS-2024-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        dealDate: '2024-03-10',
        khandaQuantity: '150',
        khandaRate: '550',
        khandaAmount: 82500,
        discountPercent: '1.5',
        discountAmount: 1237.5,
        brokeragePerQuintal: '12',
        brokerPayable: 1800,
        totalPayable: 81262.5,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_LOT_SALES.slice(startIndex, endIndex);
    const total = DUMMY_LOT_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'LOT sales retrieved successfully (DUMMY DATA)',
        data: { lotSales: paginatedData, totalLOTSales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchBrokensSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/brokens', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createBrokensSales = async (salesData) => {
    try {
        const data = await apiClient.post('/sales/brokens', salesData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'LOT Sales created successfully (SIMULATED)',
            data: { ...salesData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchBrokensSales, createBrokensSales };
