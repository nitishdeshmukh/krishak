"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPrivatePaddyInward, createPrivatePaddyInward } from '../api/privatePaddyInwardApi';

export const usePrivatePaddyInward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['privatePaddyInward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPrivatePaddyInward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        privatePaddyInward: query.data?.data?.privatePaddyInward || [],
        totalPrivatePaddyInward: query.data?.data?.totalPrivatePaddyInward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreatePrivatePaddyInward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPrivatePaddyInward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['privatePaddyInward'] }),
    });
};

export default usePrivatePaddyInward;
