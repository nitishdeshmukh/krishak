"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchOtherSales, createOtherSales } from '../api/otherSalesApi';

export const useOtherSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['otherSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchOtherSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        otherSales: query.data?.data?.otherSales || [],
        totalOtherSales: query.data?.data?.totalOtherSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateOtherSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOtherSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['otherSales'] }),
    });
};

export default useOtherSales;
