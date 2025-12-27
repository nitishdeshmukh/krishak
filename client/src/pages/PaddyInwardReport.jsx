"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
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
import { usePaddyInward } from '@/hooks/usePaddyInward';
import { useAllDOEntries } from '@/hooks/useDOEntries';
import { useAllCommittees } from '@/hooks/useCommittee';

export default function PaddyInwardReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Use hook for data
    const { paddyInward, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = usePaddyInward();
    const { doEntries } = useAllDOEntries();
    const { committees } = useAllCommittees();

    // Helper to find DO Number by ID
    const getDONumberName = (id) => {
        if (!id) return '-';
        if (!doEntries) return id;
        const entry = doEntries.find(e => e._id === id || e.id === id);
        return entry ? (entry.doNumber || entry.doNo) : id;
    };

    // Helper to find Committee Name by ID
    const getCommitteeName = (id) => {
        if (!id) return '-';
        if (!committees) return id;
        const committee = committees.find(c => c._id === id || c.id === id);
        return committee ? (committee.name || committee.committeeName) : id;
    };

    // Table column definitions
    const columns = [
        {
            accessorKey: 'date',
            header: 'आवक तिथि',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const date = row.getValue('date');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            accessorKey: 'doNumber',
            header: 'DO क्रमांक',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const id = row.getValue('doNumber');
                return <div className="font-medium">{getDONumberName(id)}</div>;
            },
        },
        {
            accessorKey: 'samitiSangrahan',
            header: 'समिति/संग्रहण',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const id = row.getValue('samitiSangrahan');
                return <div className="font-medium">{getCommitteeName(id)}</div>;
            },
        },
        {
            accessorKey: 'truckNo', // Matches truckNo in form
            header: 'ट्रक नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const truckNo = row.getValue('truckNo');
                return truckNo ? (
                    <div className="text-sm ">{truckNo}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'rstNo',
            header: 'RST नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm">{row.getValue('rstNo') || '-'}</div>,
        },
        {
            accessorKey: 'dhanType',
            header: 'धान का प्रकार',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm">{row.getValue('dhanType') || '-'}</div>,
        },
        {
            accessorKey: 'dhanNetWeight', // Or truckLoadWeight? Form uses dhanNetWeight for specific type, or truckLoadWeight generically? Usually net weight is important.
            header: 'नेट वजन (क्विंटल)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                // Determine which weight to show or show both? Usually Net Weight is key if calculated.
                // The form has 'truckLoadWeight' and 'dhanNetWeight'. Let's show dhanNetWeight if available, fallback to truckLoadWeight.
                const weight = row.original.dhanNetWeight || row.original.truckLoadWeight;
                return weight ? (
                    <div className="text-sm font-semibold text-blue-600">{weight} क्विंटल</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'gunnyNew',
            header: 'नया बारदाना',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm text-center">{row.original.gunnyNew || '-'}</div>,
        },
        {
            accessorKey: 'gunnyOld',
            header: 'पुराना बारदाना',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm text-center">{row.original.gunnyOld || '-'}</div>,
        },
        {
            accessorKey: 'gunnyPlastic',
            header: 'प्लास्टिक बारदाना',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm text-center">{row.original.gunnyPlastic || '-'}</div>,
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
            description: `View Inward: ${entry.inwardNumber}`,
        });
    };

    const handleEdit = (entry) => {
        toast.info(t('common:edit'), {
            description: `Edit Inward: ${entry.inwardNumber}`,
        });
    };

    const handleDelete = (entry) => {
        toast.error(t('common:delete'), {
            description: `Are you sure you want to delete inward ${entry.inwardNumber}?`,
        });
    };

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading paddy inward</p>
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
                    <p className="text-muted-foreground text-sm">Loading government paddy inward...</p>
                </div>
            </div>
        );
    }

    // Empty state - no paddy inward
    if (!isLoading && (!paddyInward || paddyInward.length === 0)) {
        return (
            <EmptyState
                title="आपने अभी तक कोई शासकीय धान आवक नहीं जोड़ी है!"
                description="नई शासकीय धान आवक जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="शासकीय धान आवक जोड़ें"
                addRoute="/inward/govt-paddy"
                icon={ArrowDownTrayIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6 overflow-hidden">
                    <div className="w-full overflow-x-auto">
                        <DataTable
                            columns={columns}
                            data={paddyInward || []}
                            showFilters={true}
                        />
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
