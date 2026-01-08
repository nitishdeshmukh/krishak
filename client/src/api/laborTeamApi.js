import apiClient from '@/lib/apiClient';

const API_URL = '/labor-teams';

export const getLaborTeams = async () => {
    return await apiClient.get(API_URL);
};

export const getLaborTeamById = async (id) => {
    return await apiClient.get(`${API_URL}/${id}`);
};

export const createLaborTeam = async (data) => {
    return await apiClient.post(API_URL, data);
};

export const updateLaborTeam = async (id, data) => {
    return await apiClient.put(`${API_URL}/${id}`, data);
};

export const deleteLaborTeam = async (id) => {
    return await apiClient.delete(`${API_URL}/${id}`);
};
