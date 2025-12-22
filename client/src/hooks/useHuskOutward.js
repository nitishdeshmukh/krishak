"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchHuskOutward, createHuskOutward } from '../api/huskOutwardApi';

export const useHuskOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['huskOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchHuskOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        huskOutward: query.data?.data?.huskOutward || [],
        totalHuskOutward: query.data?.data?.totalHuskOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateHuskOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createHuskOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['huskOutward'] }),
    });
};

export default useHuskOutward;
