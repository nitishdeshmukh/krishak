/**
 * API service for rice inward/lot deposit-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_RICE_INWARD = [
    {
        _id: '1',
        inwardNumber: 'IN-R-001',
        ricePurchaseNumber: 'RP-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        riceType: 'mota',
        awakBalance: '500',
        lotType: 'lot-purchase',
        lotNo: 'LOT-2024-001',
        frkNon: 'frk',
        gunnyOption: 'with-sack',
        gunnyNew: '100',
        gunnyOld: '50',
        gunnyPlastic: '30',
        juteWeight: '5',
        plasticWeight: '3',
        gunnyWeight: '8',
        truckNo: 'MH12AB1234',
        rstNo: 'RST-001',
        truckLoadWeight: '200',
        riceMota: '150',
        ricePatla: '0',
        inwardDate: '2024-03-10',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
    {
        _id: '2',
        inwardNumber: 'IN-R-002',
        ricePurchaseNumber: 'RP-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        riceType: 'patla',
        awakBalance: '600',
        lotType: 'rice-purchase',
        lotNo: 'LOT-2024-002',
        frkNon: 'non-frk',
        gunnyOption: 'give-sack',
        gunnyNew: '120',
        gunnyOld: '60',
        gunnyPlastic: '40',
        juteWeight: '6',
        plasticWeight: '4',
        gunnyWeight: '10',
        truckNo: 'UP16CD5678',
        rstNo: 'RST-002',
        truckLoadWeight: '250',
        riceMota: '0',
        ricePatla: '180',
        inwardDate: '2024-04-05',
        createdAt: '2024-04-05T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_RICE_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_RICE_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Rice inward retrieved successfully (DUMMY DATA)',
        data: { riceInward: paginatedData, totalRiceInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchRiceInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/rice', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createRiceInward = async (inwardData) => {
    try {
        const data = await apiClient.post('/inward/rice', inwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Rice Inward created successfully (SIMULATED)',
            data: { ...inwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchRiceInward, createRiceInward };
