import * as React from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Filter as FilterIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import TablePagination from "@/components/ui/table-pagination"
import { cn } from "@/lib/utils"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

/**
 * Filter component for individual column filtering
 */
function Filter({ column }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta || {}
    const columnHeader = typeof column.columnDef.header === 'string' ? column.columnDef.header : ''

    const sortedUniqueValues = React.useMemo(() => {
        if (filterVariant === 'dropdown') {
            const values = Array.from(column.getFacetedUniqueValues().keys())
            return Array.from(new Set(values)).sort()
        }
        return []
    }, [column.getFacetedUniqueValues(), filterVariant])

    // Dropdown variant
    if (filterVariant === 'dropdown') {
        return (
            <div className="space-y-1.5">
                <Label className="text-xs md:text-sm font-medium">{columnHeader}</Label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-between h-9"
                        >
                            <span className={cn(columnFilterValue ? "" : "text-muted-foreground", "truncate text-xs md:text-sm")}>
                                {columnFilterValue ? String(columnFilterValue) : `Filter`}
                            </span>
                            <ChevronDown className="ml-2 h-3 w-3 md:h-4 md:w-4 shrink-0 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-44 max-h-[300px] overflow-y-auto">
                        {sortedUniqueValues.map(value => (
                            <DropdownMenuItem
                                key={String(value)}
                                onClick={() => column.setFilterValue(value)}
                            >
                                {String(value)}
                            </DropdownMenuItem>
                        ))}
                        {columnFilterValue && (
                            <>
                                <div className="h-px bg-border my-1" />
                                <DropdownMenuItem
                                    className="text-muted-foreground"
                                    onClick={() => column.setFilterValue(undefined)}
                                >
                                    Clear Filter
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        )
    }

    // Default text filter
    return (
        <div className="space-y-1.5">
            <Label className="text-xs md:text-sm font-medium">{columnHeader}</Label>
            <div className="relative">
                <Input
                    className="pl-9 pr-3 h-9 text-sm"
                    value={columnFilterValue ?? ''}
                    onChange={e => column.setFilterValue(e.target.value)}
                    placeholder={`Search...`}
                    type="text"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>
        </div>
    )
}

export function DataTable({
    columns,
    data,
    showFilters = true,
}) {
    const [sorting, setSorting] = React.useState([])
    const [columnFilters, setColumnFilters] = React.useState([])
    const [filtersOpen, setFiltersOpen] = React.useState(false)
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
    })

    const filterableColumns = table.getAllColumns()
        .filter(column => column.getCanFilter() && column.columnDef.meta?.filterVariant)

    const hasActiveFilters = columnFilters.length > 0

    return (
        <div className="w-full space-y-3 md:space-y-4">
            {/* Filters Section - Collapsible on mobile */}
            {showFilters && filterableColumns.length > 0 && (
                <>
                    {/* Mobile: Collapsible filters */}
                    <div className="md:hidden">
                        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-between"
                                >
                                    <span className="flex items-center gap-2">
                                        <FilterIcon className="h-4 w-4" />
                                        Filters
                                        {hasActiveFilters && (
                                            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                                                {columnFilters.length}
                                            </span>
                                        )}
                                    </span>
                                    <ChevronDown className={cn(
                                        "h-4 w-4 transition-transform",
                                        filtersOpen && "rotate-180"
                                    )} />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-3">
                                <div className="grid grid-cols-2 gap-3">
                                    {filterableColumns.map(column => (
                                        <div key={column.id}>
                                            <Filter column={column} />
                                        </div>
                                    ))}
                                </div>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-3 w-full text-muted-foreground"
                                        onClick={() => setColumnFilters([])}
                                    >
                                        Clear all filters
                                    </Button>
                                )}
                            </CollapsibleContent>
                        </Collapsible>
                    </div>

                    {/* Desktop: Inline filters */}
                    <div className="hidden md:flex flex-wrap gap-3">
                        {filterableColumns.map(column => (
                            <div key={column.id} className="w-44">
                                <Filter column={column} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Table with horizontal scroll on mobile */}
            <div className="rounded-lg border border-border shadow-sm w-full max-w-full overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <Table className="min-w-[600px] w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="bg-muted/70">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead
                                                key={header.id}
                                                className="px-3 md:px-4 py-3 whitespace-nowrap text-xs md:text-sm"
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={
                                                            header.column.getCanSort()
                                                                ? "flex items-center gap-1.5 cursor-pointer select-none"
                                                                : ""
                                                        }
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                        {header.column.getCanSort() && (
                                                            <span className="text-muted-foreground">
                                                                {{
                                                                    asc: <ChevronUp className="h-3.5 w-3.5" />,
                                                                    desc: <ChevronDown className="h-3.5 w-3.5" />,
                                                                }[header.column.getIsSorted()] ?? (
                                                                        <ChevronsUpDown className="h-3.5 w-3.5" />
                                                                    )}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </TableHead>
                                        )
                                    })}
                                </tr>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-accent/50 transition-colors"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="empty-state py-8 md:py-12">
                                            <p className="empty-state-title text-sm md:text-base">No results found</p>
                                            <p className="empty-state-desc text-xs md:text-sm">
                                                Try adjusting your search to find what you're looking for
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
