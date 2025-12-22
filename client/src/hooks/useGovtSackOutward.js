"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchGovtSackOutward, createGovtSackOutward } from '../api/govtSackOutwardApi';

export const useGovtSackOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['govtSackOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchGovtSackOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        govtSackOutward: query.data?.data?.govtSackOutward || [],
        totalGovtSackOutward: query.data?.data?.totalGovtSackOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateGovtSackOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createGovtSackOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['govtSackOutward'] }),
    });
};

export default useGovtSackOutward;
