"use client";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CommitteeType, UserRole } from "@prisma/client";
import { committeeType, userRole } from "./data/data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string[];
  onRoleFilterChange: (value: string[]) => void;
  committeeFilter: string[];
  onCommitteeFilterChange: (value: string[]) => void;
}

export function DataTableToolbar<TData>({
  table,
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  committeeFilter,
  onCommitteeFilterChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    roleFilter.length > 0 || committeeFilter.length > 0 || search !== "";

  const handleReset = () => {
    onSearchChange("");
    onRoleFilterChange([]);
    onCommitteeFilterChange([]);
    table.resetColumnFilters();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col flex-1 items-start space-y-2">
        <Input
          placeholder="Search using name or email..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex flex-1 flex-wrap gap-2">
          {table.getColumn("userRole") && (
            <DataTableFacetedFilter
              value={roleFilter}
              onValueChange={onRoleFilterChange}
              title="Role"
              options={userRole}
            />
          )}
          {table.getColumn("committeeType") && (
            <DataTableFacetedFilter
              value={committeeFilter}
              onValueChange={onCommitteeFilterChange}
              title="Committee"
              options={committeeType}
            />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
