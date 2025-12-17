import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
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

export default function RemainingDOInfo() {
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Empty data array - will show EmptyState
    const [remainingDOs, setRemainingDOs] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    const totalPages = Math.ceil(remainingDOs.length / pageSize);
    const currentPage = pageIndex + 1;

    // Paginated data
    const paginatedDOs = React.useMemo(() => {
        const startIdx = pageIndex * pageSize;
        const endIdx = startIdx + pageSize;
        return remainingDOs.slice(startIdx, endIdx);
    }, [remainingDOs, pageIndex, pageSize]);

    // Table column definitions
    const columns = [
        {
            accessorKey: 'doNumber',
            header: 'DO नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium font-mono">{row.getValue('doNumber')}</div>
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
            accessorKey: 'totalQuantity',
            header: 'कुल मात्रा',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const quantity = row.getValue('totalQuantity');
                return quantity ? (
                    <div className="text-sm">{quantity} क्विंटल</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'liftedQuantity',
            header: 'उठाई गई मात्रा',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const quantity = row.getValue('liftedQuantity');
                return quantity ? (
                    <div className="text-sm text-green-600 font-medium">{quantity} क्विंटल</div>
                ) : (
                    <span className="text-muted-foreground">0 क्विंटल</span>
                );
            },
        },
        {
            accessorKey: 'remainingQuantity',
            header: 'शेष मात्रा',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const quantity = row.getValue('remainingQuantity');
                return quantity ? (
                    <div className="text-sm text-orange-600 font-semibold">{quantity} क्विंटल</div>
                ) : (
                    <span className="text-green-600">0 क्विंटल</span>
                );
            },
        },
        {
            accessorKey: 'dueDate',
            header: 'नियत तिथि',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const date = row.getValue('dueDate');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                const isOverdue = new Date(date) < new Date();
                return (
                    <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                        {formattedDate}
                        {isOverdue && <span className="ml-1">⚠️</span>}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: t('common:actions'),
            enableColumnFilter: false,
            cell: ({ row }) => {
                const doEntry = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(doEntry)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(doEntry)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const handleView = (doEntry) => {
        toast.info('View Remaining DO', {
            description: `Viewing details for DO ${doEntry.doNumber}`,
        });
    };

    const handleEdit = (doEntry) => {
        toast.info('Update Lifting', {
            description: `Updating lifting for DO ${doEntry.doNumber}`,
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading remaining DO details...</p>
                </div>
            </div>
        );
    }

    // Empty state - no remaining DOs
    if (!isLoading && remainingDOs.length === 0) {
        return (
            <EmptyState
                title="कोई शेष DO उठाव नहीं है!"
                description="सभी DO पूर्णतः उठाए जा चुके हैं या कोई DO प्रविष्टी नहीं है"
                buttonText="DO प्रविष्टी देखें"
                addRoute="/reports/entry/do"
                icon={ClipboardDocumentListIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={paginatedDOs}
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
