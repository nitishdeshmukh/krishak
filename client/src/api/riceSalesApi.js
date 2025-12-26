/**
 * API service for rice sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_RICE_SALES = [
    {
        _id: '1',
        dealNumber: 'RS-2024-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        lotType: 'lot-sale',
        lotEntries: [{ lotNo: 'LOT-001' }],
        saleType: 'fci',
        riceType: 'चावल प्रकार 1',
        dealDate: '2024-02-15',
        quantity: '100',
        rate: '4500',
        discountPercent: '2',
        brokeragePerQuintal: '15',
        packaging: 'with-weight',
        newPackagingRate: '60',
        oldPackagingRate: '40',
        plasticPackagingRate: '25',
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'RS-2024-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        lotType: 'lot-sale',
        lotEntries: [{ lotNo: 'LOT-002' }, { lotNo: 'LOT-003' }],
        saleType: 'nan',
        riceType: 'चावल प्रकार 2',
        dealDate: '2024-03-10',
        quantity: '150',
        rate: '4800',
        discountPercent: '1.5',
        brokeragePerQuintal: '12',
        packaging: 'return',
        newPackagingRate: '0',
        oldPackagingRate: '0',
        plasticPackagingRate: '0',
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_RICE_SALES.slice(startIndex, endIndex);
    const total = DUMMY_RICE_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Rice sales retrieved successfully (DUMMY DATA)',
        data: { riceSales: paginatedData, totalRiceSales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchRiceSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/rice', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createRiceSales = async (salesData) => {
    try {
        const data = await apiClient.post('/sales/rice', salesData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Rice Sales created successfully (SIMULATED)',
            data: { ...salesData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchRiceSales, createRiceSales };
