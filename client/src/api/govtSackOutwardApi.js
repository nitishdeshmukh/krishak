/**
 * API service for govt sack outward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_GOVT_SACK_OUTWARD = [
    {
        _id: '1',
        gunnyDmNo: 'DM-001',
        date: '2024-03-10',
        samitiSangrahan: 'समिति 1',
        oldGunnyQty: '500',
        plasticGunnyQty: '200',
        truckNo: 'MH12AB1234',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_GOVT_SACK_OUTWARD.slice(startIndex, endIndex);
    const total = DUMMY_GOVT_SACK_OUTWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Govt sack outward retrieved successfully (DUMMY DATA)',
        data: { govtSackOutward: paginatedData, totalGovtSackOutward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchGovtSackOutward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/outward/govt-sack', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createGovtSackOutward = async (outwardData) => {
    try {
        const data = await apiClient.post('/outward/govt-sack', outwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Govt Sack Outward created successfully (SIMULATED)',
            data: { ...outwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchGovtSackOutward, createGovtSackOutward };
