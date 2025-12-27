"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, PhoneIcon, UserGroupIcon } from '@heroicons/react/24/outline';
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
import { useBrokers } from '@/hooks/useBrokers';

export default function BrokerInfo() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Use the useBrokers hook to fetch data
    const { brokers, totalPages, currentPage, isLoading, isError, error } = useBrokers();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'brokerName',
            header: 'ब्रोकर का नाम',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('brokerName')}</div>
            ),
        },
        {
            accessorKey: 'phone',
            header: 'फोन न.',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const phone = row.getValue('phone');
                return phone ? (
                    <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-600">{phone}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'email',
            header: 'Email',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const email = row.getValue('email');
                return email ? (
                    <div className="text-sm">{email}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },

        {
            accessorKey: 'address',
            header: 'पता',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const address = row.getValue('address');
                return address ? (
                    <div className="text-sm">{address}</div>
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
                const broker = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(broker)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(broker)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(broker)}
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

    const handleView = (broker) => {
        toast.info('View Broker', {
            description: `Viewing details for ${broker.brokerName}`,
        });
    };

    const handleEdit = (broker) => {
        toast.info('Edit Broker', {
            description: `Editing ${broker.brokerName}`,
        });
    };

    const handleDelete = (broker) => {
        toast.error('Delete Broker', {
            description: `Are you sure you want to delete ${broker.brokerName}?`,
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading broker information...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading brokers</p>
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

    // Empty state - no brokers
    if (!isLoading && brokers.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई ब्रोकर नहीं जोड़ा है!"
                description="नया ब्रोकर जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="ब्रोकर जोड़ें"
                addRoute="/entry/brokers"
                icon={UserGroupIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={brokers}
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
