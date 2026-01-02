"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';
import { useGovtSackOutward } from '@/hooks/useGovtSackOutward';

export default function GovtSackOutwardReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    const { govtSackOutward, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = useGovtSackOutward();

    const columns = [
        {
            accessorKey: 'outwardNumber',
            header: 'Outward No.',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium ">{row.getValue('outwardNumber') || '-'}</div>
            ),
        },
        {
            accessorKey: 'date',
            header: 'Date',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const date = row.getValue('date');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            accessorKey: 'partyName',
            header: 'Party Name',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('partyName') || '-'}</div>
            ),
        },
        {
            accessorKey: 'truckNumber',
            header: 'Truck No.',
            meta: { filterVariant: 'text' },
        },
        {
            accessorKey: 'sackType',
            header: 'Sack Type',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('sackType') || '-'}</div>
            ),
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
            meta: { filterVariant: 'text' },
        },
        {
            accessorKey: 'remarks',
            header: 'Remarks',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const remarks = row.getValue('remarks');
                return remarks ? (
                    <div className="text-sm truncate max-w-[150px]" title={remarks}>{remarks}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
    ];

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading govt sack outward</p>
                <p className="text-muted-foreground text-sm">{error?.message || 'Something went wrong'}</p>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">Retry</Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading govt sack outward records...</p>
                </div>
            </div>
        );
    }

    if (!isLoading && (!govtSackOutward || govtSackOutward.length === 0)) {
        return (
            <EmptyState
                title="No Govt Sack Outward Records Found"
                description="Add a new govt sack outward record to see it here"
                buttonText="Add Govt Sack Outward"
                addRoute="/outward/govt-sack"
                icon={ArrowDownTrayIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6 overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <DataTable columns={columns} data={govtSackOutward || []} showFilters={true} />
                    </div>
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
                </CardContent>
            </Card>
        </div>
    );
}
