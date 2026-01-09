"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BuildingOffice2Icon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Drawer, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { setPageIndex, setPageSize } from "@/store/slices/tableSlice";
import TablePagination from "@/components/ui/table-pagination";
import EmptyState from "@/components/EmptyState";
import { useCommittee, useDeleteCommittee } from "@/hooks/useCommittee";
import { cn } from "@/lib/utils";

export default function CommitteeEntryReport() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pageIndex, pageSize } = useSelector((state) => state.table);
  const { t } = useTranslation(["reports", "common"]);

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  // State for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [committeeToDelete, setCommitteeToDelete] = useState(null);

  // Use the useCommittee hook to fetch data
  const { committees, totalPages, currentPage, isLoading, isError, error } =
    useCommittee();

  // Delete committee mutation
  const deleteCommitteeMutation = useDeleteCommittee();

  // Table column definitions
  const columns = [
    {
      accessorKey: "type",
      header: "प्रकार",
      meta: { filterVariant: "dropdown" },
      cell: ({ row }) => {
        const type = row.getValue("type");
        return <div className="text-sm font-medium">{type}</div>;
      },
    },
    {
      accessorKey: "committeeName",
      header: "समिति का नाम",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("committeeName")}</div>
      ),
    },
    {
      id: "actions",
      header: "",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const committee = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <EllipsisHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(committee)}>
                <EyeIcon className="mr-2 h-4 w-4" />
                {t("common:view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(committee)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                {t("common:edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(committee)}
                className="text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                {t("common:delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleView = (committee) => {
    setSelectedCommittee(committee);
    setIsDrawerOpen(true);
  };

  const handleEdit = (committee) => {
    navigate("/entry/committee", { state: { committee, isEditing: true } });
  };

  const handleDelete = (committee) => {
    setCommitteeToDelete(committee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!committeeToDelete?._id) return;

    try {
      await deleteCommitteeMutation.mutateAsync(committeeToDelete._id);
      toast.success("Committee Deleted", {
        description: `${committeeToDelete.committeeName} has been deleted successfully.`,
      });
    } catch (error) {
      toast.error("Failed to delete committee", {
        description: error.message || "An error occurred.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCommitteeToDelete(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
        <div className="flex flex-col items-center gap-3">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Loading committee information...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
        <p className="text-destructive mb-2 font-semibold">
          Error loading committees
        </p>
        <p className="text-muted-foreground text-sm">
          {error?.message || "Something went wrong"}
        </p>
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

  // Empty state - no committees
  if (!isLoading && committees.length === 0) {
    return (
      <EmptyState
        title="आपने अभी तक कोई समिति संग्रहण नहीं जोड़ी है!"
        description="नई समिति संग्रहण जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
        buttonText="समिति संग्रहण जोड़ें"
        addRoute="/entry/committee"
        icon={BuildingOffice2Icon}
      />
    );
  }

  return (
    <div className="container mx-auto py-2">
      <Card className={"py-0"}>
        <CardContent className="p-6">
          <DataTable columns={columns} data={committees} showFilters={false} />

          <TablePagination
            pageIndex={pageIndex}
            pageCount={totalPages}
            pageSize={pageSize}
            setPageIndex={(index) => dispatch(setPageIndex(index))}
            setPageSize={(size) => dispatch(setPageSize(size))}
            canPreviousPage={currentPage > 1}
            canNextPage={currentPage < totalPages}
            previousPage={() =>
              dispatch(setPageIndex(Math.max(0, pageIndex - 1)))
            }
            nextPage={() => dispatch(setPageIndex(pageIndex + 1))}
            paginationItemsToDisplay={5}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Committee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {committeeToDelete?.committeeName}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCommitteeMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Committee Drawer */}
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="right"
      >
        <DrawerContent className="h-full w-full sm:max-w-[420px] border-l shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-1.5 border-b border-border/40">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Committee Details
              </h2>
              <p className="text-sm text-muted-foreground">View information</p>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-muted"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </DrawerClose>
          </div>

          {selectedCommittee && (
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {/* Name Card with Status */}
              <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      Committee Name
                    </p>
                    <p className="text-base font-semibold text-foreground truncate">
                      {selectedCommittee.committeeName || (
                        <span className="text-muted-foreground/50">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                      selectedCommittee.isActive !== false
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        selectedCommittee.isActive !== false
                          ? "bg-success"
                          : "bg-destructive"
                      )}
                    />
                    {selectedCommittee.isActive !== false
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Type Card */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Committee Type
                  </h3>
                </div>
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BuildingOffice2Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">Type</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedCommittee.type === "committee-production" ? (
                        "समिति-उपार्जन केंद्र"
                      ) : selectedCommittee.type === "storage-center" ? (
                        "संग्रहण केंद्र"
                      ) : (
                        <span className="text-muted-foreground/50">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                    Created
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    {selectedCommittee.createdAt
                      ? new Date(
                          selectedCommittee.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                    Updated
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    {selectedCommittee.updatedAt
                      ? new Date(
                          selectedCommittee.updatedAt
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
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
