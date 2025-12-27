"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
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
import { useRicePurchases } from '@/hooks/useRicePurchases';

export default function RicePurchaseDealReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Use the useRicePurchases hook to fetch data
    const { ricePurchases, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = useRicePurchases();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'date',
            header: 'सौदा तिथि',
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
            header: 'पार्टी का नाम',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('partyName')}</div>
            ),
        },
        {
            accessorKey: 'brokerName',
            header: 'ब्रोकर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('brokerName') || '-'}</div>
            ),
        },
        {
            accessorKey: 'purchaseType',
            header: 'खरीदी प्रकार',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const type = row.getValue('purchaseType');
                const label = type === 'lot-purchase' ? 'LOT खरीदी' : 'अन्य खरीदी';
                return <div className="text-sm">{label}</div>;
            },
        },
        {
            accessorKey: 'riceType',
            header: 'चावल का प्रकार',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('riceType') || '-'}</div>
            ),
        },
        {
            accessorKey: 'quantity',
            header: 'मात्रा (क्विंटल)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const quantity = row.getValue('quantity');
                return quantity ? (
                    <div className="text-sm font-medium">{quantity} क्विंटल</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'rate',
            header: 'दर (₹)',
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
            header: 'कुल राशि (₹)',
            cell: ({ row }) => {
                const amount = row.getValue('amount') || row.original.totalAmount;
                return amount ? (
                    <div className="text-sm font-semibold text-green-600">₹{parseFloat(amount).toLocaleString('hi-IN')}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'packaging',
            header: 'पैकेजिंग',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const pkg = row.getValue('packaging');
                const label = pkg === 'with-weight' ? 'सहित (वजन में)' : (pkg === 'with-quantity' ? 'सहित (भाव में)' : (pkg === 'return' ? 'वापसी' : '-'));
                return <div className="text-sm">{label}</div>;
            }
        },
        {
            accessorKey: 'wastagePercent',
            header: 'बटाव (%)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm text-right">{row.getValue('wastagePercent') || '-'}</div>,
        },
        {
            accessorKey: 'brokerage',
            header: 'दलाली',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm text-right">{row.getValue('brokerage') || '-'}</div>,
        },
        {
            accessorKey: 'frk',
            header: 'FRK',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const frk = row.getValue('frk');
                const label = frk === 'frk-included' ? 'FRK सहित' : (frk === 'frk-give' ? 'FRK देना है' : '-');
                return <div className="text-sm">{label}</div>;
            }
        },
        {
            accessorKey: 'lotNumber',
            header: 'LOT No.',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm">{row.getValue('lotNumber') || '-'}</div>,
        },
        {
            accessorKey: 'remarks',
            header: 'टिप्पणी',
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
        {
            id: 'actions',
            header: t('common:actions'),
            enableColumnFilter: false,
            cell: ({ row }) => {
                const deal = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(deal)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(deal)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(deal)}
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

    const handleView = (deal) => {
        toast.info(t('common:view'), {
            description: `View Deal: ${deal.partyName}`,
        });
    };

    const handleEdit = (deal) => {
        toast.info(t('common:edit'), {
            description: `Edit Deal for ${deal.partyName}`,
        });
    };

    const handleDelete = (deal) => {
        toast.error(t('common:delete'), {
            description: `Are you sure you want to delete deal for ${deal.partyName}?`,
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading rice purchase deals...</p>
                </div>
            </div>
        );
    }

    // Empty state - no rice deals
    if (!isLoading && ricePurchases.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई चावल खरीदी सौदा नहीं जोड़ा है!"
                description="नया चावल खरीदी सौदा जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="चावल खरीदी सौदा जोड़ें"
                addRoute="/purchase/rice"
                icon={ShoppingBagIcon}
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
                            data={ricePurchases}
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
