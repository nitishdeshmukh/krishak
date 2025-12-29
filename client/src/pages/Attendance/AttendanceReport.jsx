"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useAttendance } from '@/hooks/useAttendance';
import { format } from 'date-fns';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';
import { ArrowPathIcon, ArrowDownTrayIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';

export default function AttendanceReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['entry', 'common']);

    const { attendance, totalRecords, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = useAttendance();

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
                    variant = 'success'; // Verify if badge supports success, otherwise use className
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
