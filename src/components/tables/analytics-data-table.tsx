"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
}

interface RowActionItem<T> {
  label: string;
  onClick?: (row: T) => void;
  destructive?: boolean;
}

interface AnalyticsDataTableProps<T extends { id: string }> {
  rows: T[];
  columns: TableColumn<T>[];
  rowActions?: (row: T) => RowActionItem<T>[];
  emptyText?: string;
}

export function AnalyticsDataTable<T extends { id: string }>({
  rows,
  columns,
  rowActions,
  emptyText = "No records found for the selected filters.",
}: AnalyticsDataTableProps<T>) {
  if (!rows.length) {
    return (
      <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/70">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
            {rowActions && (
              <TableHead className="w-[72px] text-right">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell
                  key={`${row.id}-${column.key}`}
                  className={column.className}
                >
                  {column.render(row)}
                </TableCell>
              ))}
              {rowActions && (
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Open row menu"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8}>
                      {rowActions(row).map((item) => (
                        <DropdownMenuItem
                          key={item.label}
                          className={
                            item.destructive
                              ? "text-error focus:text-error"
                              : ""
                          }
                          onClick={() => item.onClick?.(row)}
                        >
                          {item.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
