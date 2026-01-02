"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import useOutwardLabor from '@/hooks/useOutwardLabor';
import { format } from 'date-fns';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function OutwardLaborReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['entry', 'common']);

    const { outwardLabor, totalOutwardLabor, totalPages, currenPage, isLoading, isError, error, hasNext, hasPrev } = useOutwardLabor();

    // Define columns for the data table
    const columns = [
        {
            accessorKey: 'laborNumber',
            header: 'Labor No.',
            meta: { filterVariant: 'text' },
        },
        {
            accessorKey: 'date',
            header: t('common:date'),
            meta: { filterVariant: 'text' },
            cell: ({ row }) => format(new Date(row.original.date), 'dd/MM/yyyy'),
        },
        {
            accessorKey: 'outwardType',
            header: 'Outward Type',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => row.original.outwardType?.toUpperCase() || '-',
        },
        {
            accessorKey: 'truckNumber',
            header: 'Truck No.',
            meta: { filterVariant: 'text' },
        },
        {
            accessorKey: 'totalBags',
            header: 'Total Bags',
            meta: { filterVariant: 'text' },
        },
        {
            accessorKey: 'laborTeam',
            header: 'Labor Team',
            meta: { filterVariant: 'text' },
        },
        {
            accessorKey: 'loadingAmount',
            header: 'Loading Amt',
            cell: ({ row }) => `₹${row.original.loadingAmount?.toFixed(2) || '0.00'}`,
        },
        {
            accessorKey: 'diulaiAmount',
            header: 'Diulai Amt',
            cell: ({ row }) => `₹${row.original.diulaiAmount?.toFixed(2) || '0.00'}`,
        },
        {
            accessorKey: 'totalAmount',
            header: 'Total Amount',
            cell: ({ row }) => `₹${row.original.totalAmount?.toFixed(2) || '0.00'}`,
        },
    ];

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading outward labor records</p>
                <p className="text-muted-foreground text-sm">{error?.message || 'Something went wrong'}</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                    variant="outline"
                >
                    Retry
                </Button>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading outward labor records...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!isLoading && (!outwardLabor || outwardLabor.length === 0)) {
        return (
            <EmptyState
                title="No Outward Labor Records Found"
                description="Add a new outward labor record to see it here."
                buttonText="Add Outward Labor"
                addRoute="/labor-cost/outward-add"
                icon={ArrowDownTrayIcon}
            />
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>जावक हमाली रिपोर्ट (Outward Labor Report)</CardTitle>
                    <CardDescription>View outward labor cost records</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={outwardLabor}
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
                            paginationItemsToDisplay={5}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
