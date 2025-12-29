"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchSackSales, createSackSales, fetchAllSackSales, fetchSackSaleByDealNumber } from '../api/sackSalesApi';

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

// Hook for fetching all sack sales for dropdown
export const useAllSackSales = () => {
    const query = useQuery({
        queryKey: ['sackSales', 'all'],
        queryFn: fetchAllSackSales,
        staleTime: 60000, // 1 minute
        refetchOnMount: 'always',
    });

    return {
        ...query,
        sackSales: query.data?.data?.sackSales || [],
    };
};

// Hook for fetching sack sale details by deal number
export const useSackSaleByDealNumber = (dealNumber) => {
    const query = useQuery({
        queryKey: ['sackSales', 'by-deal-number', dealNumber],
        queryFn: () => fetchSackSaleByDealNumber(dealNumber),
        enabled: !!dealNumber, // Only fetch if dealNumber is provided
        staleTime: 300000, // 5 minutes
    });

    return {
        ...query,
        saleDetails: query.data?.data || null,
    };
};

export default useSackSales;
