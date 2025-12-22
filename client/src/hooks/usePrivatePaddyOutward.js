"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPrivatePaddyOutward, createPrivatePaddyOutward } from '../api/privatePaddyOutwardApi';

export const usePrivatePaddyOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['privatePaddyOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPrivatePaddyOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        privatePaddyOutward: query.data?.data?.privatePaddyOutward || [],
        totalPrivatePaddyOutward: query.data?.data?.totalPrivatePaddyOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreatePrivatePaddyOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPrivatePaddyOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['privatePaddyOutward'] }),
    });
};

export default usePrivatePaddyOutward;
