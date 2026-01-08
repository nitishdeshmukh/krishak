import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPaddyPurchases, fetchAllPaddyPurchases, createPaddyPurchase, deletePaddyPurchase } from '../api/paddyPurchasesApi';

export const usePaddyPurchases = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['paddyPurchases', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPaddyPurchases({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        paddyPurchases: query.data?.data?.paddyPurchases || [],
        totalPaddyPurchases: query.data?.data?.totalPaddyPurchases || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useAllPaddyPurchases = () => {
    const query = useQuery({
        queryKey: ['paddyPurchases-all'],
        queryFn: fetchAllPaddyPurchases,
        staleTime: 0,
        refetchOnMount: 'always',
    });

    return {
        ...query,
        paddyPurchases: query.data || [],
    };
};

export const useCreatePaddyPurchase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaddyPurchase,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paddyPurchases'] }),
    });
};

export const useDeletePaddyPurchase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePaddyPurchase,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paddyPurchases'] }),
    });
};

export default usePaddyPurchases;

