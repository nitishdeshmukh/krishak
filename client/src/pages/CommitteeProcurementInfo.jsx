"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, PhoneIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
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
import { useCommittee } from '@/hooks/useCommittee';

export default function CommitteeProcurementInfo() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Use the useCommittee hook to fetch data
    const { committees, totalPages, currentPage, isLoading, isError, error } = useCommittee();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'committeeName',
            header: 'समिति का नाम',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('committeeName')}</div>
            ),
        },
        {
            accessorKey: 'type',
            header: 'प्रकार',
            meta: { filterVariant: 'dropdown' },
            cell: ({ row }) => {
                const type = row.getValue('type');
                const label = type === 'committee-production' ? 'समिति-उपार्जन केंद्र' : 'संग्रहण केंद्र';
                return (
                    <div className="text-sm font-medium">{label}</div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'बनाने की तिथि',
            cell: ({ row }) => {
                const date = row.getValue('createdAt');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            id: 'actions',
            header: t('common:actions'),
            enableColumnFilter: false,
            cell: ({ row }) => {
                const member = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(member)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(member)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(member)}
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

    const handleView = (member) => {
        toast.info('View Committee', {
            description: `Viewing details for ${member.committeeName}`,
        });
    };

    const handleEdit = (member) => {
        toast.info('Edit Committee', {
            description: `Editing ${member.committeeName}`,
        });
    };

    const handleDelete = (member) => {
        toast.error('Delete Committee', {
            description: `Are you sure you want to delete ${member.committeeName}?`,
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading committee procurement...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading committee members</p>
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

    // Empty state - no committee members
    if (!isLoading && committees.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई समिति संरचना नहीं जोड़ी है!"
                description="नई समिति संरचना जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="समिति संरचना जोड़ें"
                addRoute="/entry/committee"
                icon={BuildingOffice2Icon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={committees}
                        showFilters={true}
                    />

                    <TablePagination
                        pageIndex={pageIndex}
                        pageCount={totalPages}
                        pageSize={pageSize}
                        setPageIndex={(index) => dispatch(setPageIndex(index))}
                        setPageSize={(size) => dispatch(setPageSize(size))}
                        canPreviousPage={currentPage > 1}
                        canNextPage={currentPage < totalPages}
                        previousPage={() => dispatch(setPageIndex(Math.max(0, pageIndex - 1)))}
                        nextPage={() => dispatch(setPageIndex(pageIndex + 1))}
                        paginationItemsToDisplay={5}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
