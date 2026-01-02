"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchPaddyMilling, createPaddyMilling } from '../api/paddyMillingApi';

export const usePaddyMilling = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['paddyMilling', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchPaddyMilling({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        paddyMilling: query.data?.data?.paddyMilling || query.data?.data?.paddymilling || [],
        totalPaddyMilling: query.data?.data?.totalPaddyMilling || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

// Hook to fetch ALL paddy milling records (no pagination)
export const useAllPaddyMilling = () => {
    const query = useQuery({
        queryKey: ['paddyMilling', 'all'],
        queryFn: async () => {
            // First fetch to get total count
            const firstPage = await fetchPaddyMilling({ page: 1, pageSize: 100 });
            const total = firstPage?.data?.totalPaddyMilling || 0;

            if (total <= 100) {
                return firstPage;
            }

            // Fetch all pages
            const totalPages = Math.ceil(total / 100);
            const allPromises = [];
            for (let i = 1; i <= totalPages; i++) {
                allPromises.push(fetchPaddyMilling({ page: i, pageSize: 100 }));
            }

            const allResponses = await Promise.all(allPromises);
            const allRecords = allResponses.flatMap(
                r => r?.data?.paddyMilling || r?.data?.paddymilling || []
            );

            return { data: { paddyMilling: allRecords, totalPaddyMilling: allRecords.length } };
        },
        staleTime: 60000,
    });

    return {
        ...query,
        paddyMilling: query.data?.data?.paddyMilling || query.data?.data?.paddymilling || [],
        totalPaddyMilling: query.data?.data?.totalPaddyMilling || 0,
    };
};

export const useCreatePaddyMilling = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPaddyMilling,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paddyMilling'] }),
    });
};

export default usePaddyMilling;

