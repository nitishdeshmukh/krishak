"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchOtherOutward, createOtherOutward } from '../api/otherOutwardApi';

export const useOtherOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['otherOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchOtherOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        otherOutward: query.data?.data?.otherOutward || [],
        totalOtherOutward: query.data?.data?.totalOtherOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateOtherOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOtherOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['otherOutward'] }),
    });
};

export default useOtherOutward;
