/**
 * API service for other purchase deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_OTHER_PURCHASES = [
    {
        _id: '1',
        dealNumber: 'OP-2024-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        itemName: 'अन्य सामग्री',
        dealDate: '2024-02-15',
        quantity: '100',
        quantityType: 'quintal',
        rate: '500',
        amount: 50000,
        gstPercent: '18',
        gstAmount: 9000,
        totalWithGst: 59000,
        discountPercent: '2',
        discountAmount: 1180,
        brokeragePerQuintal: '10',
        brokerPayable: 1000,
        totalPayable: 57820,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'OP-2024-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        itemName: 'अन्य वस्तु',
        dealDate: '2024-03-10',
        quantity: '50',
        quantityType: 'kg',
        rate: '200',
        amount: 10000,
        gstPercent: '12',
        gstAmount: 1200,
        totalWithGst: 11200,
        discountPercent: '5',
        discountAmount: 560,
        brokeragePerQuintal: '5',
        brokerPayable: 250,
        totalPayable: 10640,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_OTHER_PURCHASES.slice(startIndex, endIndex);
    const total = DUMMY_OTHER_PURCHASES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Other purchases retrieved successfully (DUMMY DATA)',
        data: { otherPurchases: paginatedData, totalOtherPurchases: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchOtherPurchases = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/purchases/other', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createOtherPurchase = async (purchaseData) => {
    try {
        const data = await apiClient.post('/purchases/other', purchaseData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Other Purchase created successfully (SIMULATED)',
            data: { ...purchaseData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchOtherPurchases, createOtherPurchase };
