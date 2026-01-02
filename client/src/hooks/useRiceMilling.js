"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchRiceMilling, createRiceMilling } from '../api/riceMillingApi';

export const useRiceMilling = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['riceMilling', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchRiceMilling({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        riceMilling: query.data?.data?.riceMilling || query.data?.data?.ricemilling || [],
        totalRiceMilling: query.data?.data?.totalRiceMilling || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

// Hook to fetch ALL rice milling records (no pagination)
export const useAllRiceMilling = () => {
    const query = useQuery({
        queryKey: ['riceMilling', 'all'],
        queryFn: async () => {
            // First fetch to get total count
            const firstPage = await fetchRiceMilling({ page: 1, pageSize: 100 });
            const total = firstPage?.data?.totalRiceMilling || 0;

            if (total <= 100) {
                return firstPage;
            }

            // Fetch all pages
            const totalPages = Math.ceil(total / 100);
            const allPromises = [];
            for (let i = 1; i <= totalPages; i++) {
                allPromises.push(fetchRiceMilling({ page: i, pageSize: 100 }));
            }

            const allResponses = await Promise.all(allPromises);
            const allRecords = allResponses.flatMap(
                r => r?.data?.riceMilling || r?.data?.ricemilling || []
            );

            return { data: { riceMilling: allRecords, totalRiceMilling: allRecords.length } };
        },
        staleTime: 60000,
    });

    return {
        ...query,
        riceMilling: query.data?.data?.riceMilling || query.data?.data?.ricemilling || [],
        totalRiceMilling: query.data?.data?.totalRiceMilling || 0,
    };
};

export const useCreateRiceMilling = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRiceMilling,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['riceMilling'] }),
    });
};

export default useRiceMilling;

