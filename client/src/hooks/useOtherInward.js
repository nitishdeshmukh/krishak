"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchOtherInward, createOtherInward } from '../api/otherInwardApi';

export const useOtherInward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['otherInward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchOtherInward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        otherInward: query.data?.data?.otherInward || [],
        totalOtherInward: query.data?.data?.totalOtherInward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateOtherInward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOtherInward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['otherInward'] }),
    });
};

export default useOtherInward;
