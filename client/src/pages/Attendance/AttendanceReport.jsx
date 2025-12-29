"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useAttendance, useDeleteAttendance } from '@/hooks/useAttendance';
import { format } from 'date-fns';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';
import { ArrowPathIcon, ArrowDownTrayIcon, UserGroupIcon, EllipsisHorizontalIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function AttendanceReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['entry', 'common']);

    const { attendance, totalRecords, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = useAttendance();
    const { mutate: deleteAttendance } = useDeleteAttendance();

    const handleDelete = (id) => {
        deleteAttendance(id, {
            onSuccess: () => {
                toast.success(t('messages.deleteSuccess') || 'Record deleted successfully');
            },
            onError: (err) => {
                toast.error(err.message || 'Failed to delete record');
            }
        });
    };

    // Define columns for the data table
    const columns = [
        {
            accessorKey: 'date',
            header: t('common:date'),
            meta: { filterVariant: 'text' },
            cell: ({ row }) => format(new Date(row.original.date), 'dd/MM/yyyy'),
        },
        {
            accessorKey: 'staff.name',
            header: 'Staff Name',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => row.original.staff?.name || 'Unknown',
        },
        {
            accessorKey: 'staff.post',
            header: 'Post',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => row.original.staff?.post || '-',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const status = row.original.status;
                let variant = 'default';
                let className = '';

                if (status === 'Present') {
                    variant = 'success';
                    className = "bg-green-100 text-green-800 hover:bg-green-100";
                } else if (status === 'Absent') {
                    variant = 'destructive';
                } else if (status === 'Half Day') {
                    variant = 'secondary';
                    className = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
                }

                return <Badge variant={variant === 'success' || variant === 'secondary' ? 'outline' : variant} className={className}>{status}</Badge>;
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
                            <DropdownMenuItem onClick={() => toast.info('Edit functionality via Bulk Entry page')}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(entry._id)}
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

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading attendance records</p>
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
                    <p className="text-muted-foreground text-sm">Loading attendance records...</p>
                </div>
            </div>
        );
    }

    // Empty state
    if (!isLoading && (!attendance || attendance.length === 0)) {
        return (
            <EmptyState
                title="No Attendance Records Found"
                description="Mark attendance to see records here."
                buttonText="Mark Attendance"
                addRoute="/entry/attendance"
                icon={UserGroupIcon}
            />
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>उपस्थिति रिपोर्ट (Attendance Report)</CardTitle>
                    <CardDescription>View staff attendance history</CardDescription>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={attendance}
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
