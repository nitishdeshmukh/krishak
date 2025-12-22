/**
 * API service for paddy inward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PADDY_INWARD = [
    {
        _id: '1',
        inwardNumber: 'IN-P-001',
        doNumber: 'DO-001',
        samitiSangrahan: 'samiti1',
        balDo: '500',
        gunnyNew: '100',
        gunnyOld: '50',
        gunnyPlastic: '30',
        juteWeight: '5',
        plasticWeight: '3',
        gunnyWeight: '8',
        truckNo: 'MH12AB1234',
        rstNo: 'RST-001',
        truckLoadWeight: '200',
        dhanType: 'mota',
        dhanMota: '150',
        dhanPatla: '0',
        dhanSarna: '0',
        dhanMaha: '0',
        dhanRb: '0',
        inwardDate: '2024-01-20',
        createdAt: '2024-01-20T10:30:00.000Z'
    },
    {
        _id: '2',
        inwardNumber: 'IN-P-002',
        doNumber: 'DO-002',
        samitiSangrahan: 'samiti2',
        balDo: '600',
        gunnyNew: '120',
        gunnyOld: '60',
        gunnyPlastic: '40',
        juteWeight: '6',
        plasticWeight: '4',
        gunnyWeight: '10',
        truckNo: 'UP16CD5678',
        rstNo: 'RST-002',
        truckLoadWeight: '250',
        dhanType: 'patla',
        dhanMota: '0',
        dhanPatla: '180',
        dhanSarna: '0',
        dhanMaha: '0',
        dhanRb: '0',
        inwardDate: '2024-02-15',
        createdAt: '2024-02-15T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_PADDY_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_PADDY_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Paddy inward retrieved successfully (DUMMY DATA)',
        data: { paddyInward: paginatedData, totalPaddyInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPaddyInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/paddy', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createGovPaddyInward = async (inwardData) => {
    try {
        const data = await apiClient.post('/inward/paddy/gov', inwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Government Paddy Inward created successfully (SIMULATED)',
            data: { ...inwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchPaddyInward, createGovPaddyInward };
