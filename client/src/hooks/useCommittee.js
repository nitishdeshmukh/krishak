"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchCommittee, createCommitteeMember, fetchAllCommittees, createBulkCommitteeMembers, updateCommittee, deleteCommittee } from '../api/committeeApi';

export const useCommittee = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['committee', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchCommittee({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        committees: query.data?.data?.committees,
        totalCommittees: query.data?.data?.totalCommittees,
        totalPages: query.data?.data?.totalPages,
        currentPage: query.data?.data?.currentPage,
        hasNext: query.data?.data?.hasNext,
        hasPrev: query.data?.data?.hasPrev,
    };
};

/**
 * Hook to fetch all committees for dropdown/select use
 * Always fetches fresh data on mount to get latest committees
 */
export const useAllCommittees = () => {
    const query = useQuery({
        queryKey: ['committees-all'],
        queryFn: fetchAllCommittees,
        staleTime: 0, // Always consider data stale
        refetchOnMount: 'always', // Always refetch when component mounts
    });

    return {
        ...query,
        committees: query.data || [],
    };
};

export const useCreateCommitteeMember = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createCommitteeMember,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['committee'] }),
    });
};

export const useCreateBulkCommitteeMembers = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBulkCommitteeMembers,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['committee'] });
            queryClient.invalidateQueries({ queryKey: ['committees-all'] });
        },
    });
};

export const useUpdateCommittee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateCommittee(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['committee'] }),
    });
};

export const useDeleteCommittee = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCommittee,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['committee'] }),
    });
};

export default useCommittee;
