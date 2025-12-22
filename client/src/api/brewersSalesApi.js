/**
 * API service for Brewers sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_BREWERS_SALES = [
    {
        _id: '1',
        dealNumber: 'BS-2024-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        dealDate: '2024-02-15',
        nakkhiQuantity: '100',
        nakkhiRate: '400',
        nakkhiAmount: 40000,
        discountPercent: '2',
        discountAmount: 800,
        brokeragePerQuintal: '10',
        brokerPayable: 1000,
        totalPayable: 39200,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'BS-2024-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        dealDate: '2024-03-10',
        nakkhiQuantity: '150',
        nakkhiRate: '450',
        nakkhiAmount: 67500,
        discountPercent: '1.5',
        discountAmount: 1012.5,
        brokeragePerQuintal: '12',
        brokerPayable: 1800,
        totalPayable: 66487.5,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_BREWERS_SALES.slice(startIndex, endIndex);
    const total = DUMMY_BREWERS_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Brewers sales retrieved successfully (DUMMY DATA)',
        data: { brewersSales: paginatedData, totalBrewersSales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchBrewersSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/brewers', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createBrewersSales = async (salesData) => {
    try {
        const data = await apiClient.post('/sales/brewers', salesData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Brewers Sales created successfully (SIMULATED)',
            data: { ...salesData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchBrewersSales, createBrewersSales };
