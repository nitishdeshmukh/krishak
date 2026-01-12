"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  createBulkAttendance,
  fetchAttendanceByDate,
  fetchAttendanceReport,
  deleteAttendance,
} from "../api/attendanceApi";

export const useAttendance = () => {
  const { pageIndex, pageSize, columnFilters, sorting } = useSelector(
    (state) => state.table
  );
  const page = pageIndex + 1;

  // Transform columnFilters to simple object if needed, or pass as is
  // Assuming backend takes simple query params handled by API function

  const query = useQuery({
    queryKey: ["attendance", page, pageSize, columnFilters, sorting],
    queryFn: () => {
      const filters = {};
      if (Array.isArray(columnFilters)) {
        columnFilters.forEach((f) => {
          if (f.id === "date") filters.fromDate = f.value; // Treating text filter as From Date for now
          if (f.id === "staff.name") filters.staffName = f.value;
          if (f.id === "status") filters.status = f.value;
        });
      }
      return fetchAttendanceReport({ page, pageSize, ...filters });
    },
    keepPreviousData: true,
    staleTime: 30000,
  });

  return {
    ...query,
    attendance: query.data?.data || [],
    totalRecords: query.data?.pagination?.totalRecords || 0,
    totalPages: query.data?.pagination?.totalPages || 0,
    currentPage: query.data?.pagination?.currentPage || 1,
    // hasNext/hasPrev logic not explicitly returned by backend snippet I wrote, but can derive
    hasNext:
      (query.data?.pagination?.currentPage || 1) <
      (query.data?.pagination?.totalPages || 0),
    hasPrev: (query.data?.pagination?.currentPage || 1) > 1,
  };
};

export const useAttendanceByDate = (date) => {
  return useQuery({
    queryKey: ["attendance", "byDate", date],
    queryFn: () => fetchAttendanceByDate(date),
    enabled: !!date,
  });
};

export const useMonthlyAttendance = (month, year) => {
  return useQuery({
    queryKey: ["attendance", "monthly", month, year],
    queryFn: () => {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0); // Last day of month
      return fetchAttendanceReport({
        fromDate: startDate.toISOString(),
        toDate: endDate.toISOString(),
        pageSize: 2000,
        page: 1,
      });
    },
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};

export const useCreateBulkAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBulkAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export default useAttendance;
