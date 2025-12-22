"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchSackInward, createSackInward } from '../api/sackInwardApi';

export const useSackInward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['sackInward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchSackInward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        sackInward: query.data?.data?.sackInward || [],
        totalSackInward: query.data?.data?.totalSackInward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateSackInward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSackInward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sackInward'] }),
    });
};

export default useSackInward;
