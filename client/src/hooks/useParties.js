"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchParties, createParty, updateParty, deleteParty, fetchAllParties } from '../api/partiesApi';

/**
 * React Query hook for fetching parties with pagination
 * Uses Redux state for pagination parameters
 * @returns {Object} React Query result with parties data, loading, and error states
 */
export const useParties = () => {
    // Get table state from Redux
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);

    // Convert 0-indexed pageIndex to 1-indexed page for API
    const page = pageIndex + 1;

    // Use React Query to fetch and cache data
    const query = useQuery({
        queryKey: ['parties', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchParties({
            page,
            pageSize,
            filters: columnFilters,
            sorting,
        }),
        keepPreviousData: true, // Keep showing old data while fetching new data
        staleTime: 30000, // Consider data fresh for 30 seconds
    });

    return {
        ...query,
        parties: query.data?.data?.parties || [],
        totalParties: query.data?.data?.totalParties || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

/**
 * Mutation hook for creating a new party
 */
export const useCreateParty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createParty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
        },
    });
};

/**
 * Mutation hook for updating a party
 */
export const useUpdateParty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateParty(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
        },
    });
};

/**
 * Mutation hook for deleting a party
 */
export const useDeleteParty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteParty,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['parties'] });
        },
    });
};

/**
 * Hook for fetching all parties for dropdown usage
 */
export const useAllParties = () => {
    const query = useQuery({
        queryKey: ['parties', 'all'],
        queryFn: fetchAllParties,
        staleTime: 60000, // 1 minute
        refetchOnMount: 'always',
    });

    return {
        ...query,
        parties: query.data?.data?.parties || [],
    };
};

export default useParties;
