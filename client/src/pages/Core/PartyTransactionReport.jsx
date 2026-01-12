"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { UserIcon } from "@heroicons/react/24/outline";
import { FormProvider, useForm } from "react-hook-form";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Button } from "@/components/ui/button";
import {
  ReportTable,
  ReportTableSection,
  sectionColors,
} from "@/components/ui/report-table";

export default function PartyTransactionReport() {
  const { t } = useTranslation(["reports", "common"]);
  const form = useForm({
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
    },
  });

  // Mock data - replace with actual API data
  const partyData = [
    {
      partyName: "",
      brokerName: "",
      description: "",
      purchaseDeal: 0,
      salesDeal: 0,
      inward: 0,
      outward: 0,
      accountPani: 0,
      accountDhutmap: 0,
      accountBrokerage: 0,
      pani: 0,
      dhutman: 0,
      brokerage: 0,
    },
  ];

  const handleDateChange = (data) => {
    console.log("Date range:", data.startDate, "to", data.endDate);
    // Fetch party transaction data for the selected date range
  };

  // Define header groups for multi-row headers
  const headerGroups = [
    {
      headers: [
        {
          label: "पार्टी का नाम",
          rowSpan: 2,
          className: "sticky left-0 z-20 bg-muted/50 min-w-[150px]",
        },
        { label: "ब्रोकर का नाम", rowSpan: 2, className: "min-w-[120px]" },
        { label: "विवरण", rowSpan: 2, className: "min-w-[150px]" },
        {
          label: "सौदा",
          colSpan: 2,
          className: "text-center font-semibold",
          sectionColor: sectionColors.blue.header,
        },
        {
          label: "आवक-जावक",
          colSpan: 2,
          className: "text-center font-semibold",
          sectionColor: sectionColors.green.header,
        },
        {
          label: "हिसाब",
          colSpan: 3,
          className: "text-center font-semibold",
          sectionColor: sectionColors.orange.header,
        },
        {
          label: "कुल",
          colSpan: 3,
          className: "text-center font-semibold",
          sectionColor: sectionColors.purple.header,
        },
      ],
    },
    {
      headers: [
        {
          label: "खरीदी सौदा",
          className: "text-xs",
          sectionColor: sectionColors.blue.header,
        },
        {
          label: "बिक्री सौदा",
          className: "text-xs",
          sectionColor: sectionColors.blue.header,
        },
        {
          label: "आवक",
          className: "text-xs",
          sectionColor: sectionColors.green.header,
        },
        {
          label: "जावक",
          className: "text-xs",
          sectionColor: sectionColors.green.header,
        },
        {
          label: "पानि",
          className: "text-xs",
          sectionColor: sectionColors.orange.header,
        },
        {
          label: "धुतमाप",
          className: "text-xs",
          sectionColor: sectionColors.orange.header,
        },
        {
          label: "दलाली",
          className: "text-xs",
          sectionColor: sectionColors.orange.header,
        },
        {
          label: "पानि",
          className: "text-xs",
          sectionColor: sectionColors.purple.header,
        },
        {
          label: "धुतमान",
          className: "text-xs",
          sectionColor: sectionColors.purple.header,
        },
        {
          label: "दलाली",
          className: "text-xs",
          sectionColor: sectionColors.purple.header,
        },
      ],
    },
  ];

  // Define columns
  const columns = [
    { accessor: "partyName", cellClassName: "sticky left-0 z-10 bg-card" },
    { accessor: "brokerName" },
    { accessor: "description" },
    { accessor: "purchaseDeal", sectionColor: sectionColors.blue.cell },
    { accessor: "salesDeal", sectionColor: sectionColors.blue.cell },
    { accessor: "inward", sectionColor: sectionColors.green.cell },
    { accessor: "outward", sectionColor: sectionColors.green.cell },
    { accessor: "accountPani", sectionColor: sectionColors.orange.cell },
    { accessor: "accountDhutmap", sectionColor: sectionColors.orange.cell },
    { accessor: "accountBrokerage", sectionColor: sectionColors.orange.cell },
    {
      accessor: "pani",
      cellClassName: "font-medium",
      sectionColor: sectionColors.purple.cell,
    },
    {
      accessor: "dhutman",
      cellClassName: "font-medium",
      sectionColor: sectionColors.purple.cell,
    },
    {
      accessor: "brokerage",
      cellClassName: "font-medium",
      sectionColor: sectionColors.purple.cell,
    },
  ];

  // Custom empty state
  const emptyState = (
    <div className="flex flex-col items-center gap-2">
      <UserIcon className="h-12 w-12 text-muted-foreground/50" />
      <p className="text-base font-medium">कोई डेटा उपलब्ध नहीं</p>
      <p className="text-sm">चयनित अवधि के लिए कोई पार्टी लेनदेन नहीं मिला</p>
    </div>
  );

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Page Header with Date Range Selection */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <UserIcon className="h-7 w-7 text-primary" />
            पार्टी लेनदेन (Party Transaction)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            पार्टी-वार लेनदेन विवरण
          </p>
        </div>

        {/* Date Range Picker */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleDateChange)}
            className="flex items-end gap-2 flex-wrap"
          >
            <DatePickerField
              name="startDate"
              label="आरंभ तारीख"
              placeholder="dd-mm-yyyy"
              className="w-44"
            />
            <DatePickerField
              name="endDate"
              label="अंतिम तारीख"
              placeholder="dd-mm-yyyy"
              className="w-44"
            />
            <Button type="submit" size="sm">
              देखें
            </Button>
          </form>
        </FormProvider>
      </div>

      {/* Party Transaction Table using ReportTableSection */}
      <ReportTableSection title="पार्टी लेनदेन विवरण" theme="teal">
        <ReportTable
          headerGroups={headerGroups}
          columns={columns}
          data={partyData}
          stickyColumns={1}
          emptyState={emptyState}
        />
      </ReportTableSection>
    </div>
  );
}
