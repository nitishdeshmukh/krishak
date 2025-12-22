/**
 * API service for FRK inward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_FRK_INWARD = [
    {
        _id: '1',
        inwardNumber: 'FI-001',
        partyName: 'पार्टी 1',
        gunnyPlastic: '50',
        plasticWeight: '2.5',
        truckNo: 'MH12AB1234',
        rstNo: 'RST-001',
        truckWeight: '150',
        gunnyWeight: '2.5',
        finalWeight: '147.5',
        inwardDate: '2024-03-10',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
    {
        _id: '2',
        inwardNumber: 'FI-002',
        partyName: 'पार्टी 2',
        gunnyPlastic: '60',
        plasticWeight: '3',
        truckNo: 'UP16CD5678',
        rstNo: 'RST-002',
        truckWeight: '190',
        gunnyWeight: '3',
        finalWeight: '187',
        inwardDate: '2024-04-05',
        createdAt: '2024-04-05T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_FRK_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_FRK_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'FRK inward retrieved successfully (DUMMY DATA)',
        data: { frkInward: paginatedData, totalFrkInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchFrkInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/frk', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createFrkInward = async (inwardData) => {
    try {
        const data = await apiClient.post('/inward/frk', inwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'FRK Inward created successfully (SIMULATED)',
            data: { ...inwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchFrkInward, createFrkInward };
