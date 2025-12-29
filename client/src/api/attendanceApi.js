import apiClient from '../lib/apiClient';

export const createBulkAttendance = async (data) => {
    const response = await apiClient.post('/attendance/bulk', data);
    return response;
};

export const fetchAttendanceByDate = async (date) => {
    const response = await apiClient.get('/attendance/by-date', { params: { date } });
    return response;
};

export const fetchAttendanceReport = async (filters) => {
    const response = await apiClient.get('/attendance', { params: filters });
    return response;
};

export const deleteAttendance = async (id) => {
    const response = await apiClient.delete(`/attendance/${id}`);
    return response;
};
