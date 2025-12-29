"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchOtherPurchases, createOtherPurchase, fetchAllOtherPurchases } from '../api/otherPurchasesApi';

export const useOtherPurchases = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['otherPurchases', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchOtherPurchases({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        otherPurchases: query.data?.data?.otherPurchases || [],
        totalOtherPurchases: query.data?.data?.totalOtherPurchases || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateOtherPurchase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOtherPurchase,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['otherPurchases'] }),
    });
};

export const useAllOtherPurchases = () => {
    const query = useQuery({
        queryKey: ['otherPurchases', 'all'],
        queryFn: fetchAllOtherPurchases,
        staleTime: 60000,
        refetchOnMount: 'always',
    });

    return {
        ...query,
        otherPurchases: query.data || [],
    };
};

export default useOtherPurchases;
