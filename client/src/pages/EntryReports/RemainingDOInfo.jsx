"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, ClipboardDocumentListIcon, CalendarIcon, BuildingOffice2Icon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { DataTable } from '@/components/ui/data-table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   Drawer,
    DrawerClose,
    DrawerContent,
} from '@/components/ui/drawer';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { setPageIndex, setPageSize } from '@/store/slices/tableSlice';
import TablePagination from '@/components/ui/table-pagination';
import EmptyState from '@/components/EmptyState';
import { useDOEntries, useDeleteDOEntry } from '@/hooks/useDOEntries';
import { fetchAllPaddyInward } from '@/api/paddyInwardApi';
import { fetchAllPaddySales } from '@/api/paddySalesApi';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

export default function RemainingDOInfo() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);

    // Reset page index on mount to ensure we start from page 1
    React.useEffect(() => {
        dispatch(setPageIndex(0));
    }, [dispatch]);

    // State for drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedDO, setSelectedDO] = useState(null);
    
    // State for delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [doToDelete, setDoToDelete] = useState(null);

    // State for balance sorting (null = default, 'low-to-high', 'high-to-low')
    const [balanceSort, setBalanceSort] = useState(null);

    // Fetch paginated DO entries using useDOEntries hook
    const { doEntries, totalPages, currentPage, isLoading: doLoading, isError: doError, error: doErrorMsg, hasNext, hasPrev } = useDOEntries();
    
    // Fetch all paddy inward data
    const { data: inwardData, isLoading: inwardLoading } = useQuery({
        queryKey: ['paddyInward-all'],
        queryFn: async () => {
            const result = await fetchAllPaddyInward();
            return result?.data?.paddyInward || [];
        },
        staleTime: 30000,
    });

    // Fetch all paddy sales data
    const { data: salesData, isLoading: salesLoading } = useQuery({
        queryKey: ['paddySales-all'],
        queryFn: async () => {
            const result = await fetchAllPaddySales();
            return result?.data || [];
        },
        staleTime: 30000,
    });

    const paddyInward = inwardData || [];
    const paddySales = salesData || [];

    // Delete DO mutation
    const deleteDOMutation = useDeleteDOEntry();

    // Calculate lifting for each DO
    const enrichedDOs = useMemo(() => {
        if (!doEntries || doEntries.length === 0) return [];

        return doEntries.map(doEntry => {
            const doNumber = doEntry.doNumber;
            
            // Calculate lifting from Govt Paddy Inward (dhan net weight)
            const inwardLifting = paddyInward
                .filter(inward => inward.doNumber === doNumber)
                .reduce((sum, inward) => {
                    // Sum the dhan type quantities (net weight of paddy)
                    const dhanNetWeight = (parseFloat(inward.dhanMota || 0) + 
                                          parseFloat(inward.dhanPatla || 0) + 
                                          parseFloat(inward.dhanSarna || 0) +
                                          parseFloat(inward.dhanMaha || 0) +
                                          parseFloat(inward.dhanRb || 0));
                    return sum + dhanNetWeight;
                }, 0);

            // Calculate lifting from Paddy Sales (quantities sold FOR this DO)
            const salesLifting = paddySales
                .reduce((sum, sale) => {
                    if (sale.doEntries && Array.isArray(sale.doEntries)) {
                        const matchingEntries = sale.doEntries.filter(entry => entry.doNumber === doNumber);
                        const entrySum = matchingEntries.reduce((entryTotal, entry) => {
                            return entryTotal + (parseFloat(entry.dhanMota || 0) + 
                                                parseFloat(entry.dhanPatla || 0) + 
                                                parseFloat(entry.dhanSarna || 0));
                        }, 0);
                        return sum + entrySum;
                    }
                    return sum;
                }, 0);

            const totalLifting = inwardLifting + salesLifting;
            const totalQuantity = parseFloat(doEntry.total || 0);
            const balance = totalQuantity - totalLifting;

            return {
                ...doEntry,
                lifting: totalLifting,
                balance: balance,
            };
        });
    }, [doEntries, paddyInward, paddySales]);

    // Apply balance sorting (client-side sorting on paginated results)
    const sortedDOs = useMemo(() => {
        if (!balanceSort) return enrichedDOs;
        
        const sorted = [...enrichedDOs];
        if (balanceSort === 'low-to-high') {
            sorted.sort((a, b) => a.balance - b.balance);
        } else if (balanceSort === 'high-to-low') {
            sorted.sort((a, b) => b.balance - a.balance);
        }
        return sorted;
    }, [enrichedDOs, balanceSort]);

    // Table column definitions
    const columns = [
        {
            accessorKey: 'doNumber',
            header: 'DO क्रमांक',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('doNumber')}</div>
            ),
        },
        {
            accessorKey: 'committeeCenter',
            header: 'समिति / संग्रहण केंद्र',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('committeeCenter')}</div>
            ),
        },
        {
            accessorKey: 'grainMota',
            header: 'धान (मोटा)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.original.grainMota || 0}</div>
            ),
        },
        {
            accessorKey: 'grainPatla',
            header: 'धान (पतला)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.original.grainPatla || 0}</div>
            ),
        },
        {
            accessorKey: 'grainSarna',
            header: 'धान (सरना)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.original.grainSarna || 0}</div>
            ),
        },
        {
            accessorKey: 'total',
            header: 'कुल (क्विंटल)',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const quantity = row.getValue('total');
                return quantity ? (
                    <div className="text-sm">{quantity}</div>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
        },
        {
            accessorKey: 'lifting',
            header: 'उठाव',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const quantity = row.getValue('lifting');
                return (
                    <div className="text-sm text-blue-600 font-medium">
                        {quantity ? quantity.toFixed(2) : '0.00'}
                    </div>
                );
            },
        },
        {
            accessorKey: 'balance',
            header: 'उठाव शेष',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const quantity = row.getValue('balance');
                const isZero = quantity <= 0;
                return (
                    <div className={cn(
                        "text-sm font-semibold",
                        isZero ? "text-green-600" : "text-red-600 "
                    )}>
                        {quantity ? quantity.toFixed(2) : '0.00'}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: '',
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

    const handleView = (doEntry) => {
        setSelectedDO(doEntry);
        setIsDrawerOpen(true);
    };

    const handleEdit = (doEntry) => {
        navigate('/entry/do', { state: { doEntry, isEditing: true } });
    };

    const handleDelete = (doEntry) => {
        setDoToDelete(doEntry);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!doToDelete?._id) return;
        
        try {
            await deleteDOMutation.mutateAsync(doToDelete._id);
            toast.success('DO Entry Deleted', {
                description: `DO ${doToDelete.doNumber} has been deleted successfully.`,
            });
        } catch (error) {
            toast.error('Failed to delete DO entry', {
                description: error.message || 'An error occurred.',
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setDoToDelete(null);
        }
    };

    // Loading state
    const isLoading = doLoading || inwardLoading || salesLoading;
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

    // Error state
    if (doError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading DO entries</p>
                <p className="text-muted-foreground text-sm">{doErrorMsg?.message || 'Something went wrong'}</p>
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

    // Empty state - no remaining DOs
    if (!isLoading && sortedDOs.length === 0) {
        return (
            <EmptyState
                title="कोई DO प्रविष्टी नहीं है!"
                description="DO प्रविष्टी देखने के लिए पहले DO जोड़ें"
                buttonText="DO जोड़ें"
                addRoute="/entry/do"
                icon={ClipboardDocumentListIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    {balanceSort && (
                        <div className="mb-4 flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                                Sorted by उठाव शेष: {balanceSort === 'low-to-high' ? 'Low to High' : 'High to Low'}
                            </span>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setBalanceSort(null)}
                                className="h-7 text-xs"
                            >
                                Clear Sort
                            </Button>
                        </div>
                    )}
                    
                    <DataTable
                        columns={columns}
                        data={sortedDOs}
                        showFilters={false}
                    />

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

                {/* Formula Explanation */}
                <div className="px-6 pb-6">
                    <Card className="bg-muted/30 border-dashed">
                        <CardContent className="p-4">
                            <h3 className="text-sm font-semibold mb-3 text-foreground">गणना सूत्र (Calculation Formula)</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-start gap-2">
                                    <span className="text-cyan-600 font-semibold min-w-[80px]">उठाव =</span>
                                    <div>
                                        <div className="text-muted-foreground">
                                            <span className="font-medium">1. शासकीय धान आवक</span> (Government Paddy Inward) से related DO नंबर का धान नेट वजन
                                        </div>
                                        <div className="text-muted-foreground mt-1">
                                            <span className="font-medium">2. धान बिक्री</span> (Paddy Sales) page से जिस DO नंबर को बेचा गया है उसकी मात्रा
                                        </div>
                                        <div className="mt-2 px-3 py-1.5 bg-cyan-50 rounded text-cyan-700 font-mono text-xs">
                                            धान नेट वजन = मोटा + पतला + सरना + महा + RB
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                    <span className="text-pink-600 font-semibold min-w-[80px]">उठाव शेष =</span>
                                    <div className="font-mono text-xs bg-pink-50 px-3 py-1.5 rounded text-pink-700">
                                        कुल - उठाव
                                    </div>
                                </div>

                                <div className="flex items-start gap-2 pt-2 mt-2 border-t border-border/50">
                                    <span className="font-semibold min-w-[80px]">Color Code:</span>
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                            <span className="text-red-600 font-medium">शेष मात्रा (Balance Quantity)</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                            <span className="text-green-600 font-medium">शून्य शेष (Zero Balance)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete DO Entry</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete DO <span className="font-semibold text-foreground">{doToDelete?.doNumber}</span>? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteDOMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View DO Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                <DrawerContent className="h-full w-full sm:max-w-[420px] border-l shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-1.5 border-b border-border/40">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">DO Entry Details</h2>
                            <p className="text-sm text-muted-foreground">DO उठाव जानकारी</p>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </DrawerClose>
                    </div>
                    
                    {selectedDO && (
                        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
                            {/* DO Number Card */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-1">DO Number</p>
                                        <p className="text-base font-semibold text-foreground truncate">
                                            {selectedDO.doNumber || <span className="text-muted-foreground/50">Not provided</span>}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                                        selectedDO.balance <= 0 
                                            ? "bg-success/10 text-success" 
                                            : "bg-destructive/10 text-destructive"
                                    )}>
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            selectedDO.balance <= 0 ? "bg-success" : "bg-destructive"
                                        )} />
                                        {selectedDO.balance <= 0 ? 'Completed' : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Details Card */}
                            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        DO Lifting Information
                                    </h3>
                                </div>
                                <div className="divide-y divide-border/30">
                                    {/* Committee */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                                            <BuildingOffice2Icon className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Committee/Center</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedDO.committeeCenter || <span className="text-muted-foreground/50">Not provided</span>}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Total Quantity */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                                            <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Total Quantity</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedDO.total || ' 0'} क्विंटल
                                            </p>
                                        </div>
                                    </div>

                                    {/* Lifting */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                                            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">उठाव (Lifting)</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedDO.lifting?.toFixed(2) || '0.00'} क्विंटल
                                            </p>
                                        </div>
                                    </div>

                                    {/* Balance */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className={cn(
                                            "h-10 w-10 rounded-xl flex items-center justify-center",
                                            selectedDO.balance <= 0 
                                                ? "bg-linear-to-br from-green-500/20 to-green-500/5"
                                                : "bg-linear-to-br from-red-500/20 to-red-500/5"
                                        )}>
                                            <svg className={cn(
                                                "h-5 w-5",
                                                selectedDO.balance <= 0 ? "text-green-600" : "text-red-600"
                                            )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">उठाव शेष (Balance)</p>
                                            <p className={cn(
                                                "text-sm font-semibold",
                                                selectedDO.balance <= 0 ? "text-green-600" : "text-red-600"
                                            )}>
                                                {selectedDO.balance?.toFixed(2) || '0.00'} क्विंटल
                                            </p>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                                            <CalendarIcon className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Date</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedDO.date 
                                                    ? new Date(selectedDO.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                    : '—'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
