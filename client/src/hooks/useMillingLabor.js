"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchMillingLabor, fetchMillingLaborById, createMillingLabor, updateMillingLabor, deleteMillingLabor } from '../api/millingLaborApi';

export const useMillingLabor = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['millingLabor', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchMillingLabor({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        millingLabor: query.data?.data?.millingLabor || [],
        totalMillingLabor: query.data?.data?.totalMillingLabor || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useMillingLaborById = (id) => {
    return useQuery({
        queryKey: ['millingLabor', id],
        queryFn: () => fetchMillingLaborById(id),
        enabled: !!id,
    });
};

export const useCreateMillingLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createMillingLabor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['millingLabor'] }),
    });
};

export const useUpdateMillingLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateMillingLabor(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['millingLabor'] }),
    });
};

export const useDeleteMillingLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMillingLabor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['millingLabor'] }),
    });
};

export default useMillingLabor;
