"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRiceInward, createRiceInward, fetchAllLotNumbers } from '../api/riceInwardApi';

// Hook for fetching all lot numbers (for dropdown)
export const useAllLotNumbers = () => {
    const query = useQuery({
        queryKey: ['lotNumbers', 'all'],
        queryFn: fetchAllLotNumbers,
        staleTime: 300000, // 5 minutes
    });

    return {
        ...query,
        lotNumbers: query.data?.data || [],
    };
};

export const useRiceInward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['riceInward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRiceInward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        riceInward: query.data?.data?.riceInward || [],
        totalRiceInward: query.data?.data?.totalRiceInward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateRiceInward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRiceInward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['riceInward'] }),
    });
};

export default useRiceInward;
