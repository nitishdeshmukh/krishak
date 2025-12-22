"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPrivateSackOutward, createPrivateSackOutward } from '../api/privateSackOutwardApi';

export const usePrivateSackOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['privateSackOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPrivateSackOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        privateSackOutward: query.data?.data?.privateSackOutward || [],
        totalPrivateSackOutward: query.data?.data?.totalPrivateSackOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreatePrivateSackOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPrivateSackOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['privateSackOutward'] }),
    });
};

export default usePrivateSackOutward;
