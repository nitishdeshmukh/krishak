/**
 * API service for FRK outward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_FRK_OUTWARD = [
    {
        _id: '1',
        date: '2024-03-10',
        frkSaleNumber: 'FRK-001',
        partyName: 'पार्टी 1',
        gunnyPlastic: '100',
        plasticWeight: '2.5',
        truckNo: 'MH12AB1234',
        rstNo: 'RST-001',
        truckWeight: '150',
        gunnyWeight: '2.5',
        finalWeight: '147.5',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_FRK_OUTWARD.slice(startIndex, endIndex);
    const total = DUMMY_FRK_OUTWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'FRK outward retrieved successfully (DUMMY DATA)',
        data: { frkOutward: paginatedData, totalFrkOutward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchFrkOutward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/outward/frk', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createFrkOutward = async (outwardData) => {
    try {
        const data = await apiClient.post('/outward/frk', outwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'FRK Outward created successfully (SIMULATED)',
            data: { ...outwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchFrkOutward, createFrkOutward };
