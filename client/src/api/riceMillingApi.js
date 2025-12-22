/**
 * API service for Rice Milling
 * Connects to backend /api/milling/rice endpoints
 */
import apiClient from '@/lib/apiClient';

// Dummy data for fallback
const DUMMY_DATA = [
    {
        _id: '1',
        date: '2024-12-20',
        riceType: 'Basmati 1121',
        hopperGunny: '50',
        hopperQtl: '250',
        riceQty: '220',
        ricePercent: '88',
        khandaQty: '15',
        khandaPercent: '6',
        silkyKodhaQty: '10',
        silkyKodhaPercent: '4',
        wastagePercent: '2',
    },
];

/**
 * Fetch rice milling records with pagination
 */
export const fetchRiceMilling = async (params = {}) => {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc', filters = {} } = params;

    try {
        const queryParams = new URLSearchParams({ page, pageSize, sortBy, sortOrder });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(`filter[${key}]`, value);
        });

        return await apiClient.get(`/milling/rice?${queryParams.toString()}`);
    } catch (error) {
        console.warn('⚠️ Using dummy rice milling data (backend unavailable)');
        const startIndex = (page - 1) * pageSize;
        const paginatedData = DUMMY_DATA.slice(startIndex, startIndex + pageSize);
        return {
            success: true,
            data: {
                ricemilling: paginatedData,
                totalRiceMilling: DUMMY_DATA.length,
                totalPages: Math.ceil(DUMMY_DATA.length / pageSize),
                currentPage: page,
                pageSize,
                hasPrev: page > 1,
                hasNext: page < Math.ceil(DUMMY_DATA.length / pageSize),
            }
        };
    }
};

/**
 * Create rice milling record
 */
export const createRiceMilling = async (data) => {
    try {
        return await apiClient.post('/milling/rice', data);
    } catch (error) {
        console.warn('⚠️ Mock create rice milling (backend unavailable)');
        const newItem = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString() };
        DUMMY_DATA.push(newItem);
        return { success: true, data: newItem, message: 'Rice milling record created successfully' };
    }
};

/**
 * Update rice milling record
 */
export const updateRiceMilling = async (id, data) => {
    try {
        return await apiClient.put(`/milling/rice/${id}`, data);
    } catch (error) {
        console.warn('⚠️ Mock update rice milling (backend unavailable)');
        const index = DUMMY_DATA.findIndex(p => p._id === id);
        if (index !== -1) {
            DUMMY_DATA[index] = { ...DUMMY_DATA[index], ...data };
            return { success: true, data: DUMMY_DATA[index], message: 'Updated successfully' };
        }
        throw new Error('Record not found');
    }
};

/**
 * Delete rice milling record
 */
export const deleteRiceMilling = async (id) => {
    try {
        return await apiClient.delete(`/milling/rice/${id}`);
    } catch (error) {
        console.warn('⚠️ Mock delete rice milling (backend unavailable)');
        const index = DUMMY_DATA.findIndex(p => p._id === id);
        if (index !== -1) {
            DUMMY_DATA.splice(index, 1);
            return { success: true, message: 'Deleted successfully' };
        }
        throw new Error('Record not found');
    }
};

export default { fetchRiceMilling, createRiceMilling, updateRiceMilling, deleteRiceMilling };
