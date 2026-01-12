"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { FormProvider, useForm } from "react-hook-form";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Button } from "@/components/ui/button";
import { ReportTableSection } from "@/components/ui/report-table";

export default function DailyReport() {
  const { t } = useTranslation(["reports", "common"]);
  const form = useForm({
    defaultValues: {
      reportDate: new Date(),
    },
  });

  // Mock data - replace with actual API data based on selected date
  const dailyData = {
    dhaanBhooki: [
      { kisaan: "", matra: 0 },
      { kisaan: "", matra: 0 },
      { kisaan: "", matra: 0 },
      { kisaan: "", matra: 0 },
      { kisaan: "", matra: 0 },
    ],
    awakBhooki: [
      { kisaan: "", matra: 0 },
      { kisaan: "", matra: 0 },
      { kisaan: "", matra: 0 },
      { kisaan: "", matra: 0 },
      { kisaan: "", matra: 0 },
    ],
    prapti: {
      items: [
        "धान (मोटा)",
        "धान (पतला)",
        "धान (सरना)",
        "धान (महामाया)",
        "धान (RB GOLD)",
        "चावल (पतला)",
        "चावल (मोटा)",
        "FRK",
      ],
      values: Array(8).fill(0),
    },
    bhugtan: {
      items: [
        "धान (मोटा)",
        "धान (पतला)",
        "धान (सरना)",
        "धान (महामाया)",
        "धान (RB GOLD)",
        "चावल (पतला)",
        "चावल (मोटा)",
        "खंडा",
        "कोढ़ा",
        "नक्खी",
        "भूसा",
        "सिल्की कोढ़ा",
      ],
      values: Array(12).fill(0),
    },
    milling: {
      kisaan: [
        { item: "धान (पतला)", value: 0 },
        { item: "धान (मोटा)", value: 0 },
        { item: "FRK", value: 0 },
      ],
      sankhi: [
        { item: "चावल (पतला)", value: 0 },
        { item: "चावल (मोटा)", value: 0 },
        { item: "खंडा", value: 0 },
        { item: "कोढ़ा", value: 0 },
        { item: "नक्खी", value: 0 },
        { item: "सिल्की कोढ़ा", value: 0 },
      ],
    },
  };

  const handleDateChange = (data) => {
    console.log("Selected date:", data.reportDate);
    // Fetch data for the selected date
  };

  return (
    <div className="container mx-auto py-4 px-4">
      {/* Page Header with Date Selection */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <CalendarIcon className="h-7 w-7 text-primary" />
            दैनिक रिपोर्ट (Daily Report)
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            दैनिक लेनदेन रिपोर्ट
          </p>
        </div>

        {/* Date Picker */}
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleDateChange)}
            className="flex items-end gap-2"
          >
            <DatePickerField
              name="reportDate"
              label="तारीख चुनें"
              placeholder="dd-mm-yyyy"
              className="w-48"
            />
            <Button type="submit" size="sm">
              देखें
            </Button>
          </form>
        </FormProvider>
      </div>

      {/* Main Report Container */}
      <div className="space-y-6">
        {/* Upper Section: Dhaan & Awak Bhooki Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dhaan Bhooki Section */}
          <ReportTableSection title="धान भूकी" theme="blue">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-1/2">
                    किसान
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/2">
                    मात्रा
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyData.dhaanBhooki.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-sm border-r border-border">
                      {row.kisaan || "-"}
                    </td>
                    <td className="px-4 py-2.5 text-sm">{row.matra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportTableSection>

          {/* Awak Bhooki Section */}
          <ReportTableSection title="आवक भूकी" theme="pink">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-1/2">
                    किसान
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/2">
                    मात्रा
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyData.awakBhooki.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-sm border-r border-border">
                      {row.kisaan || "-"}
                    </td>
                    <td className="px-4 py-2.5 text-sm">{row.matra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportTableSection>
        </div>

        {/* Jawak Section (Prapti & Bhugtan Side by Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prapti Section */}
          <ReportTableSection title="जावक - प्राप्ति" theme="green">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-2/3">
                    विवरण
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/3">
                    राशि
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyData.prapti.items.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-sm border-r border-border">
                      {item}
                    </td>
                    <td className="px-4 py-2.5 text-sm">
                      {dailyData.prapti.values[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportTableSection>

          {/* Bhugtan Section */}
          <ReportTableSection title="जावक - भुगतान" theme="red">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-2/3">
                    विवरण
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/3">
                    राशि
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyData.bhugtan.items.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-sm border-r border-border">
                      {item}
                    </td>
                    <td className="px-4 py-2.5 text-sm">
                      {dailyData.bhugtan.values[index]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportTableSection>
        </div>

        {/* Milling Section (Kisaan & Sankhi Side by Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kisaan Section */}
          <ReportTableSection title="मिलिंग - किसान" theme="purple">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-2/3">
                    विवरण
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/3">
                    मात्रा
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyData.milling.kisaan.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-sm border-r border-border">
                      {row.item}
                    </td>
                    <td className="px-4 py-2.5 text-sm">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportTableSection>

          {/* Sankhi Section */}
          <ReportTableSection title="मिलिंग - संखी" theme="orange">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border w-2/3">
                    विवरण
                  </th>
                  <th className="px-4 py-2.5 text-left text-sm font-medium text-muted-foreground w-1/3">
                    मात्रा
                  </th>
                </tr>
              </thead>
              <tbody>
                {dailyData.milling.sankhi.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-sm border-r border-border">
                      {row.item}
                    </td>
                    <td className="px-4 py-2.5 text-sm">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ReportTableSection>
        </div>
      </div>
    </div>
  );
}
