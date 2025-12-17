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

export default function PaddyInwardReport() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Empty data array - will show EmptyState
    const [inwardEntries, setInwardEntries] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const totalPages = Math.ceil(inwardEntries.length / pageSize);
    const currentPage = pageIndex + 1;

    // Paginated data
    const paginatedEntries = React.useMemo(() => {
        const startIdx = pageIndex * pageSize;
        const endIdx = startIdx + pageSize;
        return inwardEntries.slice(startIdx, endIdx);
    }, [inwardEntries, pageIndex, pageSize]);

    // Table column definitions
    const columns = [
        {
            accessorKey: 'inwardNumber',
            header: 'आवक नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium font-mono">{row.getValue('inwardNumber')}</div>
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
            accessorKey: 'inwardDate',
            header: 'आवक तिथि',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const date = row.getValue('inwardDate');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            accessorKey: 'vehicleNumber',
            header: 'वाहन नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const vehicleNumber = row.getValue('vehicleNumber');
                return vehicleNumber ? (
                    <div className="text-sm font-mono">{vehicleNumber}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'quantity',
            header: 'मात्रा (क्विंटल)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const quantity = row.getValue('quantity');
                return quantity ? (
                    <div className="text-sm font-semibold text-blue-600">{quantity} क्विंटल</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'transporterName',
            header: 'परिवहनकर्ता',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const name = row.getValue('transporterName');
                return name ? (
                    <div className="text-sm">{name}</div>
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
        toast.info('View Inward', {
            description: `Viewing details for inward ${entry.inwardNumber}`,
        });
    };

    const handleEdit = (entry) => {
        toast.info('Edit Inward', {
            description: `Editing inward ${entry.inwardNumber}`,
        });
    };

    const handleDelete = (entry) => {
        toast.error('Delete Inward', {
            description: `Are you sure you want to delete inward ${entry.inwardNumber}?`,
        });
    };

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
    if (!isLoading && inwardEntries.length === 0) {
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
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={paginatedEntries}
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
