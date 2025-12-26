"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBrokers, createBroker, updateBroker, deleteBroker, fetchAllBrokers } from '../api/brokersApi';

export const useBrokers = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['brokers', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchBrokers({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        brokers: query.data?.data?.brokers || [],
        totalBrokers: query.data?.data?.totalBrokers || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateBroker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBroker,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brokers'] }),
    });
};

export const useUpdateBroker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateBroker(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brokers'] }),
    });
};

export const useDeleteBroker = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteBroker,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brokers'] }),
    });
};

/**
 * Hook for fetching all brokers for dropdown usage
 */
export const useAllBrokers = () => {
    const query = useQuery({
        queryKey: ['brokers', 'all'],
        queryFn: fetchAllBrokers,
        staleTime: 60000, // 1 minute
        refetchOnMount: 'always',
    });

    return {
        ...query,
        brokers: query.data?.data?.brokers || [],
    };
};

export default useBrokers;
