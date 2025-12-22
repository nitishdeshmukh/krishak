/**
 * API service for Rice Bran (Kodha) sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_RICEBRAN_SALES = [
    {
        _id: '1',
        dealNumber: 'RB-2024-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        dealDate: '2024-02-15',
        kodhaQuantity: '100',
        kodhaRate: '300',
        kodhaAmount: 30000,
        gstPercent: '18',
        gstAmount: 5400,
        totalAmountWithGst: 35400,
        brokeragePerQuintal: '10',
        brokerPayable: 1000,
        totalPayable: 35400,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'RB-2024-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        dealDate: '2024-03-10',
        kodhaQuantity: '150',
        kodhaRate: '320',
        kodhaAmount: 48000,
        gstPercent: '18',
        gstAmount: 8640,
        totalAmountWithGst: 56640,
        brokeragePerQuintal: '12',
        brokerPayable: 1800,
        totalPayable: 56640,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_RICEBRAN_SALES.slice(startIndex, endIndex);
    const total = DUMMY_RICEBRAN_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Rice Bran sales retrieved successfully (DUMMY DATA)',
        data: { riceBranSales: paginatedData, totalRiceBranSales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchRiceBranSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/ricebran', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createRiceBranSales = async (salesData) => {
    try {
        const data = await apiClient.post('/sales/ricebran', salesData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Rice Bran Sales created successfully (SIMULATED)',
            data: { ...salesData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchRiceBranSales, createRiceBranSales };
