"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPrivateRiceOutward, createPrivateRiceOutward } from '../api/privateRiceOutwardApi';

export const usePrivateRiceOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['privateRiceOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPrivateRiceOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        privateRiceOutward: query.data?.data?.privateRiceOutward || [],
        totalPrivateRiceOutward: query.data?.data?.totalPrivateRiceOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreatePrivateRiceOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPrivateRiceOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['privateRiceOutward'] }),
    });
};

export default usePrivateRiceOutward;
