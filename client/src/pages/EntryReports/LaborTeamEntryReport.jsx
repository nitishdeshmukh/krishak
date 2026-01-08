"use client";

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon, EllipsisHorizontalIcon, EyeIcon, PencilIcon, TrashIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline';
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
import { useLaborTeams, useDeleteLaborTeam } from '@/hooks/useLaborTeam';
import { cn } from '@/lib/utils';

export default function LaborTeamEntryReport() {
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
    const [selectedTeam, setSelectedTeam] = useState(null);
    
    // State for delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);

    // Use the useLaborTeams hook to fetch data
    const { data: laborTeams = [], isLoading, isError, error } = useLaborTeams();
    
    // Debug: Log the fetched data
    React.useEffect(() => {
        console.log('LaborTeamEntryReport - Data received:', laborTeams);
        console.log('LaborTeamEntryReport - isLoading:', isLoading);
        console.log('LaborTeamEntryReport - isError:', isError);
        console.log('LaborTeamEntryReport - error:', error);
    }, [laborTeams, isLoading, isError, error]);
    
    // Client-side pagination logic
    const totalItems = laborTeams.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const currentPage = pageIndex + 1;
    
    const paginatedData = useMemo(() => {
        const start = pageIndex * pageSize;
        return laborTeams.slice(start, start + pageSize);
    }, [laborTeams, pageIndex, pageSize]);

    // Delete team mutation
    const deleteTeamMutation = useDeleteLaborTeam();

    // Table column definitions
    const columns = [
        {
            accessorKey: 'name',
            header: 'लेबर टीम का नाम', // Hindi translation for Labor Team Name
            meta: { filterVariant: 'text' },
            cell: ({ row }) => (
                <div className="font-medium text-base">{row.getValue('name')}</div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'बनाने की तिथि', // Created Date
            cell: ({ row }) => {
                const date = row.getValue('createdAt');
                if (!date) return <span className="text-muted-foreground">-</span>;
                const formattedDate = new Date(date).toLocaleDateString('hi-IN');
                return <div className="text-sm">{formattedDate}</div>;
            },
        },
        {
            accessorKey: 'updatedAt',
            header: 'सुधार की तिथि', // Update Date
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
                const team = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(team)}>
                                <EyeIcon className="mr-2 h-4 w-4" />
                                {t('common:view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(team)}>
                                <PencilIcon className="mr-2 h-4 w-4" />
                                {t('common:edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDelete(team)}
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

    const handleView = (team) => {
        setSelectedTeam(team);
        setIsDrawerOpen(true);
    };

    const handleEdit = (team) => {
        navigate('/entry/labor-team', { state: { laborTeam: team, isEditing: true } });
    };

    const handleDelete = (team) => {
        setTeamToDelete(team);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!teamToDelete?._id) return;
        
        try {
            await deleteTeamMutation.mutateAsync(teamToDelete._id);
            toast.success('Labor Team Deleted', {
                description: `${teamToDelete.name} has been deleted successfully.`,
            });
        } catch (error) {
            toast.error('Failed to delete labor team', {
                description: error.message || 'An error occurred.',
            });
        } finally {
            setIsDeleteDialogOpen(false);
            setTeamToDelete(null);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
                <div className="flex flex-col items-center gap-3">
                    <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">Loading labor teams...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
                <p className="text-destructive mb-2 font-semibold">Error loading labor teams</p>
                <p className="text-muted-foreground text-sm">{error?.message || 'Something went wrong'}</p>
                <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                    variant="outline"
                    title="Retry"
                >
                    Retry
                </Button>
            </div>
        );
    }

    // Empty state - no teams
    if (!isLoading && laborTeams.length === 0) {
        return (
            <EmptyState
                title="आपने अभी तक कोई लेबर टीम नहीं जोड़ी है!"
                description="नई लेबर टीम जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
                buttonText="लेबर टीम जोड़ें"
                addRoute="/entry/labor-team"
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
                        data={paginatedData}
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
                        <AlertDialogTitle>Delete Labor Team</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-foreground">{teamToDelete?.name}</span>? 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={confirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleteTeamMutation.isPending ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View Labor Team Drawer */}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
                <DrawerContent className="h-full w-full sm:max-w-[420px] border-l shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-1.5 border-b border-border/40">
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Labor Team Details</h2>
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
                    
                    {selectedTeam && (
                        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
                            {/* Name Card with Status */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-muted-foreground mb-1">Team Name</p>
                                        <p className="text-base font-semibold text-foreground truncate">
                                            {selectedTeam.name || <span className="text-muted-foreground/50">Not provided</span>}
                                        </p>
                                    </div>
                                    <span className={cn(
                                        "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                                        selectedTeam.isActive !== false 
                                            ? "bg-success/10 text-success" 
                                            : "bg-destructive/10 text-destructive"
                                    )}>
                                        <span className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            selectedTeam.isActive !== false ? "bg-success" : "bg-destructive"
                                        )} />
                                        {selectedTeam.isActive !== false ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="flex gap-3">
                                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Created</p>
                                    <p className="text-xs font-medium text-foreground">
                                        {selectedTeam.createdAt 
                                            ? new Date(selectedTeam.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                            : '—'
                                        }
                                    </p>
                                </div>
                                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Updated</p>
                                    <p className="text-xs font-medium text-foreground">
                                        {selectedTeam.updatedAt 
                                            ? new Date(selectedTeam.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
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
