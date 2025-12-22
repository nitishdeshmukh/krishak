"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchFrkInward, createFrkInward } from '../api/frkInwardApi';

export const useFrkInward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['frkInward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchFrkInward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        frkInward: query.data?.data?.frkInward || [],
        totalFrkInward: query.data?.data?.totalFrkInward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateFrkInward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFrkInward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['frkInward'] }),
    });
};

export default useFrkInward;
