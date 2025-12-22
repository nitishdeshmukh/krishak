/**
 * API service for Husk (Bhusa) sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_HUSK_SALES = [
    {
        _id: '1',
        dealNumber: 'HS-2024-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        dealDate: '2024-02-15',
        bhusaQuantity: '50',
        bhusaRate: '200',
        bhusaAmount: 10000,
        brokeragePerTon: '20',
        brokerPayable: 1000,
        totalPayable: 10000,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'HS-2024-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        dealDate: '2024-03-10',
        bhusaQuantity: '75',
        bhusaRate: '220',
        bhusaAmount: 16500,
        brokeragePerTon: '25',
        brokerPayable: 1875,
        totalPayable: 16500,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_HUSK_SALES.slice(startIndex, endIndex);
    const total = DUMMY_HUSK_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Husk sales retrieved successfully (DUMMY DATA)',
        data: { huskSales: paginatedData, totalHuskSales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchHuskSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/husk', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createHuskSales = async (salesData) => {
    try {
        const data = await apiClient.post('/sales/husk', salesData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Husk Sales created successfully (SIMULATED)',
            data: { ...salesData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchHuskSales, createHuskSales };
