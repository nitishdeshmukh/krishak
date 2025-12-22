"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchHuskSales, createHuskSales } from '../api/huskSalesApi';

export const useHuskSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['huskSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchHuskSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        huskSales: query.data?.data?.huskSales || [],
        totalHuskSales: query.data?.data?.totalHuskSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateHuskSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createHuskSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['huskSales'] }),
    });
};

export default useHuskSales;
