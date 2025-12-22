"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPaddyMilling, createPaddyMilling } from '../api/paddyMillingApi';

export const usePaddyMilling = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['paddyMilling', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPaddyMilling({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        paddyMilling: query.data?.data?.paddyMilling || [],
        totalPaddyMilling: query.data?.data?.totalPaddyMilling || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreatePaddyMilling = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaddyMilling,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paddyMilling'] }),
    });
};

export default usePaddyMilling;
