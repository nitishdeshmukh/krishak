import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStaff, createStaff } from '../api/staffApi';
import { toast } from 'sonner';

export const useStaff = () => {
    return useQuery({
        queryKey: ['staff'],
        queryFn: getStaff,
        select: (data) => data.data,
    });
};

export const useCreateStaff = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createStaff,
        onSuccess: (data) => {
            queryClient.invalidateQueries(['staff']);
            toast.success(data.message || 'Staff added successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message || 'Failed to add staff');
        },
    });
};
