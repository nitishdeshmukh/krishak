"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { FormProvider, useForm } from "react-hook-form";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReportTableSection } from "@/components/ui/report-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useStaff } from "@/hooks/useStaff";
import { useMonthlyAttendance } from "@/hooks/useAttendance";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function AttendanceReport() {
  const { t } = useTranslation(["reports", "common"]);
  const form = useForm({
    defaultValues: {
      month: new Date(),
    },
  });

  const [filter, setFilter] = useState("");

  // Get selected month and year
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  // Fetch Data
  const { data: staffList, isLoading: isStaffLoading } = useStaff();
  const { data: attendanceDataRaw, isLoading: isAttendanceLoading } =
    useMonthlyAttendance(selectedMonth, selectedYear);

  const isLoading = isStaffLoading || isAttendanceLoading;

  // Process Data
  const reportData = useMemo(() => {
    if (!staffList || !attendanceDataRaw) return [];

    const attendanceMap = new Map(); // staffId -> { day -> status }

    // Map attendance records
    attendanceDataRaw.data.forEach((record) => {
      const date = new Date(record.date);
      const day = date.getDate();
      const staffId = record.staff?._id || record.staff;

      if (!attendanceMap.has(staffId)) {
        attendanceMap.set(staffId, {});
      }
      attendanceMap.get(staffId)[day] = record.status;
    });

    // Create rows for each staff
    return staffList.map((staff) => {
      const staffId = staff._id;
      const staffAttendance = attendanceMap.get(staffId) || {};
      const attendance = Array(31).fill("");

      let totalPresent = 0;
      let totalAbsent = 0;
      let totalHalfDay = 0;

      // Fill days 1-31
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 1; i <= 31; i++) {
        const dayDate = new Date(selectedYear, selectedMonth, i);
        const isFutureDate = dayDate > today;

        const status = staffAttendance[i] || (isFutureDate ? "" : "N");
        let code = "";
        if (status === "Present") code = "P";
        else if (status === "Absent") code = "A";
        else if (status === "Half Day") code = "H";
        else if (status === "N") code = "N";
        else code = status;

        attendance[i - 1] = code;

        if (code === "P") totalPresent++;
        if (code === "A") totalAbsent++;
        if (code === "H") totalHalfDay++;
      }

      return {
        id: staff._id,
        employeeCode: staff.employeeCode,
        employeeName: staff.name,
        position: staff.post,
        attendance,
        totalPresent,
        totalAbsent,
        totalWeighing: 0, // Placeholder
        extra: 0, // Placeholder
        dhutman: 0, // Placeholder
        work: 0, // Placeholder
      };
    });
  }, [staffList, attendanceDataRaw]);

  // Get days in selected month dynamically
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const handleMonthChange = (data) => {
    if (data.month) {
      setSelectedDate(data.month);
    }
  };

  // Filter employees based on search
  const filteredData = useMemo(() => {
    if (!filter) return reportData;
    return reportData.filter(
      (emp) =>
        emp.employeeName.toLowerCase().includes(filter.toLowerCase()) ||
        emp.employeeCode?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, reportData]);

  // Status cell style helper
  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "P":
        return "bg-green-100 text-green-800 font-medium dark:bg-green-900/40 dark:text-green-300";
      case "A":
        return "bg-red-100 text-red-800 font-medium dark:bg-red-900/40 dark:text-red-300";
      case "H":
        return "bg-yellow-100 text-yellow-800 font-medium dark:bg-yellow-900/40 dark:text-yellow-300";
      case "N":
        return "bg-gray-100/50 text-gray-400 font-normal dark:bg-gray-800/30 dark:text-gray-500";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-primary" />
            </div>
            {t("attendance.title", "उपस्थिति रिपोर्ट")}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            मासिक उपस्थिति और कार्य विवरण का व्यापक दृश्य
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-end gap-3 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="कर्मचारी का नाम या कोड..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-10 w-full pl-9 placeholder:text-muted-foreground text-sm"
              />
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(handleMonthChange)}
                className="flex items-end gap-2"
              >
                <div className="w-full sm:w-48">
                  <DatePickerField
                    name="month"
                    placeholder="Pick a month"
                    className="w-full"
                  />
                </div>
                <Button type="submit" size="sm" className="h-10 px-5">
                  {t("common:view", "देखें")}
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>

      {/* Main Report Table */}
      <ReportTableSection
        title="उपस्थिति विवरण सारणी"
        theme="indigo"
        className="shadow-md"
      >
        <div className="overflow-x-auto relative">
          <table className="w-full min-w-max text-sm border-collapse">
            <thead>
              {/* Primary Header Row */}
              <tr className="bg-muted/40 text-left">
                <th
                  rowSpan="2"
                  className="whitespace-nowrap px-1 py-3 font-semibold text-foreground sticky left-0 bg-background/95 backdrop-blur z-30 w-[100px] min-w-[100px] max-w-[100px] shadow-[2px_0_0_0_hsl(var(--border)),2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                >
                  कर्मचारी कोड
                </th>
                <th
                  rowSpan="2"
                  className="px-4 py-3 font-semibold text-foreground border-r border-border/60 min-w-[180px]"
                >
                  कर्मचारी का नाम
                </th>
                <th
                  rowSpan="2"
                  className="px-4 py-3 font-semibold text-foreground border-r border-border/60 min-w-[120px]"
                >
                  पद
                </th>

                {/* Days Header Group */}
                <th
                  colSpan={daysInMonth}
                  className="px-2 py-2 text-center font-semibold text-blue-700 bg-blue-50/50 dark:bg-blue-900/20 dark:text-blue-300 border-r border-border/60"
                >
                  दिन (Days) - {format(selectedDate, "MMMM yyyy")}
                </th>

                {/* Summary Headers */}
                <th
                  rowSpan="2"
                  className="px-2 py-3 text-center text-xs font-semibold text-green-700 bg-green-50/50 dark:bg-green-900/20 dark:text-green-300 border-r border-border/60 min-w-[70px]"
                >
                  कुल उपस्थिति
                </th>
                <th
                  rowSpan="2"
                  className="px-2 py-3 text-center text-xs font-semibold text-red-700 bg-red-50/50 dark:bg-red-900/20 dark:text-red-300 border-r border-border/60 min-w-[70px]"
                >
                  कुल अनुपस्थित
                </th>
                <th
                  rowSpan="2"
                  className="px-2 py-3 text-center text-xs font-semibold text-purple-700 bg-purple-50/50 dark:bg-purple-900/20 dark:text-purple-300 border-r border-border/60 min-w-[80px]"
                >
                  कुल भुगतान योग्य राशि
                </th>
                <th
                  rowSpan="2"
                  className="px-2 py-3 text-center text-xs font-semibold text-orange-700 bg-orange-50/50 dark:bg-orange-900/20 dark:text-orange-300 border-r border-border/60 min-w-[70px]"
                >
                  एडवांस
                </th>
                <th
                  rowSpan="2"
                  className="px-2 py-3 text-center text-xs font-semibold text-amber-700 bg-amber-50/50 dark:bg-amber-900/20 dark:text-amber-300 border-r border-border/60 min-w-[70px]"
                >
                  भुगतान
                </th>
                <th
                  rowSpan="2"
                  className="px-2 py-3 text-center text-xs font-semibold text-teal-700 bg-teal-50/50 dark:bg-teal-900/20 dark:text-teal-300 border-r border-border/60 min-w-[70px]"
                >
                  शेष
                </th>
                <th
                  rowSpan="2"
                  className="px-2 py-3 text-center font-semibold bg-muted/40 min-w-[50px]"
                ></th>
              </tr>

              {/* Secondary Header Row (Day Numbers) */}
              <tr className="bg-muted/20 border-b border-border">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => (
                    <th
                      key={day}
                      className={cn(
                        "px-1 py-1.5 text-center text-xs font-medium text-muted-foreground min-w-[32px] hover:bg-muted/50 transition-colors",
                        "border-r border-border/60"
                      )}
                    >
                      {day}
                    </th>
                  )
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={daysInMonth + 10}
                    className="px-4 py-16 text-center text-muted-foreground border-t border-border/40"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-muted/50 animate-pulse">
                        <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">
                          विवरण लोड किया जा रहा है...
                        </p>
                        <p className="text-sm text-muted-foreground">
                          कृपया प्रतीक्षा करें
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((employee, index) => (
                  <tr
                    key={employee.id}
                    className="group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0"
                  >
                    <td className="px-4 py-2.5 text-xs font-medium text-muted-foreground sticky left-0 bg-background/95 backdrop-blur z-20 w-[100px] min-w-[100px] max-w-[100px] group-hover:bg-muted/10 shadow-[2px_0_0_0_hsl(var(--border)),2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {employee.employeeCode || (
                        <span className="text-muted-foreground/40">-</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-sm font-medium text-foreground border-r border-border/60">
                      {employee.employeeName}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-muted-foreground border-r border-border/60">
                      {employee.position || "-"}
                    </td>

                    {/* Daily Calls */}
                    {employee.attendance
                      .slice(0, daysInMonth)
                      .map((status, dayIndex) => (
                        <td
                          key={dayIndex}
                          className={cn(
                            "px-1 py-1 text-center text-xs font-medium border-r border-border/60 h-10 w-8",
                            getStatusStyle(status)
                          )}
                        >
                          {status}
                        </td>
                      ))}

                    {/* Summary Values */}
                    <td className="px-2 py-2 text-center font-bold text-sm border-r border-border/60 bg-green-50/10 text-green-700 dark:bg-green-900/10 dark:text-green-400">
                      {employee.totalPresent}
                    </td>
                    <td className="px-2 py-2 text-center font-bold text-sm border-r border-border/60 bg-red-50/10 text-red-700 dark:bg-red-900/10 dark:text-red-400">
                      {employee.totalAbsent}
                    </td>
                    <td className="px-2 py-2 text-center font-medium text-sm border-r border-border/60 text-muted-foreground">
                      {employee.totalWeighing}
                    </td>
                    <td className="px-2 py-2 text-center font-medium text-sm border-r border-border/60 text-muted-foreground">
                      {employee.extra}
                    </td>
                    <td className="px-2 py-2 text-center font-medium text-sm border-r border-border/60 text-muted-foreground">
                      {employee.dhutman}
                    </td>
                    <td className="px-2 py-2 text-center font-medium text-sm border-r border-border/60 text-muted-foreground">
                      {employee.work}
                    </td>

                    {/* Actions */}
                    <td className="px-2 py-2 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted data-[state=open]:bg-muted"
                          >
                            <EllipsisHorizontalIcon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              toast.info("Edit functionality coming soon")
                            }
                          >
                            <PencilIcon className="mr-2 h-4 w-4" />
                            {t("common:edit", "Edit")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                /* Empty State when !isLoading && no data */
                <tr>
                  <td
                    colSpan={daysInMonth + 10}
                    className="px-4 py-16 text-center text-muted-foreground border-t border-border/40"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-muted/50">
                        <CalendarIcon className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-foreground">
                          कोई डेटा उपलब्ध नहीं
                        </p>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                          चयनित माह के लिए कोई उपस्थिति रिकॉर्ड नहीं मिला।
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend / Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span>P = उपस्थित (Present)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span>A = अनुपस्थित (Absent)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span>H = आधा दिन (Half Day)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gray-300" />
              <span>N = कोई प्रविष्टि नहीं (No Entry)</span>
            </div>
          </div>
        </div>
      </ReportTableSection>
    </div>
  );
}
