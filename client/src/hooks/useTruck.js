import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTrucks, createTruck } from '../api/truckApi';
import { toast } from 'sonner';

export const useTrucks = () => {
    return useQuery({
        queryKey: ['trucks'],
        queryFn: getTrucks,
        select: (data) => data.data,
    });
};

export const useCreateTruck = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTruck,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['trucks']);
            toast.success(data.message || 'Truck added successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message || 'Failed to add truck');
        },
    });
};
