/**
 * API service for sack inward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_SACK_INWARD = [
    {
        _id: '1',
        inwardNumber: 'SI-001',
        sackPurchaseNumber: 'SP-001',
        partyName: 'पार्टी 1',
        gunnyNew: '100',
        gunnyOld: '50',
        gunnyPlastic: '30',
        gunnyBundle: '20',
        inwardDate: '2024-03-10',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
    {
        _id: '2',
        inwardNumber: 'SI-002',
        sackPurchaseNumber: 'SP-002',
        partyName: 'पार्टी 2',
        gunnyNew: '150',
        gunnyOld: '75',
        gunnyPlastic: '40',
        gunnyBundle: '25',
        inwardDate: '2024-04-05',
        createdAt: '2024-04-05T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_SACK_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_SACK_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Sack inward retrieved successfully (DUMMY DATA)',
        data: { sackInward: paginatedData, totalSackInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchSackInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/sack', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createSackInward = async (inwardData) => {
    try {
        const data = await apiClient.post('/inward/sack', inwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Sack Inward created successfully (SIMULATED)',
            data: { ...inwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export const fetchAllSackInward = async () => {
    return await fetchSackInward({ page: 1, pageSize: 1000 });
};

export default { fetchSackInward, fetchAllSackInward, createSackInward };
