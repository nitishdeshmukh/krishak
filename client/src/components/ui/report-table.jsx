import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

/**
 * ReportTable - Specialized table component for report pages
 *
 * Features:
 * - Multi-row headers with colspan/rowspan support
 * - Section-based color coding
 * - Sticky first column(s)
 * - Horizontal scroll for wide tables
 * - Custom cell formatting
 *
 * @param {Object} props
 * @param {Array} props.headerGroups - Array of header row configurations
 * @param {Array} props.columns - Column definitions with styling
 * @param {Array} props.data - Data rows
 * @param {number} props.stickyColumns - Number of columns to make sticky (default: 1)
 * @param {React.ReactNode} props.emptyState - Component to show when no data
 * @param {string} props.className - Additional table classes
 */
export function ReportTable({
  headerGroups = [],
  columns = [],
  data = [],
  stickyColumns = 1,
  emptyState,
  className,
  ...props
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className={cn("w-full min-w-max text-sm", className)} {...props}>
          {/* Multi-row headers */}
          <thead>
            {headerGroups.map((group, groupIndex) => (
              <TableRow
                key={groupIndex}
                className={cn(
                  group.className,
                  groupIndex === 0 ? "bg-muted/50" : "bg-muted/70"
                )}
              >
                {group.headers.map((header, headerIndex) => (
                  <TableHead
                    key={headerIndex}
                    colSpan={header.colSpan}
                    rowSpan={header.rowSpan}
                    className={cn(
                      "px-3 py-2.5 text-left text-sm font-medium text-muted-foreground border-r border-border last:border-r-0",
                      // Sticky column styling
                      headerIndex < stickyColumns &&
                        "sticky left-0 z-20 bg-muted/50",
                      headerIndex === 1 &&
                        stickyColumns === 2 &&
                        "left-[150px]", // Adjust based on first column width
                      // Section colors
                      header.sectionColor,
                      header.className
                    )}
                  >
                    {header.label}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </thead>

          {/* Table body */}
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="hover:bg-accent/30 transition-colors border-b border-border/50 last:border-0"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        "px-3 py-2.5 text-sm border-r border-border last:border-r-0",
                        // Sticky column styling
                        colIndex < stickyColumns &&
                          "sticky left-0 z-10 bg-card font-medium",
                        colIndex === 1 && stickyColumns === 2 && "left-[150px]",
                        // Column-specific styling
                        column.cellClassName,
                        // Apply section colors to cells
                        column.sectionColor
                      )}
                    >
                      {column.render
                        ? column.render(row[column.accessor], row, rowIndex)
                        : row[column.accessor] ?? "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyState || (
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-base font-medium">
                        कोई डेटा उपलब्ध नहीं
                      </p>
                      <p className="text-sm">कोई रिकॉर्ड नहीं मिला</p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * ReportTableSection - Styled section header for reports
 */
export function ReportTableSection({ title, theme = "blue", children }) {
  const themeColors = {
    blue: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-100",
    green:
      "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 text-green-900 dark:text-green-100",
    purple:
      "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-100",
    orange:
      "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 text-orange-900 dark:text-orange-100",
    red: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 text-red-900 dark:text-red-100",
    amber:
      "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-100",
    teal: "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900 text-teal-900 dark:text-teal-100",
    indigo:
      "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-100",
    pink: "bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-900 text-pink-900 dark:text-pink-100",
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      <div
        className={cn(
          "px-4 py-2.5 border-b",
          themeColors[theme] || themeColors.blue
        )}
      >
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

/**
 * Section color helper classes for headers and cells
 */
export const sectionColors = {
  blue: {
    header: "bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100",
    cell: "bg-blue-50/20 dark:bg-blue-950/10",
  },
  green: {
    header:
      "bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100",
    cell: "bg-green-50/20 dark:bg-green-950/10",
  },
  purple: {
    header:
      "bg-purple-50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-100",
    cell: "bg-purple-50/20 dark:bg-purple-950/10",
  },
  orange: {
    header:
      "bg-orange-50 dark:bg-orange-950/30 text-orange-900 dark:text-orange-100",
    cell: "bg-orange-50/20 dark:bg-orange-950/10",
  },
  red: {
    header: "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100",
    cell: "bg-red-50/20 dark:bg-red-950/10",
  },
  amber: {
    header:
      "bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100",
    cell: "bg-amber-50/20 dark:bg-amber-950/10",
  },
  teal: {
    header: "bg-teal-50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-100",
    cell: "bg-teal-50/20 dark:bg-teal-950/10",
  },
};

export default ReportTable;
