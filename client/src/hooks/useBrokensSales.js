"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBrokensSales, createBrokensSales, fetchAllBrokensSales, fetchBrokensSaleByDealNumber } from '../api/brokensSalesApi';

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
        brokensSales: query.data?.data?.brokensSales || [],
        totalBrokensSales: query.data?.data?.totalBrokensSales || 0,
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

// Hook for fetching all Brokens sales for dropdown
export const useAllBrokensSales = () => {
    const query = useQuery({
        queryKey: ['brokensSales', 'all'],
        queryFn: fetchAllBrokensSales,
        staleTime: 60000,
        refetchOnMount: 'always',
    });

    return {
        ...query,
        brokensSales: query.data?.data?.brokensSales || [],
    };
};

// Hook for fetching Brokens sale details by deal number
export const useBrokensSaleByDealNumber = (dealNumber) => {
    const query = useQuery({
        queryKey: ['brokensSales', 'by-deal-number', dealNumber],
        queryFn: () => fetchBrokensSaleByDealNumber(dealNumber),
        enabled: !!dealNumber,
        staleTime: 300000,
    });

    return {
        ...query,
        saleDetails: query.data?.data || null,
    };
};

export default useBrokensSales;
