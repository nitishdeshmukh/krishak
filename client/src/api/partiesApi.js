/**
 * API service for party-related endpoints
 * Connects to backend /api/parties endpoints
 */
import apiClient from '@/lib/apiClient';

/**
 * Fetch parties with pagination and filtering
 */
export const fetchParties = async (params = {}) => {
    const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc', filters = {} } = params;

    const queryParams = new URLSearchParams({ page, pageSize, sortBy, sortOrder });
    Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(`filter[${key}]`, value);
    });

    return await apiClient.get(`/parties?${queryParams.toString()}`);
};

/**
 * Fetch single party by ID
 */
export const fetchPartyById = async (id) => {
    return await apiClient.get(`/parties/${id}`);
};

/**
 * Create new party
 */
export const createParty = async (partyData) => {
    return await apiClient.post('/parties', partyData);
};

/**
 * Update party by ID
 */
export const updateParty = async (id, partyData) => {
    return await apiClient.put(`/parties/${id}`, partyData);
};

/**
 * Delete party by ID
 */
export const deleteParty = async (id) => {
    return await apiClient.delete(`/parties/${id}`);
};

export default { fetchParties, fetchPartyById, createParty, updateParty, deleteParty };
