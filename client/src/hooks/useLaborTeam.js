import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLaborTeams, getLaborTeamById, createLaborTeam, updateLaborTeam, deleteLaborTeam } from '../api/laborTeamApi';
import { toast } from 'sonner';

export const useLaborTeams = () => {
    return useQuery({
        queryKey: ['laborTeams'],
        queryFn: getLaborTeams,
    });
};

export const useLaborTeamById = (id) => {
    return useQuery({
        queryKey: ['laborTeam', id],
        queryFn: () => getLaborTeamById(id),
        enabled: !!id,
    });
};

export const useCreateLaborTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createLaborTeam,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['laborTeams']);
            toast.success(data.message || 'Team added successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to add team');
        },
    });
};

export const useUpdateLaborTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateLaborTeam(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries(['laborTeams']);
            toast.success(data.message || 'Team updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update team');
        },
    });
};

export const useDeleteLaborTeam = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteLaborTeam,
        onSuccess: () => {
            queryClient.invalidateQueries(['laborTeams']);
            toast.success('Team deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete');
        },
    });
};
