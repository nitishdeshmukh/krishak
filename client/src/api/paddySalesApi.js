/**
 * API service for paddy sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PADDY_SALES = [
    {
        _id: '1', dealNumber: 'PS-2024-001', partyName: 'PARTY 3', brokerName: 'BROKER 1', dealDate: '2024-03-15',
        salesType: 'do-sales', quantity: '400', delivery: 'at-location',
        doEntries: [{ doNumber: 'DO-001', dhanMota: '100', dhanPatla: '150', dhanSarna: '150' }],
        paddyType: 'मोटा (Grade-A)', paddyQuantity: '400', paddyRate: '2800', wastagePercent: '2', brokerage: '10',
        packaging: 'with-weight', newPackagingRate: '', oldPackagingRate: '', plasticPackagingRate: '',
        totalAmount: 1120000, status: 'completed', createdAt: '2024-03-15T10:30:00.000Z'
    },
    {
        _id: '2', dealNumber: 'PS-2024-002', partyName: 'PARTY 1', brokerName: 'BROKER 2', dealDate: '2024-04-01',
        salesType: 'do-sales', quantity: '550', delivery: 'delivered',
        doEntries: [{ doNumber: 'DO-002', dhanMota: '200', dhanPatla: '200', dhanSarna: '150' }],
        paddyType: 'पतला (Grade-A)', paddyQuantity: '550', paddyRate: '2900', wastagePercent: '1.5', brokerage: '12',
        packaging: 'with-quantity', newPackagingRate: '50', oldPackagingRate: '30', plasticPackagingRate: '25',
        totalAmount: 1595000, status: 'active', createdAt: '2024-04-01T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PADDY_SALES.slice(startIndex, endIndex);
    const total = DUMMY_PADDY_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Paddy sales retrieved successfully (DUMMY DATA)',
        data: { paddySales: paginatedData, totalPaddySales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPaddySales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/paddy', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createPaddySale = async (saleData) => {
    try {
        const data = await apiClient.post('/sales/paddy', saleData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Paddy Sale created successfully (SIMULATED)',
            data: { ...saleData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchPaddySales, createPaddySale };
