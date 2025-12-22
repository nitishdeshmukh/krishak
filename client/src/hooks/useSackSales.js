"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchSackSales, createSackSales } from '../api/sackSalesApi';

export const useSackSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['sackSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchSackSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        sackSales: query.data?.data?.sackSales || [],
        totalSackSales: query.data?.data?.totalSackSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateSackSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSackSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sackSales'] }),
    });
};

export default useSackSales;
