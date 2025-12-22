"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBrewersOutward, createBrewersOutward } from '../api/brewersOutwardApi';

export const useBrewersOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['brewersOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchBrewersOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        brewersOutward: query.data?.data?.brewersOutward || [],
        totalBrewersOutward: query.data?.data?.totalBrewersOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateBrewersOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBrewersOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brewersOutward'] }),
    });
};

export default useBrewersOutward;
