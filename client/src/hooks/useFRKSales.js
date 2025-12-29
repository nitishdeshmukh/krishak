"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchFRKSales, createFRKSales, fetchAllFrkSales, fetchFrkSaleByDealNumber } from '../api/frkSalesApi';

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

// Hook for fetching all FRK sales for dropdown
export const useAllFrkSales = () => {
    const query = useQuery({
        queryKey: ['frkSales', 'all'],
        queryFn: fetchAllFrkSales,
        staleTime: 60000,
        refetchOnMount: 'always',
    });

    return {
        ...query,
        frkSales: query.data?.data?.frkSales || [],
    };
};

// Hook for fetching FRK sale details by deal number
export const useFrkSaleByDealNumber = (dealNumber) => {
    const query = useQuery({
        queryKey: ['frkSales', 'by-deal-number', dealNumber],
        queryFn: () => fetchFrkSaleByDealNumber(dealNumber),
        enabled: !!dealNumber,
        staleTime: 300000,
    });

    return {
        ...query,
        saleDetails: query.data?.data || null,
    };
};

export default useFRKSales;
