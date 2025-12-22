"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBrokensOutward, createBrokensOutward } from '../api/brokensOutwardApi';

export const useBrokensOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['brokensOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchBrokensOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        brokensOutward: query.data?.data?.brokensOutward || [],
        totalBrokensOutward: query.data?.data?.totalBrokensOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateBrokensOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBrokensOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brokensOutward'] }),
    });
};

export default useBrokensOutward;
