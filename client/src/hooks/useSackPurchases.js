"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchSackPurchases, createSackPurchase, fetchAllSackPurchases, fetchSackPurchaseByNumber } from '../api/sackPurchasesApi';

export const useSackPurchases = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['sackPurchases', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchSackPurchases({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        sackPurchases: query.data?.data?.sackPurchases || [],
        totalSackPurchases: query.data?.data?.totalSackPurchases || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateSackPurchase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSackPurchase,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sackPurchases'] }),
    });
};

export const useAllSackPurchases = () => {
    const query = useQuery({
        queryKey: ['sackPurchases', 'all'],
        queryFn: fetchAllSackPurchases,
        staleTime: 60000,
        refetchOnMount: 'always',
    });

    return {
        ...query,
        sackPurchases: query.data?.data?.sackPurchases || [],
    };
};

export const useSackPurchaseByNumber = (purchaseNumber) => {
    const query = useQuery({
        queryKey: ['sackPurchases', 'byNumber', purchaseNumber],
        queryFn: () => fetchSackPurchaseByNumber(purchaseNumber),
        enabled: !!purchaseNumber,
        staleTime: 300000,
    });

    return {
        ...query,
        purchaseDetails: query.data?.data || null,
    };
};

export default useSackPurchases;
