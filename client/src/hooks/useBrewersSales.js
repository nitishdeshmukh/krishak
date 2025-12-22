"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchBrewersSales, createBrewersSales } from '../api/brewersSalesApi';

export const useBrewersSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['brewersSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchBrewersSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        brewersSales: query.data?.data?.brewersSales || [],
        totalBrewersSales: query.data?.data?.totalBrewersSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateBrewersSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createBrewersSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['brewersSales'] }),
    });
};

export default useBrewersSales;
