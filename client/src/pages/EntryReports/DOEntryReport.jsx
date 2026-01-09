"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOffice2Icon,
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
import { useDOEntries, useDeleteDOEntry } from "@/hooks/useDOEntries";
import { cn } from "@/lib/utils";

export default function DOEntryReport() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pageIndex, pageSize } = useSelector((state) => state.table);
  const { t } = useTranslation(["reports", "common"]);

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDO, setSelectedDO] = useState(null);

  // State for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [doToDelete, setDoToDelete] = useState(null);

  // Use the useDOEntries hook to fetch data
  const {
    doEntries,
    totalPages,
    currentPage,
    isLoading,
    isError,
    error,
    hasNext,
    hasPrev,
  } = useDOEntries();

  // Delete DO mutation
  const deleteDOMutation = useDeleteDOEntry();

  // Table column definitions
  const columns = [
    {
      accessorKey: "doNumber",
      header: "DO नंबर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium ">{row.getValue("doNumber")}</div>
      ),
    },
    {
      accessorKey: "committeeCenter",
      header: "समिति / संग्रहण केंद्र",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("committeeCenter")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "दिनांक",
      meta: { filterVariant: "date" },
      cell: ({ row }) => {
        const date = row.getValue("date");
        if (!date) return <span className="text-muted-foreground">-</span>;
        const formattedDate = format(new Date(date), "dd MMM yyyy");
        return <div className="text-sm whitespace-nowrap">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "paddyMota",
      header: "धान (मोटा)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("paddyMota") || 0}</div>
      ),
    },
    {
      accessorKey: "paddyPatla",
      header: "धान (पतला)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm ">{row.getValue("paddyPatla") || 0}</div>
      ),
    },
    {
      accessorKey: "paddySarna",
      header: "धान (सरना)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm ">{row.getValue("paddySarna") || 0}</div>
      ),
    },
    {
      accessorKey: "total",
      header: "कुल (क्विंटल)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm font-bold">{row.getValue("total") || 0}</div>
      ),
    },
    {
      id: "actions",
      header: "",
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
                {t("common:view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(entry)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                {t("common:edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(entry)}
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

  const handleView = (entry) => {
    setSelectedDO(entry);
    setIsDrawerOpen(true);
  };

  const handleEdit = (entry) => {
    navigate("/entry/do", { state: { doEntry: entry, isEditing: true } });
  };

  const handleDelete = (entry) => {
    setDoToDelete(entry);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!doToDelete?._id) return;

    try {
      await deleteDOMutation.mutateAsync(doToDelete._id);
      toast.success("DO Entry Deleted", {
        description: `DO ${doToDelete.doNumber} has been deleted successfully.`,
      });
    } catch (error) {
      toast.error("Failed to delete DO entry", {
        description: error.message || "An error occurred.",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDoToDelete(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
        <div className="flex flex-col items-center gap-3">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Loading DO entries...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
        <p className="text-destructive mb-2 font-semibold">
          Error loading DO entries
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

  // Empty state - no DO entries
  if (!isLoading && doEntries.length === 0) {
    return (
      <EmptyState
        title="आपने अभी तक कोई DO प्रविष्टी नहीं जोड़ी है!"
        description="नई DO प्रविष्टी जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
        buttonText="DO प्रविष्टी जोड़ें"
        addRoute="/entry/do"
        icon={DocumentTextIcon}
      />
    );
  }

  return (
    <div className="container mx-auto py-2">
      <Card className={"py-0"}>
        <CardContent className="p-6">
          <DataTable
            columns={columns}
            data={doEntries}
            showFilters={[
              "date",
              "committeeCenter",
              "paddySarna",
              "paddyPatla",
              "paddyMota",
            ]}
          />

          <TablePagination
            pageIndex={pageIndex}
            pageCount={totalPages}
            pageSize={pageSize}
            setPageIndex={(index) => dispatch(setPageIndex(index))}
            setPageSize={(size) => dispatch(setPageSize(size))}
            canPreviousPage={hasPrev}
            canNextPage={hasNext}
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
            <AlertDialogTitle>Delete DO Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete DO{" "}
              <span className="font-semibold text-foreground">
                {doToDelete?.doNumber}
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
              {deleteDOMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View DO Drawer */}
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
                DO Details
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

          {selectedDO && (
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {/* DO Number Card with Status */}
              <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      DO Number
                    </p>
                    <p className="text-base font-semibold text-foreground truncate">
                      {selectedDO.doNumber || (
                        <span className="text-muted-foreground/50">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                      selectedDO.isActive !== false
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        selectedDO.isActive !== false
                          ? "bg-success"
                          : "bg-destructive"
                      )}
                    />
                    {selectedDO.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Committee/Center Card */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Committee / Center
                  </h3>
                </div>
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <BuildingOffice2Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      समिति/केंद्र
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedDO.committeeCenter || (
                        <span className="text-muted-foreground/50">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Card */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date
                  </h3>
                </div>
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-br from-secondary/40 to-secondary/10 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">तिथि</p>
                    <p className="text-sm font-medium text-foreground">
                      {selectedDO.date ? (
                        new Date(selectedDO.date).toLocaleDateString("hi-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      ) : (
                        <span className="text-muted-foreground/50">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grain Details Card */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Grain Details (क्विंटल)
                  </h3>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border/30">
                  <div className="px-4 py-3.5 text-center">
                    <p className="text-xs text-muted-foreground mb-1">मोटा</p>
                    <p className="text-lg font-semibold text-foreground">
                      {selectedDO.paddyMota || 0}
                    </p>
                  </div>
                  <div className="px-4 py-3.5 text-center">
                    <p className="text-xs text-muted-foreground mb-1">पतला</p>
                    <p className="text-lg font-semibold text-foreground">
                      {selectedDO.paddyPatla || 0}
                    </p>
                  </div>
                  <div className="px-4 py-3.5 text-center">
                    <p className="text-xs text-muted-foreground mb-1">सरना</p>
                    <p className="text-lg font-semibold text-foreground">
                      {selectedDO.paddySarna || 0}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-border/30 bg-primary/5">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-muted-foreground">
                      कुल Total
                    </p>
                    <p className="text-xl font-bold text-primary">
                      {selectedDO.total || 0} क्विंटल
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
                    {selectedDO.createdAt
                      ? new Date(selectedDO.createdAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )
                      : "—"}
                  </p>
                </div>
                <div className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-4 py-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                    Updated
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    {selectedDO.updatedAt
                      ? new Date(selectedDO.updatedAt).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" }
                        )
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
