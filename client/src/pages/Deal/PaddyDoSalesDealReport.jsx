"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  BanknotesIcon,
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
import EmptyState from "@/components/EmptyState";
import { usePaddyDoSales, useDeletePaddySale } from "@/hooks/usePaddySales";
import { cn } from "@/lib/utils";
import { setPageIndex, setPageSize } from "@/store/slices/tableSlice";
import TablePagination from "@/components/ui/table-pagination";

export default function PaddyDoSalesDealReport() {
  const navigate = useNavigate();
  const { pageIndex, pageSize } = useSelector((state) => state.table);
  const dispatch = useDispatch();
  const { t } = useTranslation(["reports", "common"]);

  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  // State for delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);

  // Fetch DO paddy sales with pagination
  const {
    paddySales,
    totalPages,
    isLoading,
    isError,
    error,
    hasNext,
    hasPrev,
  } = usePaddyDoSales(pageIndex + 1, pageSize);

  // Delete mutation
  const deleteDealMutation = useDeletePaddySale();

  // Table column definitions
  const columns = [
    {
      accessorKey: "dealNumber",
      header: "DO बिक्री सौदा क्रमांक",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium ">{row.getValue("dealNumber")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: "दिनांक",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const date = row.getValue("date") || row.original.dealDate;
        if (!date) return <span className="text-muted-foreground">-</span>;
        const formattedDate = format(new Date(date), "dd MMM yyyy");
        return <div className="text-sm whitespace-nowrap">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "partyName",
      header: "पार्टी का नाम",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("partyName")}</div>
      ),
    },
    {
      accessorKey: "brokerName",
      header: "ब्रोकर का नाम",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("brokerName") || "-"}</div>
      ),
    },
    {
      accessorKey: "paddyType",
      header: "धान का प्रकार",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("paddyType") || "-"}</div>
      ),
    },
    {
      accessorKey: "quantity",
      header: "मात्रा (क्विंटल में.)",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const quantity = row.getValue("quantity");
        return quantity ? (
          <div className="text-sm font-medium">{quantity} क्विंटल</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "delivery",
      header: "डिलीवरी",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        return <div className="text-sm">{row.getValue("delivery")}</div>;
      },
    },
    {
      accessorKey: "rate",
      header: "धान का भाव/दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const rate = row.original.paddyRate || row.getValue("rate");
        return rate ? (
          <div className="text-sm font-medium">₹{rate}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "batavPercent",
      header: "बटाव ( % )",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        const value =
          row.original.wastagePercent || row.getValue("batavPercent");
        return <div className="text-sm ">{value || "-"}</div>;
      },
    },
    {
      accessorKey: "brokerage",
      header: "दलाली",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm ">{row.getValue("brokerage") || "-"}</div>
      ),
    },
    {
      accessorKey: "gunnyOption",
      header: "बारदाना सहित/वापसी",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        return (
          <div className="text-sm">{row.getValue("gunnyOption") || "-"}</div>
        );
      },
    },
    {
      accessorKey: "newGunnyRate",
      header: "नया बारदाना दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => {
        return (
          <div className="text-sm">{row.getValue("newGunnyRate") || "-"}</div>
        );
      },
    },
    {
      accessorKey: "oldGunnyRate",
      header: "पुराना बारदाना दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm ">{row.getValue("oldGunnyRate") || "-"}</div>
      ),
    },
    {
      accessorKey: "plasticGunnyRate",
      header: "प्लास्टिक बारदाना दर",
      meta: { filterVariant: "text" },
      cell: ({ row }) => (
        <div className="text-sm ">
          {row.getValue("plasticGunnyRate") || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
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
                {t("common:view")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(deal)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                {t("common:edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(deal)}
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

  const handleView = (deal) => {
    setSelectedDeal(deal);
    setIsDrawerOpen(true);
  };

  const handleEdit = (deal) => {
    navigate("/sales/paddy", { state: { deal, isEditing: true } });
  };

  const handleDelete = (deal) => {
    setDealToDelete(deal);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!dealToDelete?._id) return;

    try {
      await deleteDealMutation.mutateAsync(dealToDelete._id);
      toast.success("धान DO बिक्री सौदा हटाया गया", {
        description: `सौदा ${dealToDelete.dealNumber} सफलतापूर्वक हटाया गया है।`,
      });
    } catch (error) {
      toast.error("सौदा हटाने में विफल", {
        description: error.message || "कुछ गलत हो गया।",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDealToDelete(null);
    }
  };

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-card rounded-xl border">
        <p className="text-destructive mb-2 font-semibold">
          Error loading paddy DO sales
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-card rounded-xl border">
        <div className="flex flex-col items-center gap-3">
          <ArrowPathIcon className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Loading paddy DO sales deals...
          </p>
        </div>
      </div>
    );
  }

  // Empty state - no sales deals
  if (!isLoading && paddySales.length === 0) {
    return (
      <EmptyState
        title="आपने अभी तक कोई धान DO बिक्री सौदा नहीं जोड़ा है!"
        description="नया धान DO बिक्री सौदा जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें"
        buttonText="धान बिक्री सौदा जोड़ें"
        addRoute="/sales/paddy"
        icon={CurrencyDollarIcon}
      />
    );
  }

  return (
    <div className="container mx-auto py-2">
      <Card className={"py-0"}>
        <CardContent className="p-6 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <DataTable columns={columns} data={paddySales} />
          </div>

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
            <AlertDialogTitle>सौदा हटाएं</AlertDialogTitle>
            <AlertDialogDescription>
              क्या आप वाकई सौदा{" "}
              <span className="font-semibold text-foreground">
                {dealToDelete?.dealNumber}
              </span>{" "}
              को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>रद्द करें</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteDealMutation.isPending ? "हटाया जा रहा है..." : "हटाएं"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Deal Drawer */}
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
                धान DO बिक्री सौदा विवरण
              </h2>
              <p className="text-sm text-muted-foreground">
                Paddy DO Sales Deal
              </p>
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

          {selectedDeal && (
            <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4">
              {/* Deal Number Card */}
              <div className="p-4 rounded-2xl border border-border/50 bg-card/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      सौदा नंबर
                    </p>
                    <p className="text-base font-semibold text-foreground truncate">
                      {selectedDeal.dealNumber || (
                        <span className="text-muted-foreground/50">
                          Not provided
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 mt-3 rounded-full text-xs font-medium",
                      "bg-blue-500/10 text-blue-600"
                    )}
                  >
                    DO बिक्री
                  </span>
                </div>
              </div>

              {/* DO Entries Section */}
              {selectedDeal.doEntries && selectedDeal.doEntries.length > 0 && (
                <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      DO प्रविष्टियां
                    </h3>
                  </div>
                  <div className="divide-y divide-border/30">
                    {selectedDeal.doEntries.map((entry, index) => (
                      <div key={index} className="px-4 py-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">
                          DO #{index + 1}: {entry.doNumber || "-"}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              मोटा:{" "}
                            </span>
                            <span className="font-medium">
                              {entry.dhanMota || "0"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              पतला:{" "}
                            </span>
                            <span className="font-medium">
                              {entry.dhanPatla || "0"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              सरना:{" "}
                            </span>
                            <span className="font-medium">
                              {entry.dhanSarna || "0"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Details Card */}
              <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-border/30 bg-muted/30">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    सौदा जानकारी
                  </h3>
                </div>
                <div className="divide-y divide-border/30">
                  {/* Date */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        दिनांक
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.date
                          ? new Date(selectedDeal.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {/* Party Name */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        पार्टी
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.partyName || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Broker */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        ब्रोकर
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.brokerName || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Paddy Type */}
                  {selectedDeal.paddyType && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-500/20 to-amber-500/5 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-amber-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          धान प्रकार
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {selectedDeal.paddyType}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                      <BanknotesIcon className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        मात्रा
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.quantity || "0"} क्विंटल
                      </p>
                    </div>
                  </div>

                  {/* Rate */}
                  {(selectedDeal.rate || selectedDeal.paddyRate) && (
                    <div className="flex items-center gap-4 px-4 py-3.5">
                      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-green-500/20 to-green-500/5 flex items-center justify-center">
                        <svg
                          className="h-5 w-5 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          दर/क्विंटल
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          ₹{selectedDeal.rate || selectedDeal.paddyRate}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Wastage */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-red-500/20 to-red-500/5 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        बटाव %
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.wastagePercent ||
                          selectedDeal.batavPercent ||
                          "0"}
                        %
                      </p>
                    </div>
                  </div>

                  {/* Brokerage */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        दलाली
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        ₹{selectedDeal.brokerage || "0"}/क्विंटल
                      </p>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div className="flex items-center gap-4 px-4 py-3.5">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500/20 to-indigo-500/5 flex items-center justify-center">
                      <svg
                        className="h-5 w-5 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">
                        डिलीवरी
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedDeal.delivery || "—"}
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
