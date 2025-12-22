/**
 * API service for private paddy inward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_PRIVATE_PADDY_INWARD = [
    {
        _id: '1',
        inwardNumber: 'PVT-IN-001',
        paddyPurchaseNumber: 'PP-001',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        balDo: '500',
        purchaseType: 'do-purchase',
        doEntries: [
            { doNumber: 'DO-001', samitiSangrahan: 'समिति 1' }
        ],
        gunnyOption: 'with-weight',
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
        inwardNumber: 'PVT-IN-002',
        paddyPurchaseNumber: 'PP-002',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        balDo: '600',
        purchaseType: 'other-purchase',
        doEntries: [],
        gunnyOption: 'with-price',
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
    const paginatedData = DUMMY_PRIVATE_PADDY_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_PRIVATE_PADDY_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Private Paddy inward retrieved successfully (DUMMY DATA)',
        data: { privatePaddyInward: paginatedData, totalPrivatePaddyInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchPrivatePaddyInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/paddy/private', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createPrivatePaddyInward = async (inwardData) => {
    try {
        const data = await apiClient.post('/inward/paddy/private', inwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Private Paddy Inward created successfully (SIMULATED)',
            data: { ...inwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchPrivatePaddyInward, createPrivatePaddyInward };
