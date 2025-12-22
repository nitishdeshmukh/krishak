"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRiceMilling, createRiceMilling } from '../api/riceMillingApi';

export const useRiceMilling = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['riceMilling', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRiceMilling({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        riceMilling: query.data?.data?.riceMilling || [],
        totalRiceMilling: query.data?.data?.totalRiceMilling || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateRiceMilling = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRiceMilling,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['riceMilling'] }),
    });
};

export default useRiceMilling;
