import { useState, useMemo, useCallback, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  RowSelectionState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ChevronUp, ChevronDown, Search } from "lucide-react";
import { Character, HealthStatus } from "@/types/character";
import { filterCharacters, sortCharacters } from "@/lib/tableUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HealthFilter } from "@/components/HealthFilter";
import { cn } from "@/lib/utils";

interface CharacterTableProps {
  data: Character[];
}

const columnHelper = createColumnHelper<Character>();

export function CharacterTable({ data }: CharacterTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [healthFilters, setHealthFilters] = useState<Set<HealthStatus>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [viewedRows, setViewedRows] = useState<Set<string>>(new Set());

  const tableContainerRef = useRef<HTMLDivElement>(null);

  //ideally we should fetch data from backend after each filter or sortOrder applied but as our data is not paginated, we are simply doing this.
  const processedData = useMemo(() => {
    const filtered = filterCharacters(data, searchQuery, healthFilters);
    return sortCharacters(filtered, sortOrder);
  }, [data, searchQuery, healthFilters, sortOrder]);

  const handleSortToggle = useCallback(() => {
    setSortOrder((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  }, []);

  const handleMarkViewed = useCallback(() => {
    const selectedIds = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => processedData[parseInt(index)].id);

    console.log("Marking as viewed:", selectedIds);
    
    setViewedRows((prev) => {
      const newViewed = new Set(prev);
      selectedIds.forEach((id) => newViewed.add(id));
      return newViewed;
    });

    setRowSelection({});
  }, [rowSelection, processedData]);

  const handleMarkUnviewed = useCallback(() => {
    const selectedIds = Object.keys(rowSelection)
      .filter((key) => rowSelection[key])
      .map((index) => processedData[parseInt(index)].id);

    console.log("Marking as unviewed:", selectedIds);
    
    setViewedRows((prev) => {
      const newViewed = new Set(prev);
      selectedIds.forEach((id) => newViewed.delete(id));
      return newViewed;
    });

    setRowSelection({});
  }, [rowSelection, processedData]);

  const getHealthColor = (health: HealthStatus) => {
    switch (health) {
      case "Healthy":
        return "text-[hsl(var(--health-healthy))]";
      case "Injured":
        return "text-[hsl(var(--health-injured))]";
      case "Critical":
        return "text-[hsl(var(--health-critical))]";
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center px-1">
            <Checkbox
              checked={table.getIsAllRowsSelected()}
              onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
              aria-label="Select all rows"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center px-1">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={`Select row ${row.index + 1}`}
            />
          </div>
        ),
        size: 50,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="font-medium">{info.getValue()}</div>
        ),
        size: 200,
      }),
      columnHelper.accessor("location", {
        header: "Location",
        cell: (info) => info.getValue(),
        size: 120,
      }),
      columnHelper.accessor("health", {
        header: () => (
          <div className="flex items-center gap-2">
            <span>Health</span>
            <HealthFilter
              selectedFilters={healthFilters}
              onFilterChange={setHealthFilters}
            />
          </div>
        ),
        cell: (info) => (
          <div className={cn("font-medium", getHealthColor(info.getValue()))}>
            {info.getValue()}
          </div>
        ),
        size: 140,
      }),
      columnHelper.accessor("power", {
        header: () => (
          <div className="flex items-center gap-2">
            <span>Power</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleSortToggle}
              aria-label={`Sort by power ${sortOrder === "asc" ? "descending" : sortOrder === "desc" ? "unsorted" : "ascending"}`}
            >
              {sortOrder === "asc" ? (
                <ChevronUp className="h-4 w-4" />
              ) : sortOrder === "desc" ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <div className="flex flex-col">
                  <ChevronUp className="h-3 w-3 -mb-1 opacity-50" />
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </div>
              )}
            </Button>
          </div>
        ),
        cell: (info) => (
          <div className="font-mono">{info.getValue().toLocaleString()}</div>
        ),
        size: 140,
      }),
    ],
    [healthFilters, sortOrder, handleSortToggle]
  );

  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 45,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search characters"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleMarkViewed}
            disabled={selectedCount === 0}
            aria-label={`Mark ${selectedCount} selected row${selectedCount !== 1 ? 's' : ''} as viewed`}
          >
            Mark as Viewed ({selectedCount})
          </Button>
          <Button
            onClick={handleMarkUnviewed}
            variant="secondary"
            disabled={selectedCount === 0}
            aria-label={`Mark ${selectedCount} selected row${selectedCount !== 1 ? 's' : ''} as unviewed`}
          >
            Mark as Unviewed ({selectedCount})
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="text-sm text-muted-foreground">
        Showing {processedData.length} of {data.length} characters
        {healthFilters.size > 0 && ` · Filtered by: ${Array.from(healthFilters).join(", ")}`}
        {sortOrder && ` · Sorted by power (${sortOrder})`}
      </div>

      {/* Table */}
      <div
        ref={tableContainerRef}
        className="border rounded-lg overflow-auto"
        style={{ height: "600px" }}
        role="region"
        aria-label="Character data table"
      >
        <table className="w-full border-collapse" role="table">
          <thead className="bg-[hsl(var(--table-header))] text-[hsl(var(--table-header-foreground))] sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} role="row">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left p-3 font-semibold border-b border-[hsl(var(--table-border))]"
                    style={{ width: header.getSize() }}
                    role="columnheader"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody role="rowgroup">
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const isViewed = viewedRows.has(row.original.id);
              
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "border-b border-[hsl(var(--table-border))] hover:bg-[hsl(var(--table-row-hover))] transition-colors",
                    row.getIsSelected() && "bg-[hsl(var(--table-row-selected))]",
                    isViewed && "opacity-60"
                  )}
                  role="row"
                  aria-selected={row.getIsSelected()}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="p-3"
                      style={{ width: cell.column.getSize() }}
                      role="cell"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
