"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchFrkOutward, createFrkOutward } from '../api/frkOutwardApi';

export const useFrkOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['frkOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchFrkOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        frkOutward: query.data?.data?.frkOutward || [],
        totalFrkOutward: query.data?.data?.totalFrkOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateFrkOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFrkOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['frkOutward'] }),
    });
};

export default useFrkOutward;
