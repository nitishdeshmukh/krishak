"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, UserGroupIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, BriefcaseIcon, BanknotesIcon } from '@heroicons/react/24/outline';
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
import { useStaff, useDeleteStaff } from '@/hooks/useStaff';
import { cn } from '@/lib/utils';

export default function StaffEntryReport() {
    const navigate = useNavigate();
    const { t } = useTranslation(['reports', 'common']);

    // State for drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    
    // State for delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState(null);

    // Use the useStaff hook to fetch data
    const { data: staffList, isLoading, isError, error } = useStaff();
    
    // Delete staff mutation
    const deleteStaffMutation = useDeleteStaff();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'name',
            header: 'नाम',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('name')}</div>
            ),
        },
        {
            accessorKey: 'post',
            header: 'पद',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('post') || '-'}</div>
            ),
        },
        {
            accessorKey: 'salary',
            header: 'वेतन',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('salary') || '-'}</div>
            ),
        },
        {
            accessorKey: 'phone',
            header: 'फोन',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('phone') || '-'}</div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'ईमेल',
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="text-sm">{row.getValue('email') || '-'}</div>
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
                const staff = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(staff)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(staff)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(staff)}
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

    const handleView = (staff) => {
        setSelectedStaff(staff);
        setIsDrawerOpen(true);
    };

    const handleEdit = (staff) => {
        navigate('/entry/staff', { state: { staff, isEditing: true } });
    };

    const handleDelete = (staff) => {
        setStaffToDelete(staff);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!staffToDelete?._id) return;
        
        try {
            await deleteStaffMutation.mutateAsync(staffToDelete._id);
            toast.success('Staff Deleted', {
                description: `${staffToDelete.name} has been deleted successfully.`,
            });
        } catch (error) {
            toast.error('Failed to delete staff', {
                description: error.message || 'An error occurred.',
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setStaffToDelete(null);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading staff...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading staff</p>
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

    // Empty state - no staff
    if (!isLoading && (!staffList || staffList.length === 0)) {
        return (
            <EmptyState
                title="आपने अभी तक कोई स्टाफ नहीं जोड़ा है!"
                description="नया स्टाफ जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="स्टाफ जोड़ें"
                addRoute="/entry/staff"
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
                        data={staffList || []}
                        showFilters={false}
                    />
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Staff</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">{staffToDelete?.name}</span>? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteStaffMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View Staff Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                <DrawerContent className="h-full w-full sm:max-w-[420px] border-l shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-1.5 border-b border-border/40">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Staff Details</h2>
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
                    
                    {selectedStaff && (
                        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
                            {/* Name Card with Status */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-1">Staff Name</p>
                                        <p className="text-base font-semibold text-foreground truncate">
                                            {selectedStaff.name || <span className="text-muted-foreground/50">Not provided</span>}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                                        selectedStaff.isActive !== false 
                                            ? "bg-success/10 text-success" 
                                            : "bg-destructive/10 text-destructive"
                                    )}>
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            selectedStaff.isActive !== false ? "bg-success" : "bg-destructive"
                                        )} />
                                        {selectedStaff.isActive !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Contact & Details Card */}
                            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Contact Information
                                    </h3>
                                </div>
                                <div className="divide-y divide-border/30">
                                    {/* Post */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                                            <BriefcaseIcon className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Post</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedStaff.post || <span className="text-muted-foreground/50">Not provided</span>}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Salary */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                                            <BanknotesIcon className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Salary</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedStaff.salary || <span className="text-muted-foreground/50">Not provided</span>}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Phone */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center">
                                            <PhoneIcon className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedStaff.phone || <span className="text-muted-foreground/50">Not provided</span>}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Email */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                                            <EnvelopeIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {selectedStaff.email || <span className="text-muted-foreground/50">Not provided</span>}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Address */}
                                    <div className="flex items-center gap-4 px-4 py-3.5">
                                        <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                                            <MapPinIcon className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-muted-foreground mb-0.5">Address</p>
                                            <p className="text-sm font-medium text-foreground">
                                                {selectedStaff.address || <span className="text-muted-foreground/50">Not provided</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="flex gap-3">
                                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Created</p>
                                    <p className="text-xs font-medium text-foreground">
                                        {selectedStaff.createdAt 
                                            ? new Date(selectedStaff.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'
                                        }
                                    </p>
                                </div>
                                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Updated</p>
                                    <p className="text-xs font-medium text-foreground">
                                        {selectedStaff.updatedAt 
                                            ? new Date(selectedStaff.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
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
