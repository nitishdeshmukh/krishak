/**
 * API service for other outward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_OTHER_OUTWARD = [
    {
        _id: '1',
        date: '2024-03-10',
        otherSaleNumber: 'OS-001',
        itemName: 'वस्तु 1',
        quantity: '100',
        quantityType: 'kg',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        gunnyNew: '50',
        gunnyOld: '30',
        gunnyPlastic: '20',
        juteWeight: '2.5',
        plasticWeight: '1.5',
        truckNo: 'MH12AB1234',
        rstNo: 'RST-001',
        truckWeight: '150',
        gunnyWeight: '4.0',
        finalWeight: '146',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_OTHER_OUTWARD.slice(startIndex, endIndex);
    const total = DUMMY_OTHER_OUTWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Other outward retrieved successfully (DUMMY DATA)',
        data: { otherOutward: paginatedData, totalOtherOutward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchOtherOutward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/outward/other', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createOtherOutward = async (outwardData) => {
    try {
        const data = await apiClient.post('/outward/other', outwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Other Outward created successfully (SIMULATED)',
            data: { ...outwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchOtherOutward, createOtherOutward };
