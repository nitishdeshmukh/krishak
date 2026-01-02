import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
    fetchAllOutwardLabor,
    fetchOutwardLaborById,
    createOutwardLabor,
    updateOutwardLabor,
    deleteOutwardLabor,
} from '@/api/outwardLaborApi';
import { toast } from 'sonner';

export const useOutwardLabor = () => {
    const { pageIndex, pageSize, filters } = useSelector((state) => state.table);

    const queryInfo = useQuery({
        queryKey: ['outwardLabor', pageIndex, pageSize, filters],
        queryFn: () => fetchAllOutwardLabor({ page: pageIndex + 1, pageSize, ...filters }),
        placeholderData: (previousData) => previousData,
    });

    return {
        ...queryInfo,
        outwardLabor: queryInfo.data?.data?.outwardLabor || [],
        totalOutwardLabor: queryInfo.data?.data?.totalOutwardLabor || 0,
        totalPages: queryInfo.data?.data?.totalPages || 0,
        currentPage: queryInfo.data?.data?.currentPage || 0,
        hasNext: queryInfo.data?.data?.hasNext,
        hasPrev: queryInfo.data?.data?.hasPrev,
    };
};

export const useOutwardLaborById = (id) => {
    return useQuery({
        queryKey: ['outwardLabor', id],
        queryFn: () => fetchOutwardLaborById(id),
        enabled: !!id,
    });
};

export const useCreateOutwardLabor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOutwardLabor,
        onSuccess: () => {
            queryClient.invalidateQueries(['outwardLabor']);
            // toast.success('Outward Labor created successfully'); // Handled in form
        },
        onError: (error) => {
            // toast.error(`Error: ${error.response?.data?.message || error.message}`); // Handled in form
        },
    });
};

export const useUpdateOutwardLabor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateOutwardLabor(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['outwardLabor']);
            toast.success('Outward Labor updated successfully');
        },
        onError: (error) => {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        },
    });
};

export const useDeleteOutwardLabor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteOutwardLabor,
        onSuccess: () => {
            queryClient.invalidateQueries(['outwardLabor']);
            toast.success('Outward Labor deleted successfully');
        },
        onError: (error) => {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        },
    });
};

export default useOutwardLabor;
