/**
 * API service for Other Sales deal-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_OTHER_SALES = [
    {
        _id: '1',
        dealNumber: 'OS-2024-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        dealDate: '2024-02-15',
        itemName: 'अन्य वस्तु 1',
        quantity: '100',
        quantityType: 'quintal',
        rate: '500',
        amount: 50000,
        gstPercent: '18',
        gstAmount: 9000,
        totalAmountWithGst: 59000,
        discountPercent: '5',
        discountAmount: 2950,
        brokeragePerQuintal: '10',
        brokerPayable: 1000,
        totalPayable: 56050,
        status: 'active',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
    {
        _id: '2',
        dealNumber: 'OS-2024-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        dealDate: '2024-03-10',
        itemName: 'अन्य वस्तु 2',
        quantity: '50',
        quantityType: 'ton',
        rate: '1000',
        amount: 50000,
        gstPercent: '12',
        gstAmount: 6000,
        totalAmountWithGst: 56000,
        discountPercent: '2',
        discountAmount: 1120,
        brokeragePerQuintal: '15',
        brokerPayable: 750,
        totalPayable: 54880,
        status: 'completed',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_OTHER_SALES.slice(startIndex, endIndex);
    const total = DUMMY_OTHER_SALES.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Other sales retrieved successfully (DUMMY DATA)',
        data: { otherSales: paginatedData, totalOtherSales: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchOtherSales = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/sales/other', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createOtherSales = async (salesData) => {
    try {
        const data = await apiClient.post('/sales/other', salesData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Other Sales created successfully (SIMULATED)',
            data: { ...salesData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchOtherSales, createOtherSales };
