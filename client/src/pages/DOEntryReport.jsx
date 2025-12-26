"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';
import { useDOEntries } from '@/hooks/useDOEntries';

export default function DOEntryReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Use the useDOEntries hook to fetch data
    const { doEntries, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = useDOEntries();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'doNumber',
            header: 'DO नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium ">{row.getValue('doNumber')}</div>
            ),
        },
        {
            accessorKey: 'committeeCenter',
            header: 'समिति/केंद्र',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('committeeCenter')}</div>
            ),
        },
        {
            accessorKey: 'date',
            header: 'तिथि',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const date = row.getValue('date');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            accessorKey: 'grainMota',
            header: 'मोटा',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm text-right">{row.getValue('grainMota') || 0}</div>
            ),
        },
        {
            accessorKey: 'grainPatla',
            header: 'पतला',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm text-right">{row.getValue('grainPatla') || 0}</div>
            ),
        },
        {
            accessorKey: 'grainSarna',
            header: 'सरना',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm text-right">{row.getValue('grainSarna') || 0}</div>
            ),
        },
        {
            accessorKey: 'total',
            header: 'कुल (क्विंटल)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm font-bold text-right">{row.getValue('total') || 0}</div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'स्थिति',
            meta: { filterVariant: 'dropdown' },
            cell: ({ row }) => {
                const status = row.getValue('status');
                const statusColors = {
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'completed': 'bg-green-100 text-green-800',
                    'cancelled': 'bg-red-100 text-red-800',
                };
                return status ? (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                        {status}
                    </span>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            id: 'actions',
            header: t('common:actions'),
            enableColumnFilter: false,
            cell: ({ row }) => {
                const entry = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(entry)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(entry)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(entry)}
                                className="text-destructive"
                            >
                                <TrashIcon className="mr-2 h-4 w-4" />
                                {t('common:delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleView = (entry) => {
        toast.info(t('common:view'), {
            description: `DO: ${entry.doNumber} - ${entry.committeeCenter}`,
        });
    };

    const handleEdit = (entry) => {
        toast.info('Edit DO Entry', {
            description: `Editing DO ${entry.doNumber}`,
        });
    };

    const handleDelete = (entry) => {
        toast.error('Delete DO Entry', {
            description: `Are you sure you want to delete DO ${entry.doNumber}?`,
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading DO entries...</p>
                </div>
            </div>
        );
    }


    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading DO entries</p>
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

    // Empty state - no DO entries
    if (!isLoading && doEntries.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई DO प्रविष्टी नहीं जोड़ी है!"
                description="नई DO प्रविष्टी जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="DO प्रविष्टी जोड़ें"
                addRoute="/entry/do"
                icon={DocumentTextIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={doEntries}
                        showFilters={true}
                    />

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
