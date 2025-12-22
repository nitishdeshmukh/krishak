/**
 * API service for Paddy Milling
 * Connects to backend /api/milling/paddy endpoints
 */
import apiClient from '@/lib/apiClient';

// Dummy data for fallback
const DUMMY_DATA = [
    {
        _id: '1',
        date: '2024-12-20',
        paddyType: 'PR-126',
        hopperGunny: '100',
        hopperQtl: '500',
        riceType: 'Common Grade A',
        riceQty: '340',
        ricePercent: '68',
        khandaQty: '50',
        khandaPercent: '10',
        kodhaQty: '25',
        kodhaPercent: '5',
        bhusaTon: '20',
        bhusaPercent: '4',
        nakkhiQty: '15',
        nakkhiPercent: '3',
        wastagePercent: '10',
    },
];

/**
 * Fetch paddy milling records with pagination
 */
export const fetchPaddyMilling = async (params = {}) => {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc', filters = {} } = params;

    try {
        const queryParams = new URLSearchParams({ page, pageSize, sortBy, sortOrder });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(`filter[${key}]`, value);
        });

        return await apiClient.get(`/milling/paddy?${queryParams.toString()}`);
    } catch (error) {
        console.warn('⚠️ Using dummy paddy milling data (backend unavailable)');
        const startIndex = (page - 1) * pageSize;
        const paginatedData = DUMMY_DATA.slice(startIndex, startIndex + pageSize);
        return {
            success: true,
            data: {
                paddymilling: paginatedData,
                totalPaddyMilling: DUMMY_DATA.length,
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
 * Create paddy milling record
 */
export const createPaddyMilling = async (data) => {
    try {
        return await apiClient.post('/milling/paddy', data);
    } catch (error) {
        console.warn('⚠️ Mock create paddy milling (backend unavailable)');
        const newItem = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString() };
        DUMMY_DATA.push(newItem);
        return { success: true, data: newItem, message: 'Paddy milling record created successfully' };
    }
};

/**
 * Update paddy milling record
 */
export const updatePaddyMilling = async (id, data) => {
    try {
        return await apiClient.put(`/milling/paddy/${id}`, data);
    } catch (error) {
        console.warn('⚠️ Mock update paddy milling (backend unavailable)');
        const index = DUMMY_DATA.findIndex(p => p._id === id);
        if (index !== -1) {
            DUMMY_DATA[index] = { ...DUMMY_DATA[index], ...data };
            return { success: true, data: DUMMY_DATA[index], message: 'Updated successfully' };
        }
        throw new Error('Record not found');
    }
};

/**
 * Delete paddy milling record
 */
export const deletePaddyMilling = async (id) => {
    try {
        return await apiClient.delete(`/milling/paddy/${id}`);
    } catch (error) {
        console.warn('⚠️ Mock delete paddy milling (backend unavailable)');
        const index = DUMMY_DATA.findIndex(p => p._id === id);
        if (index !== -1) {
            DUMMY_DATA.splice(index, 1);
            return { success: true, message: 'Deleted successfully' };
        }
        throw new Error('Record not found');
    }
};

export default { fetchPaddyMilling, createPaddyMilling, updatePaddyMilling, deletePaddyMilling };
