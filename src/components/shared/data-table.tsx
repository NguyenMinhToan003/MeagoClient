'use client';

import { tableFeatures, useTable, type ColumnDef, type RowData } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const features = tableFeatures({});

export type DataTableColumn<TData extends RowData> = ColumnDef<typeof features, TData, unknown>;

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumn<TData>[];
  data: TData[];
  emptyMessage: string;
  getRowId?: (row: TData) => string;
}

/** Typed renderer for the common, non-virtualized table case. Domain code owns its columns and data fetching. */
export function DataTable<TData extends RowData>({ columns, data, emptyMessage, getRowId }: DataTableProps<TData>) {
  const table = useTable({ features, columns, data, getRowId });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id}><table.FlexRender cell={cell} /></TableCell>
            ))}
          </TableRow>
        )) : (
          <TableRow><TableCell colSpan={columns.length} className="h-24 text-center">{emptyMessage}</TableCell></TableRow>
        )}
      </TableBody>
    </Table>
  );
}
