"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchFRKSales, createFRKSales } from '../api/frkSalesApi';

export const useFRKSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['frkSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchFRKSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        frkSales: query.data?.data?.frkSales || [],
        totalFRKSales: query.data?.data?.totalFRKSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateFRKSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFRKSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['frkSales'] }),
    });
};

export default useFRKSales;
