"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import useFinancialTransactions from '@/hooks/useFinancialTransaction';
import { format } from 'date-fns';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';
import { ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';

export default function ReceivingReport() {
    const dispatch = useDispatch();
    const { t } = useTranslation(['forms', 'entry', 'common']);
    const { pageIndex, pageSize } = useSelector(state => state.table);

    const { transactions, totalTransactions, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = useFinancialTransactions({ type: 'RECEIPT' });

    const columns = [
        {
            accessorKey: 'date',
            header: t('common:date') || 'Date',
            cell: ({ row }) => format(new Date(row.original.date), 'dd/MM/yyyy'),
        },
        {
            accessorKey: 'partyName',
            header: t('forms.common.partyName') || 'Party Name',
        },
        {
            accessorKey: 'dealType',
            header: 'Deal Type',
        },
        {
            accessorKey: 'dealNumber',
            header: 'Deal Number',
        },
        {
            accessorKey: 'paymentMode',
            header: 'Payment Mode',
        },
        {
            accessorKey: 'amount',
            header: 'Amount',
            cell: ({ row }) => (
                <span className="font-semibold text-success">
                    ₹{row.original.amount?.toLocaleString('en-IN')}
                </span>
            ),
        },
        {
            accessorKey: 'remarks',
            header: 'Remarks',
        },
    ];

    if (isError) return <div className="p-4 text-destructive">Error: {error?.message}</div>;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading transactions...</p>
                </div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <EmptyState
                title="No Receiving Records Found"
                description="Start by recording a new receiving entry."
                buttonText="Add Receiving"
                addRoute="/financial/receiving"
                icon={BanknotesIcon}
            />
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t('entry:sections.financial.receiving') || 'Receiving Report'}</CardTitle>
                    <CardDescription>View all money received from sale deals.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={transactions}
                        showFilters={true}
                    />
                    <div className="mt-4">
                        <TablePagination
                            pageIndex={pageIndex}
                            pageCount={totalPages}
                            pageSize={pageSize}
                            setPageIndex={(index) => dispatch(setPageIndex(index))}
                            setPageSize={(size) => dispatch(setPageSize(size))}
                            canPreviousPage={hasPrev}
                            canNextPage={hasNext}
                            previousPage={() => dispatch(setPageIndex(Math.max(0, pageIndex - 1)))}
                            nextPage={() => dispatch(setPageIndex(pageIndex + 1))}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
