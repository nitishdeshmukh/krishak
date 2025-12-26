/**
 * API service for paddy purchase deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PADDY_PURCHASES = [
    {
        _id: '1',
        dealNumber: 'PD-2024-001',
        partyName: 'Xyz',
        brokerName: 'ब्रोकर 1',
        dealDate: '2024-01-15',
        quantity: '500',
        rate: '2500',
        wastagePercent: '2',
        brokerage: '10',
        totalAmount: 1250000,
        purchaseType: 'do-purchase',
        doEntries: [
            { doInfo: 'DO-INFO-001', doNumber: 'DN-001', committeeName: 'समिति 1', doPaddyQuantity: '200' },
            { doInfo: 'DO-INFO-002', doNumber: 'DN-002', committeeName: 'समिति 2', doPaddyQuantity: '300' }
        ],
        newPackagingRate: '50',
        oldPackagingRate: '30',
        plasticPackagingRate: '25',
        status: 'active',
        createdAt: '2024-01-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'PD-2024-002',
        partyName: 'Ram Janki',
        brokerName: 'ब्रोकर 2',
        dealDate: '2024-02-10',
        quantity: '750',
        rate: '2600',
        wastagePercent: '1.5',
        brokerage: '12',
        totalAmount: 1950000,
        purchaseType: 'other-purchase',
        doEntries: [],
        newPackagingRate: '55',
        oldPackagingRate: '35',
        plasticPackagingRate: '28',
        status: 'completed',
        createdAt: '2024-02-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PADDY_PURCHASES.slice(startIndex, endIndex);
    const total = DUMMY_PADDY_PURCHASES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Paddy purchases retrieved successfully (DUMMY DATA)',
        data: { paddyPurchases: paginatedData, totalPaddyPurchases: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchAllPaddyPurchases = async () => {
    try {
        const response = await apiClient.get('/purchases/paddy/all');
        return response?.data || [];
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return DUMMY_PADDY_PURCHASES;
    }
};

export const fetchPaddyPurchases = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/purchases/paddy', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createPaddyPurchase = async (purchaseData) => {
    try {
        const data = await apiClient.post('/purchases/paddy', purchaseData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Paddy Purchase created successfully (SIMULATED)',
            data: { ...purchaseData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchPaddyPurchases, fetchAllPaddyPurchases, createPaddyPurchase };
