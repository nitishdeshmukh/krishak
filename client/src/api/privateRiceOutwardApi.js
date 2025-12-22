/**
 * API service for private rice outward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PRIVATE_RICE_OUTWARD = [
    {
        _id: '1',
        outwardNumber: 'PRO-001',
        ricePurchaseNumber: 'RP-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        lotNo: 'LOT-001',
        fciNan: 'fci',
        riceType: 'mota',
        dealQuantity: '100',
        gunnyNew: '50',
        gunnyOld: '30',
        gunnyPlastic: '20',
        juteWeight: '3',
        plasticWeight: '1.5',
        truckNo: 'MH12AB1234',
        rstNo: 'RST-001',
        truckWeight: '150',
        gunnyWeight: '4.5',
        finalWeight: '145.5',
        outwardDate: '2024-03-10',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PRIVATE_RICE_OUTWARD.slice(startIndex, endIndex);
    const total = DUMMY_PRIVATE_RICE_OUTWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Private rice outward retrieved successfully (DUMMY DATA)',
        data: { privateRiceOutward: paginatedData, totalPrivateRiceOutward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPrivateRiceOutward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/outward/private-rice', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createPrivateRiceOutward = async (outwardData) => {
    try {
        const data = await apiClient.post('/outward/private-rice', outwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Private Rice Outward created successfully (SIMULATED)',
            data: { ...outwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchPrivateRiceOutward, createPrivateRiceOutward };
