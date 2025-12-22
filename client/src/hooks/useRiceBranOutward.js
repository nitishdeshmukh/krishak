"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRiceBranOutward, createRiceBranOutward } from '../api/riceBranOutwardApi';

export const useRiceBranOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['riceBranOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRiceBranOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        riceBranOutward: query.data?.data?.riceBranOutward || [],
        totalRiceBranOutward: query.data?.data?.totalRiceBranOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateRiceBranOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRiceBranOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['riceBranOutward'] }),
    });
};

export default useRiceBranOutward;
