"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, TruckIcon } from '@heroicons/react/24/outline';
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
import EmptyState from '@/components/EmptyState';
import { useTrucks, useDeleteTruck } from '@/hooks/useTruck';
import { cn } from '@/lib/utils';

export default function VehicleEntryReport() {
    const navigate = useNavigate();
    const { t } = useTranslation(['reports', 'common']);

    // State for drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    
    // State for delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState(null);

    // Use the useTrucks hook to fetch data
    const { data: trucks, isLoading, isError, error } = useTrucks();
    
    // Delete vehicle mutation
    const deleteVehicleMutation = useDeleteTruck();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'truckNumber',
            header: 'वाहन नंबर',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('truckNumber')}</div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'जोड़ने की तिथि',
            cell: ({ row }) => {
                const date = row.getValue('createdAt');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            accessorKey: 'updatedAt',
            header: 'सुधार की तिथि',
            cell: ({ row }) => {
                const date = row.getValue('updatedAt');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            id: 'actions',
            header: '',
            enableColumnFilter: false,
            cell: ({ row }) => {
                const vehicle = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(vehicle)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(vehicle)}
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

    const handleView = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsDrawerOpen(true);
    };

    const handleEdit = (vehicle) => {
        navigate('/entry/trucks', { state: { vehicle, isEditing: true } });
    };

    const handleDelete = (vehicle) => {
        setVehicleToDelete(vehicle);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!vehicleToDelete?._id) return;
        
        try {
            await deleteVehicleMutation.mutateAsync(vehicleToDelete._id);
            toast.success('Vehicle Deleted', {
                description: `${vehicleToDelete.truckNumber} has been deleted successfully.`,
            });
        } catch (error) {
            toast.error('Failed to delete vehicle', {
                description: error.message || 'An error occurred.',
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setVehicleToDelete(null);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading vehicles...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading vehicles</p>
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

    // Empty state - no vehicles
    if (!isLoading && (!trucks || trucks.length === 0)) {
        return (
            <EmptyState
                title="आपने अभी तक कोई वाहन नहीं जोड़ा है!"
                description="नया वाहन जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="वाहन जोड़ें"
                addRoute="/entry/trucks"
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
                        data={trucks || []}
                        showFilters={false}
                    />
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">{vehicleToDelete?.truckNumber}</span>? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteVehicleMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View Vehicle Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                <DrawerContent className="h-full w-full sm:max-w-[420px] border-l shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-1.5 border-b border-border/40">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Vehicle Details</h2>
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
                    
                    {selectedVehicle && (
                        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
                            {/* Vehicle Number Card with Status */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-1">Vehicle Number</p>
                                        <p className="text-base font-semibold text-foreground truncate">
                                            {selectedVehicle.truckNumber || <span className="text-muted-foreground/50">Not provided</span>}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                                        selectedVehicle.isActive !== false 
                                            ? "bg-success/10 text-success" 
                                            : "bg-destructive/10 text-destructive"
                                    )}>
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            selectedVehicle.isActive !== false ? "bg-success" : "bg-destructive"
                                        )} />
                                        {selectedVehicle.isActive !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="flex gap-3">
                                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Created</p>
                                    <p className="text-xs font-medium text-foreground">
                                        {selectedVehicle.createdAt 
                                            ? new Date(selectedVehicle.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'
                                        }
                                    </p>
                                </div>
                                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Updated</p>
                                    <p className="text-xs font-medium text-foreground">
                                        {selectedVehicle.updatedAt 
                                            ? new Date(selectedVehicle.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
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
