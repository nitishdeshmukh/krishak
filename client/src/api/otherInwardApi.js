/**
 * API service for other inward-related endpoints
 */
import apiClient from '@/lib/apiClient';

const DUMMY_OTHER_INWARD = [
    {
        _id: '1',
        inwardNumber: 'OI-001',
        otherPurchaseNumber: 'OP-001',
        itemName: 'अन्य वस्तु 1',
        quantity: '100',
        quantityType: 'quintal',
        partyName: 'पार्टी 1',
        brokerName: 'ब्रोकर 1',
        gunnyNew: '50',
        gunnyOld: '30',
        gunnyPlastic: '20',
        juteWeight: '3',
        plasticWeight: '1.5',
        truckNo: 'MH12AB1234',
        rstNo: 'RST-001',
        truckLoadWeight: '200',
        truckEmptyWeight: '50',
        truckNetWeight: '150',
        gunnyWeight: '4.5',
        finalWeight: '145.5',
        inwardDate: '2024-03-10',
        createdAt: '2024-03-10T10:30:00.000Z'
    },
    {
        _id: '2',
        inwardNumber: 'OI-002',
        otherPurchaseNumber: 'OP-002',
        itemName: 'अन्य वस्तु 2',
        quantity: '150',
        quantityType: 'kg',
        partyName: 'पार्टी 2',
        brokerName: 'ब्रोकर 2',
        gunnyNew: '60',
        gunnyOld: '40',
        gunnyPlastic: '25',
        juteWeight: '4',
        plasticWeight: '2',
        truckNo: 'UP16CD5678',
        rstNo: 'RST-002',
        truckLoadWeight: '250',
        truckEmptyWeight: '60',
        truckNetWeight: '190',
        gunnyWeight: '6',
        finalWeight: '184',
        inwardDate: '2024-04-05',
        createdAt: '2024-04-05T10:30:00.000Z'
    },
];

const generateDummyResponse = ({ page = 1, pageSize = 10 }) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = DUMMY_OTHER_INWARD.slice(startIndex, endIndex);
    const total = DUMMY_OTHER_INWARD.length;
    const totalPages = Math.ceil(total / pageSize);

    return {
        success: true,
        message: 'Other inward retrieved successfully (DUMMY DATA)',
        data: { otherInward: paginatedData, totalOtherInward: total, pageSize, currentPage: page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
    };
};

export const fetchOtherInward = async ({ page = 1, pageSize = 10, filters = [], sorting = [] }) => {
    const params = { page: page.toString(), pageSize: pageSize.toString() };
    filters.forEach(filter => { if (filter.value) params[`filter[${filter.id}]`] = filter.value; });
    if (sorting.length > 0) { params.sortBy = sorting[0].id; params.sortOrder = sorting[0].desc ? 'desc' : 'asc'; }

    try {
        return await apiClient.get('/inward/other', { params });
    } catch (error) {
        console.warn('⚠️ API not available, using dummy data');
        await new Promise(resolve => setTimeout(resolve, 500));
        return generateDummyResponse({ page, pageSize });
    }
};

export const createOtherInward = async (inwardData) => {
    try {
        const data = await apiClient.post('/inward/other', inwardData);
        return data;
    } catch (error) {
        console.warn('⚠️ API not available, simulating create:', error.message);
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            success: true,
            message: 'Other Inward created successfully (SIMULATED)',
            data: { ...inwardData, _id: Date.now().toString(), createdAt: new Date().toISOString() },
        };
    }
};

export default { fetchOtherInward, createOtherInward };
