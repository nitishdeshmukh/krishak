"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPaddySales, createPaddySale, fetchAllPaddySales, fetchPaddySaleBySaleNumber } from '../api/paddySalesApi';

// Hook for fetching all paddy sales (only sale numbers for dropdown)
export const useAllPaddySales = () => {
    const query = useQuery({
        queryKey: ['paddySales', 'all'],
        queryFn: fetchAllPaddySales,
        staleTime: 300000, // 5 minutes
    });

    return {
        ...query,
        paddySales: query.data?.data || [],
    };
};

// Hook for fetching paddy sale details by sale number
export const usePaddySaleBySaleNumber = (saleNumber) => {
    const query = useQuery({
        queryKey: ['paddySales', 'by-number', saleNumber],
        queryFn: () => fetchPaddySaleBySaleNumber(saleNumber),
        enabled: !!saleNumber, // Only fetch if saleNumber is provided
        staleTime: 300000, // 5 minutes
    });

    return {
        ...query,
        saleDetails: query.data?.data || null,
    };
};

export const usePaddySales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['paddySales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPaddySales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        paddySales: query.data?.data?.paddySales || [],
        totalPaddySales: query.data?.data?.totalPaddySales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreatePaddySale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaddySale,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paddySales'] }),
    });
};

export default usePaddySales;
