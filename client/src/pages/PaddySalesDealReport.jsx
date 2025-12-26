"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
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
import { usePaddySales } from '@/hooks/usePaddySales';

export default function PaddySalesDealReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Use the usePaddySales hook to fetch data
    const { paddySales, totalPages, currentPage, isLoading, isError, error, hasNext, hasPrev } = usePaddySales();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'dealNumber',
            header: 'सौदा नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium ">{row.getValue('dealNumber')}</div>
            ),
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
            accessorKey: 'date',
            header: 'सौदा तिथि',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const date = row.getValue('date') || row.original.dealDate;
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            accessorKey: 'salesType',
            header: 'बिक्री प्रकार',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const type = row.getValue('salesType');
                const label = type === 'do-sales' ? 'DO बिक्री' : (type === 'other-sales' ? 'अन्य (मिल से बिक्री)' : '-');
                return <div className="text-sm">{label}</div>;
            },
        },
        {
            accessorKey: 'paddyType',
            header: 'धान का प्रकार',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => <div className="text-sm">{row.getValue('paddyType') || '-'}</div>,
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
            accessorKey: 'rate', // Using 'rate' generically or 'paddyRate' if specific. Form uses 'paddyRate' but API might return 'rate' or 'paddyRate'. Using 'paddyRate' to match form is safer if API aligns, but dummy data has 'paddyRate'.
            header: 'दर (₹/क्विंटल)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const rate = row.original.paddyRate || row.getValue('rate');
                return rate ? (
                    <div className="text-sm font-medium">₹{rate}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'delivery',
            header: 'डिलीवरी',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const delivery = row.getValue('delivery');
                const label = delivery === 'at-location' ? 'पड़े में' : (delivery === 'delivered' ? 'पहुंचा कर' : '-');
                return <div className="text-sm">{label}</div>;
            },
        },
        {
            accessorKey: 'totalAmount',
            header: 'कुल राशि (₹)',
            cell: ({ row }) => {
                const amount = row.getValue('totalAmount');
                return amount ? (
                    <div className="text-sm font-semibold text-blue-600">₹{parseFloat(amount).toLocaleString('hi-IN')}</div>
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
                const label = pkg === 'with-weight' ? 'सहित (वजन में)' : (pkg === 'with-quantity' ? 'सहित (भाव में)' : (pkg === 'return' ? 'वापसी-बारदाना' : '-'));
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
        toast.info('View Sales Deal', {
            description: `Viewing details for deal ${deal.dealNumber}`,
        });
    };

    const handleEdit = (deal) => {
        toast.info('Edit Sales Deal', {
            description: `Editing deal ${deal.dealNumber}`,
        });
    };

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading paddy sales</p>
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
                    <p className="text-muted-foreground text-sm">Loading paddy sales deals...</p>
                </div>
            </div>
        );
    }

    // Empty state - no sales deals
    if (!isLoading && paddySales.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई धान बिक्री सौदा नहीं जोड़ा है!"
                description="नया धान बिक्री सौदा जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="धान बिक्री सौदा जोड़ें"
                addRoute="/sales/paddy"
                icon={CurrencyDollarIcon}
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
                            data={paddySales}
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
