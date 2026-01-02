import apiClient from '@/lib/apiClient';

const API_URL = '/labor-teams';

export const getLaborTeams = async () => {
    const response = await apiClient.get(API_URL);
    return response.data;
};

export const getLaborTeamById = async (id) => {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data;
};

export const createLaborTeam = async (data) => {
    const response = await apiClient.post(API_URL, data);
    return response.data;
};

export const updateLaborTeam = async (id, data) => {
    const response = await apiClient.put(`${API_URL}/${id}`, data);
    return response.data;
};

export const deleteLaborTeam = async (id) => {
    const response = await apiClient.delete(`${API_URL}/${id}`);
    return response.data;
};
