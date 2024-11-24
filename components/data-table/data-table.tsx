"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserTable } from "@/hooks/use-user-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect } from "react";
import { columns } from "./verified-columns";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Loader2 } from "lucide-react";
import { TableData } from "@/types/user-types";

const DataTable = ({ tab }: { tab: "general" | "pending" }) => {
  const {
    data,
    isLoading,
    pagination,
    setPagination,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    committeeFilter,
    setCommitteeFilter,
    setStatusFilter,
  } = useUserTable();

  useEffect(() => {
    setStatusFilter(tab === "general" ? "VERIFIED" : "PENDING");
  }, [setStatusFilter, tab]);

  const table = useReactTable({
    data: (data?.users as TableData[]) || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={setSearch}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        committeeFilter={committeeFilter}
        onCommitteeFilterChange={setCommitteeFilter}
      />
      <div className="rounded-md border">
        {!isLoading ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="h-24 w-full flex justify-center items-center">
            <Loader2 className="w-10 h-10 animate-spin mr-2" />
            <span className="font-semibold text-lg">Loading...</span>
          </div>
        )}
      </div>
      <DataTablePagination
        table={table}
        pageCount={data?.totalPages || 1}
        totalRecords={data?.total || 0}
      />
    </div>
  );
};

export default DataTable;
