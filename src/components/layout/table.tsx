import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Plus, SearchIcon, Trash2 } from "lucide-react";
import useDebounce from "../functions/searchDelay";
import { Can } from "../functions/can";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Checkbox } from "../ui/checkbox";

type Props<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  title: string;
  onClick: () => void;
  textButton: string;
  setSearch: Dispatch<SetStateAction<string>>;
  permissionAdd: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  page: number;
  setPage: (page: number) => void;
  isSearching?: boolean;

  getRowId?: (row: T) => string;
  onBulkDelete?: (ids: string[]) => Promise<void> | void;
  onBulkActivate?: (ids: string[], active: boolean) => Promise<void> | void;
};

export default function Table<T>({
  data = [],
  columns,
  pagination,
  page,
  setPage,
  title,
  onClick,
  textButton,
  setSearch,
  permissionAdd,
  isSearching = false,
  getRowId,
  onBulkDelete,
  onBulkActivate,
}: Props<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isBulkActing, setIsBulkActing] = useState(false);

  const enableSelection = !!getRowId && (!!onBulkDelete || !!onBulkActivate);

  const tableColumns = useMemo(() => {
    if (!enableSelection) return columns;
    const selectionColumn: ColumnDef<T> = {
      id: "__select__",
      size: 5,
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected()
              ? true
              : table.getIsSomePageRowsSelected()
                ? "indeterminate"
                : false
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(value === true)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(value === true)}
          aria-label="Select row"
        />
      ),
    };
    return [selectionColumn, ...columns];
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
  });

  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 400);

  useEffect(() => {
    setSearch(debounceQuery);
  }, [debounceQuery, setSearch]);

  useEffect(() => {
    setRowSelection({});
  }, [page, data]);

  const selectedIds = Object.keys(rowSelection).filter(
    (id) => rowSelection[id],
  );

  const runBulk = async (action: () => Promise<void> | void) => {
    setIsBulkActing(true);
    try {
      await action();
      setRowSelection({});
    } finally {
      setIsBulkActing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <div className=" flex justify-between">
          <h1 className="text-2xl font-bold capitalize">{title}</h1>
          <Can permission={permissionAdd}>
            <Button onClick={onClick} variant="default">
              <Plus />
              {textButton}
            </Button>
          </Can>
        </div>
        <Field className="w-fit">
          <InputGroup>
            <InputGroupInput
              id="inline-end-input"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <InputGroupAddon align="inline-start">
              {isSearching && query.length > 0 ? (
                <Spinner />
              ) : (
                <SearchIcon />
              )}
            </InputGroupAddon>
            {query.length > 0 && (
              <InputGroupAddon
                align="inline-end"
                className="cursor-pointer"
                onClick={() => {
                  setQuery("");
                  setSearch("");
                }}
              >
                ×
              </InputGroupAddon>
            )}
          </InputGroup>
        </Field>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
          <span className="text-sm font-medium text-foreground">
            {selectedIds.length} selected
          </span>
          <div className="ml-auto flex gap-2">
            {onBulkActivate && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isBulkActing}
                  onClick={() =>
                    runBulk(() => onBulkActivate(selectedIds, true))
                  }
                >
                  Activate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isBulkActing}
                  onClick={() =>
                    runBulk(() => onBulkActivate(selectedIds, false))
                  }
                >
                  Deactivate
                </Button>
              </>
            )}
            {onBulkDelete && (
              <Button
                size="sm"
                variant="destructive"
                disabled={isBulkActing}
                onClick={() => runBulk(() => onBulkDelete(selectedIds))}
              >
                <Trash2 />
                Delete selected
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              disabled={isBulkActing}
              onClick={() => setRowSelection({})}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="max-h-[500px] w-full overflow-x-auto overflow-y-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full animate-in fade-in-0 slide-in-from-bottom-2 overflow-auto text-sm duration-300">
          <thead className="sticky top-0 z-10 bg-muted text-muted-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-4 py-3 text-left text-xs font-semibold tracking-wide uppercase"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                data-selected={row.getIsSelected()}
                className="animate-in fade-in-0 slide-in-from-bottom-1 fill-mode-both transition-colors duration-300 hover:bg-muted/40 data-[selected=true]:bg-primary/5"
                style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-foreground">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={tableColumns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No search results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-2">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(page - 1)}
                className={
                  !pagination?.hasPreviousPage
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            {!pagination?.hasNextPage && pagination.totalPages > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(page - 2)}>
                  {pagination?.currentPage - 2}
                </PaginationLink>
              </PaginationItem>
            )}
            {pagination?.currentPage !== 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(page - 1)}>
                  {pagination?.currentPage - 1}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {pagination?.currentPage}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              {pagination?.hasNextPage && (
                <PaginationLink onClick={() => setPage(page + 1)}>
                  {pagination?.currentPage + 1}
                </PaginationLink>
              )}
            </PaginationItem>
            {!pagination?.hasPreviousPage && pagination.totalPages > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => setPage(page + 2)}>
                  {pagination?.currentPage + 2}
                </PaginationLink>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(page + 1)}
                className={
                  !pagination?.hasNextPage
                    ? "pointer-events-none opacity-40"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
