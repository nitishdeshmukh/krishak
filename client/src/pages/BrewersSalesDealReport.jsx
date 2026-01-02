"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';
import { useBrewersSales } from '@/hooks/useBrewersSales';

export default function BrewersSalesDealReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    const { brewersSales, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = useBrewersSales();

    const columns = [
        {
            accessorKey: 'brewersSaleNumber',
            header: 'Brewers Sale No.',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium ">{row.getValue('brewersSaleNumber') || '-'}</div>
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
                <div className="font-medium">{row.getValue('partyName')}</div>
            ),
        },
        {
            accessorKey: 'brokerName',
            header: 'Broker',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('brokerName') || '-'}</div>
            ),
        },
        {
            accessorKey: 'quantity',
            header: 'Quantity',
            meta: { filterVariant: 'text' },
        },
        {
            accessorKey: 'rate',
            header: 'Rate (₹)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const rate = row.getValue('rate');
                return rate ? (
                    <div className="text-sm font-medium">₹{rate}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'amount',
            header: 'Total Amount (₹)',
            cell: ({ row }) => {
                const amount = row.getValue('amount');
                return amount ? (
                    <div className="text-sm font-semibold text-green-600">₹{parseFloat(amount).toLocaleString('hi-IN')}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
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
                <p className="text-destructive mb-2 font-semibold">Error loading brewers sales</p>
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
                    <p className="text-muted-foreground text-sm">Loading brewers sales deals...</p>
                </div>
            </div>
        );
    }

    if (!isLoading && brewersSales.length === 0) {
        return (
            <EmptyState
                title="No Brewers Sales Deals Found"
                description="Add a new brewers sales deal to see it here"
                buttonText="Add Brewers Sales"
                addRoute="/sales/brewers"
                icon={CurrencyDollarIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6 overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <DataTable columns={columns} data={brewersSales} showFilters={true} />
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
