"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, PhoneIcon, TruckIcon, EnvelopeIcon, MapPinIcon, IdentificationIcon } from '@heroicons/react/24/outline';
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
import { useTransporters, useDeleteTransporter } from '@/hooks/useTransporters';
import { cn } from '@/lib/utils';

export default function TransportersEntryReport() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pageIndex, pageSize } = useSelector(state => state.table);
    const { t } = useTranslation(['reports', 'common']);
    
    // State for drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedTransporter, setSelectedTransporter] = useState(null);
    
    // State for delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [transporterToDelete, setTransporterToDelete] = useState(null);

    // Use the useTransporters hook to fetch data
    const { transporters, totalPages, currentPage, isLoading, isError, error } = useTransporters();
    
    // Delete transporter mutation
    const deleteTransporterMutation = useDeleteTransporter();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'transporterName',
            header: 'परिवहनकर्ता का नाम',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('transporterName')}</div>
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
            accessorKey: 'gstn',
            header: 'GSTN',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => {
                const gstn = row.getValue('gstn');
                return gstn ? (
                    <div className="text-sm ">{gstn}</div>
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
            header: '',
            enableColumnFilter: false,
            cell: ({ row }) => {
                const transporter = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(transporter)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(transporter)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(transporter)}
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

    const handleView = (transporter) => {
        setSelectedTransporter(transporter);
        setIsDrawerOpen(true);
    };

    const handleEdit = (transporter) => {
        navigate('/entry/transporters', { state: { transporter, isEditing: true } });
    };

    const handleDelete = (transporter) => {
        setTransporterToDelete(transporter);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!transporterToDelete?._id) return;
        
        try {
            await deleteTransporterMutation.mutateAsync(transporterToDelete._id);
            toast.success('Transporter Deleted', {
                description: `${transporterToDelete.transporterName} has been deleted successfully.`,
            });
        } catch (error) {
            toast.error('Failed to delete transporter', {
                description: error.message || 'An error occurred.',
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setTransporterToDelete(null);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading transporter information...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading transporters</p>
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

    // Empty state - no transporters
    if (!isLoading && transporters.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई परिवहनकर्ता नहीं जोड़ा है!"
                description="नया परिवहनकर्ता जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="परिवहनकर्ता जोड़ें"
                addRoute="/entry/transporters"
                icon={TruckIcon}
            />
        );
    }

    return (
        <div className="container mx-auto py-2">
            <Card className={"py-0"}>
                <CardContent className="p-6">
                    <DataTable
                        columns={columns}
                        data={transporters}
                        showFilters={false}
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Transporter</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">{transporterToDelete?.transporterName}</span>? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteTransporterMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View Transporter Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                <DrawerContent className="h-full w-full sm:max-w-[420px] border-l shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-1.5 border-b border-border/40">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Transporter Details</h2>
                            <p className="text-sm text-muted-foreground">View information</p>
                        </div>
                        <DrawerClose asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </DrawerClose>
                    </div>
                    
                    {selectedTransporter && (
                        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
                            {/* Name Card with Status */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-1">Transporter Name</p>
                                        <p className="text-base font-semibold text-foreground truncate">
                                            {selectedTransporter.transporterName || <span className="text-muted-foreground/50">Not provided</span>}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                                        selectedTransporter.isActive !== false 
                                            ? "bg-success/10 text-success" 
                                            : "bg-destructive/10 text-destructive"
                                    )}>
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            selectedTransporter.isActive !== false ? "bg-success" : "bg-destructive"
                                        )} />
                                        {selectedTransporter.isActive !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Contact Information
                                    </h3>
                                </div>
                                <div className="divide-y divide-border/30">
                                    {/* Phone */}
                                    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                            <PhoneIcon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedTransporter.phone || <span className="text-muted-foreground/50">Not provided</span>}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center gap-4 px-4 py-3.5 hover:bg-muted/30 transition-colors">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-secondary/40 to-secondary/10 flex items-center justify-center">
                                            <EnvelopeIcon className="h-5 w-5 text-secondary-foreground" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {selectedTransporter.email || <span className="text-muted-foreground/50">Not provided</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Location
                                    </h3>
                                </div>
                                <div className="flex items-start gap-4 px-4 py-3.5">
                                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-success/20 to-success/5 flex items-center justify-center shrink-0">
                                        <MapPinIcon className="h-5 w-5 text-success" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-0.5">Address</p>
                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                            {selectedTransporter.address || <span className="text-muted-foreground/50">Not provided</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Business Card */}
                            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Business Details
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4 px-4 py-3.5">
                                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-warning/20 to-warning/5 flex items-center justify-center">
                                        <IdentificationIcon className="h-5 w-5 text-warning" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-0.5">GSTN</p>
                                        <p className="text-sm font-semibold text-foreground tracking-wide">
                                            {selectedTransporter.gstn || <span className="text-muted-foreground/50">Not provided</span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="flex gap-3">
                                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Created</p>
                                    <p className="text-xs font-medium text-foreground">
                                        {selectedTransporter.createdAt 
                                            ? new Date(selectedTransporter.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'
                                        }
                                    </p>
                                </div>
                                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Updated</p>
                                    <p className="text-xs font-medium text-foreground">
                                        {selectedTransporter.updatedAt 
                                            ? new Date(selectedTransporter.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
