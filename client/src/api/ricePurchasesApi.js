/**
 * API service for rice purchase deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_RICE_PURCHASES = [
    {
        _id: '1',
        dealNumber: 'RD-2024-001',
        partyName: 'Ram Janki',
        brokerName: 'ब्रोकर 1',
        dealDate: '2024-02-10',
        quantity: '300',
        rate: '4000',
        wastagePercent: '1.5',
        brokerage: '15',
        totalAmount: 1200000,
        purchaseType: 'lot-purchase',
        packaging: 'with-packaging',
        newPackagingRate: '60',
        oldPackagingRate: '40',
        plasticPackagingRate: '30',
        frk: 'frk-included',
        frkRate: '5',
        lotNumber: 'LOT-2024-001',
        riceInward: '150',
        riceInwardBalance: '150',
        status: 'active',
        createdAt: '2024-02-10T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'RD-2024-002',
        partyName: 'sarguni industries',
        brokerName: 'ब्रोकर 2',
        dealDate: '2024-03-05',
        quantity: '450',
        rate: '4200',
        wastagePercent: '2',
        brokerage: '18',
        totalAmount: 1890000,
        purchaseType: 'other-purchase',
        packaging: 'without-packaging',
        newPackagingRate: '65',
        oldPackagingRate: '45',
        plasticPackagingRate: '35',
        frk: 'frk-give',
        frkRate: '6',
        lotNumber: '',
        riceInward: '200',
        riceInwardBalance: '250',
        status: 'pending',
        createdAt: '2024-03-05T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_RICE_PURCHASES.slice(startIndex, endIndex);
    const total = DUMMY_RICE_PURCHASES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Rice purchases retrieved successfully (DUMMY DATA)',
        data: { ricePurchases: paginatedData, totalRicePurchases: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchRicePurchases = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/purchases/rice', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createRicePurchase = async (purchaseData) => {
    try {
        const data = await apiClient.post('/purchases/rice', purchaseData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Rice Purchase created successfully (SIMULATED)',
            data: { ...purchaseData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchRicePurchases, createRicePurchase };
