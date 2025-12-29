"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchOtherLabor, fetchOtherLaborById, createOtherLabor, updateOtherLabor, deleteOtherLabor } from '../api/otherLaborApi';

export const useOtherLabor = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['otherLabor', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchOtherLabor({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        otherLabor: query.data?.data?.otherLabor || [],
        totalOtherLabor: query.data?.data?.totalOtherLabor || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useOtherLaborById = (id) => {
    return useQuery({
        queryKey: ['otherLabor', id],
        queryFn: () => fetchOtherLaborById(id),
        enabled: !!id,
    });
};

export const useCreateOtherLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createOtherLabor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['otherLabor'] }),
    });
};

export const useUpdateOtherLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateOtherLabor(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['otherLabor'] }),
    });
};

export const useDeleteOtherLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteOtherLabor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['otherLabor'] }),
    });
};

export default useOtherLabor;
