"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRiceSales, createRiceSales } from '../api/riceSalesApi';

export const useRiceSales = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['riceSales', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRiceSales({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        riceSales: query.data?.data?.riceSales || [],
        totalRiceSales: query.data?.data?.totalRiceSales || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateRiceSales = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRiceSales,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['riceSales'] }),
    });
};

export default useRiceSales;
