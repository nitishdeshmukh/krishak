"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBrokensSales, createBrokensSales } from '../api/brokensSalesApi';

export const useBrokensSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['brokensSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchBrokensSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        lotSales: query.data?.data?.lotSales || [],
        totalLOTSales: query.data?.data?.totalLOTSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateBrokensSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBrokensSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brokensSales'] }),
    });
};

export default useLOTSales;
