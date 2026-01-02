import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
    fetchTransactions,
    fetchTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from '@/api/financialTransactionApi';
import { toast } from 'sonner';

export const useFinancialTransactions = () => {
    const { pageIndex, pageSize, filters } = useSelector((state) => state.table);

    const queryInfo = useQuery({
        queryKey: ['financialTransactions', pageIndex, pageSize, filters],
        queryFn: () => fetchTransactions({ page: pageIndex + 1, pageSize, ...filters }),
        placeholderData: (previousData) => previousData,
    });

    return {
        ...queryInfo,
        transactions: queryInfo.data?.data?.transactions || [],
        totalTransactions: queryInfo.data?.data?.totalTransactions || 0,
        totalPages: queryInfo.data?.data?.totalPages || 0,
        currentPage: queryInfo.data?.data?.currentPage || 0,
        hasNext: queryInfo.data?.data?.hasNextPage,
        hasPrev: queryInfo.data?.data?.hasPrevPage,
    };
};

export const useFinancialTransactionById = (id) => {
    return useQuery({
        queryKey: ['financialTransaction', id],
        queryFn: () => fetchTransactionById(id),
        enabled: !!id,
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['financialTransactions']);
            // Toast handled in form
        },
        onError: (error) => {
            // Toast handled in form
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['financialTransactions']);
            toast.success('Transaction updated successfully');
        },
        onError: (error) => {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries(['financialTransactions']);
            toast.success('Transaction deleted successfully');
        },
        onError: (error) => {
            toast.error(`Error: ${error.response?.data?.message || error.message}`);
        },
    });
};

export default useFinancialTransactions;
