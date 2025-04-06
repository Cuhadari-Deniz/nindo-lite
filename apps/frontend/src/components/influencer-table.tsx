"use client";
import type { Table as TableType } from "@tanstack/table-core";
import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NumberFormatter, PercentFormatter } from "@/lib/utils";
import { useState } from "react";
import { DataTableColumnHeader } from "./ui/data-table/column-header";

export type InfluencerData = {
  name: string;
  followerCount: number;
  avgWatchtime: number;
  avgImpressionsPerMonth: number;
};

const createColumn = createColumnHelper<InfluencerData>();

const columns = [
  createColumn.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    filterFn: "includesString",
  }),
  createColumn.accessor("followerCount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Followers" />
    ),
    cell: ({ getValue }) => NumberFormatter.format(Number(getValue())),
    filterFn: "inNumberRange",
  }),
  createColumn.accessor("avgWatchtime", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="avgWatchtime" />
    ),
    cell: ({ getValue }) => PercentFormatter.format(Number(getValue())),
    filterFn: "inNumberRange",
  }),
  createColumn.accessor("avgImpressionsPerMonth", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="avg. Impressions / Month" />
    ),
    cell: ({ getValue }) => NumberFormatter.format(Number(getValue())),
    filterFn: "inNumberRange",
  }),
];

export const useInfluencerTable = (data: InfluencerData[]) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return table;
};

export function InfluencerDataTable({
  table,
}: {
  table: TableType<InfluencerData>;
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
