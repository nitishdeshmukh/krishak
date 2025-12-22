"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchGovtRiceOutward, createGovtRiceOutward } from '../api/govtRiceOutwardApi';

export const useGovtRiceOutward = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['govtRiceOutward', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchGovtRiceOutward({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        govtRiceOutward: query.data?.data?.govtRiceOutward || [],
        totalGovtRiceOutward: query.data?.data?.totalGovtRiceOutward || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useCreateGovtRiceOutward = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createGovtRiceOutward,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['govtRiceOutward'] }),
    });
};

export default useGovtRiceOutward;
