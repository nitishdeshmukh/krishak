"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRicePurchases, createRicePurchase, fetchAllRicePurchases, fetchRicePurchaseByNumber } from '../api/ricePurchasesApi';

export const useRicePurchases = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['ricePurchases', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRicePurchases({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        ricePurchases: query.data?.data?.ricePurchases || [],
        totalRicePurchases: query.data?.data?.totalRicePurchases || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateRicePurchase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRicePurchase,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ricePurchases'] }),
    });
};

/**
 * Hook for fetching all rice purchases for dropdown usage
 */
export const useAllRicePurchases = () => {
    const query = useQuery({
        queryKey: ['ricePurchases', 'all'],
        queryFn: fetchAllRicePurchases,
        staleTime: 60000, // 1 minute
        refetchOnMount: 'always',
    });

    return {
        ...query,
        ricePurchases: query.data?.data?.ricePurchases || [],
    };
};

// Hook for fetching rice purchase details by purchase number
export const useRicePurchaseByNumber = (purchaseNumber) => {
    const query = useQuery({
        queryKey: ['ricePurchases', 'by-number', purchaseNumber],
        queryFn: () => fetchRicePurchaseByNumber(purchaseNumber),
        enabled: !!purchaseNumber, // Only fetch if purchaseNumber is provided
        staleTime: 300000, // 5 minutes
    });

    return {
        ...query,
        purchaseDetails: query.data?.data || null,
    };
};

export default useRicePurchases;
