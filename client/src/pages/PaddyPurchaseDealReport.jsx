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

export default function PaddyPurchaseDealReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Empty data array - will show EmptyState
    const [paddyDeals, setPaddyDeals] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const totalPages = Math.ceil(paddyDeals.length / pageSize);
    const currentPage = pageIndex + 1;

    // Paginated data
    const paginatedDeals = React.useMemo(() => {
        const startIdx = pageIndex * pageSize;
        const endIdx = startIdx + pageSize;
        return paddyDeals.slice(startIdx, endIdx);
    }, [paddyDeals, pageIndex, pageSize]);

    // Table column definitions
    const columns = [
        {
            accessorKey: 'dealNumber',
            header: 'सौदा नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium font-mono">{row.getValue('dealNumber')}</div>
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
            accessorKey: 'dealDate',
            header: 'सौदा तिथि',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const date = row.getValue('dealDate');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
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
            header: 'दर (₹/क्विंटल)',
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
            accessorKey: 'totalAmount',
            header: 'कुल राशि (₹)',
            cell: ({ row }) => {
                const amount = row.getValue('totalAmount');
                return amount ? (
                    <div className="text-sm font-semibold text-green-600">₹{amount.toLocaleString('hi-IN')}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'स्थिति',
            meta: { filterVariant: 'dropdown' },
            cell: ({ row }) => {
                const status = row.getValue('status');
                const statusColors = {
                    'active': 'bg-green-100 text-green-800',
                    'pending': 'bg-yellow-100 text-yellow-800',
                    'completed': 'bg-blue-100 text-blue-800',
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
        toast.info('View Deal', {
            description: `Viewing details for deal ${deal.dealNumber}`,
        });
    };

    const handleEdit = (deal) => {
        toast.info('Edit Deal', {
            description: `Editing deal ${deal.dealNumber}`,
        });
    };

    const handleDelete = (deal) => {
        toast.error('Delete Deal', {
            description: `Are you sure you want to delete deal ${deal.dealNumber}?`,
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading paddy purchase deals...</p>
                </div>
            </div>
        );
    }

    // Empty state - no paddy deals
    if (!isLoading && paddyDeals.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई धान खरीदी सौदा नहीं जोड़ा है!"
                description="नया धान खरीदी सौदा जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="धान खरीदी सौदा जोड़ें"
                addRoute="/purchase/paddy"
                icon={ShoppingBagIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={paginatedDeals}
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
