"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { fetchInwardLabor, fetchInwardLaborById, createInwardLabor, updateInwardLabor, deleteInwardLabor } from '../api/inwardLaborApi';

export const useInwardLabor = () => {
    const { pageIndex, pageSize, columnFilters, sorting } = useSelector(state => state.table);
    const page = pageIndex + 1;

    const query = useQuery({
        queryKey: ['inwardLabor', page, pageSize, columnFilters, sorting],
        queryFn: () => fetchInwardLabor({ page, pageSize, filters: columnFilters, sorting }),
        keepPreviousData: true,
        staleTime: 30000,
    });

    return {
        ...query,
        inwardLabor: query.data?.data?.inwardLabor || [],
        totalInwardLabor: query.data?.data?.totalInwardLabor || 0,
        totalPages: query.data?.data?.totalPages || 0,
        currentPage: query.data?.data?.currentPage || 1,
        hasNext: query.data?.data?.hasNext || false,
        hasPrev: query.data?.data?.hasPrev || false,
    };
};

export const useInwardLaborById = (id) => {
    return useQuery({
        queryKey: ['inwardLabor', id],
        queryFn: () => fetchInwardLaborById(id),
        enabled: !!id,
    });
};

export const useCreateInwardLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createInwardLabor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inwardLabor'] }),
    });
};

export const useUpdateInwardLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateInwardLabor(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inwardLabor'] }),
    });
};

export const useDeleteInwardLabor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteInwardLabor,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inwardLabor'] }),
    });
};

export default useInwardLabor;
