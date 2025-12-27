"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchDOEntries, createDOEntry, createBulkDOEntries, updateDOEntry, deleteDOEntry, fetchAllDOEntries } from '../api/doEntriesApi';

export const useDOEntries = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['doEntries', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchDOEntries({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        doEntries: query.data?.data?.doEntries || [],
        totalDoEntries: query.data?.data?.totalDoEntries || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

/**
 * Hook to fetch all DO entries for dropdown/select use
 * Always fetches fresh data on mount to get latest DO entries
 */
export const useAllDOEntries = () => {
    const query = useQuery({
        queryKey: ['doEntries-all'],
        queryFn: fetchAllDOEntries,
        staleTime: 0,
        refetchOnMount: 'always',
    });

    return {
        ...query,
        doEntries: query.data || [],
    };
};

export const useCreateDOEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDOEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doEntries'] }),
    });
};

export const useCreateBulkDOEntries = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBulkDOEntries,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doEntries'] }),
    });
};

export const useUpdateDOEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateDOEntry(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doEntries'] }),
    });
};

export const useDeleteDOEntry = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteDOEntry,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['doEntries'] }),
    });
};

export default useDOEntries;
