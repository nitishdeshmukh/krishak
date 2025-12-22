"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchWhiteBranSales, createWhiteBranSales } from '../api/whiteBranSalesApi';

export const useWhiteBranSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['whiteBranSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchWhiteBranSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        whiteBranSales: query.data?.data?.whiteBranSales || [],
        totalWhiteBranSales: query.data?.data?.totalWhiteBranSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateWhiteBranSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createWhiteBranSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['whiteBranSales'] }),
    });
};

export default useWhiteBranSales;
