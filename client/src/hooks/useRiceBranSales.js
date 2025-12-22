"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRiceBranSales, createRiceBranSales } from '../api/riceBranSalesApi';

export const useRiceBranSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['riceBranSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRiceBranSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        riceBranSales: query.data?.data?.riceBranSales || [],
        totalRiceBranSales: query.data?.data?.totalRiceBranSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateRiceBranSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRiceBranSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['riceBranSales'] }),
    });
};

export default useRiceBranSales;
