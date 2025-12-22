"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchWhiteBranOutward, createWhiteBranOutward } from '../api/whiteBranOutwardApi';

export const useWhiteBranOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['whiteBranOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchWhiteBranOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        whiteBranOutward: query.data?.data?.whiteBranOutward || [],
        totalWhiteBranOutward: query.data?.data?.totalWhiteBranOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateWhiteBranOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWhiteBranOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whiteBranOutward'] }),
    });
};

export default useWhiteBranOutward;
