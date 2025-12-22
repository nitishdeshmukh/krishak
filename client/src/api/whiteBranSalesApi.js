/**
 * API service for White Bran (Silky Kodha) sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_WHITEBRAN_SALES = [
    {
        _id: '1',
        dealNumber: 'WB-2024-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        dealDate: '2024-02-15',
        silkyKodhaQuantity: '100',
        silkyKodhaRate: '350',
        silkyKodhaAmount: 35000,
        gstPercent: '18',
        gstAmount: 6300,
        totalAmountWithGst: 41300,
        brokeragePerQuintal: '10',
        brokerPayable: 1000,
        totalPayable: 41300,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'WB-2024-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        dealDate: '2024-03-10',
        silkyKodhaQuantity: '150',
        silkyKodhaRate: '380',
        silkyKodhaAmount: 57000,
        gstPercent: '18',
        gstAmount: 10260,
        totalAmountWithGst: 67260,
        brokeragePerQuintal: '12',
        brokerPayable: 1800,
        totalPayable: 67260,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_WHITEBRAN_SALES.slice(startIndex, endIndex);
    const total = DUMMY_WHITEBRAN_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'White Bran sales retrieved successfully (DUMMY DATA)',
        data: { whiteBranSales: paginatedData, totalWhiteBranSales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchWhiteBranSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/whitebran', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createWhiteBranSales = async (salesData) => {
    try {
        const data = await apiClient.post('/sales/whitebran', salesData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'White Bran Sales created successfully (SIMULATED)',
            data: { ...salesData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchWhiteBranSales, createWhiteBranSales };
