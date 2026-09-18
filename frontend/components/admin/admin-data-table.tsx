"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { AdminPagination } from "./admin-pagination";

export interface ColumnDef<T> {
  header: ReactNode;
  mobileLabel?: string;
  cell: (row: T, index: number) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  hideOnMobileCard?: boolean;
}

export interface ServerPaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export interface AdminDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T, index: number) => string | number;
  idExtractor?: (row: T, index: number) => string | number;
  isLoading?: boolean;
  emptyMessage?: string | ReactNode;
  emptyIcon?: ReactNode;
  topRightAction?: (row: T, index: number) => ReactNode;
  bottomAction?: (row: T, index: number) => ReactNode;
  labelWidth?: string;
  minTableWidth?: string;

  // Pagination props
  pagination?: boolean;
  pageSize?: number;
  serverPagination?: ServerPaginationProps;
}

export function AdminDataTable<T>({
  data,
  columns,
  keyExtractor,
  idExtractor,
  isLoading = false,
  emptyMessage = "ไม่พบข้อมูลในระบบ",
  emptyIcon,
  topRightAction,
  bottomAction,
  labelWidth = "95px",
  minTableWidth = "min-w-[900px]",
  pagination = true,
  pageSize = 8,
  serverPagination,
}: AdminDataTableProps<T>) {
  const [internalPage, setInternalPage] = useState(1);

  // Reset internal page when dataset changes
  useEffect(() => {
    setInternalPage(1);
  }, [data.length]);

  const isServerPaged = Boolean(serverPagination);
  const totalPages = isServerPaged
    ? serverPagination!.totalPages
    : Math.max(1, Math.ceil(data.length / pageSize));
  const effectivePage = isServerPaged
    ? serverPagination!.page
    : Math.min(internalPage, totalPages);
  const totalItems = isServerPaged ? serverPagination!.totalItems : data.length;

  const handlePageChange = (newPage: number) => {
    if (isServerPaged) {
      serverPagination!.onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  // Slice items for client-side pagination
  const displayData =
    isServerPaged || !pagination
      ? data
      : data.slice((effectivePage - 1) * pageSize, effectivePage * pageSize);

  const getAlignClass = (align?: "left" | "center" | "right") => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className={`w-full ${minTableWidth} text-sm table-fixed`}>
            <thead className="border-b border-border bg-muted/40">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3 font-semibold text-foreground ${getAlignClass(
                      col.align,
                    )} ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td
                      colSpan={columns.length}
                      className="px-4 py-4 text-center"
                    >
                      <div className="h-5 w-full rounded bg-muted" />
                    </td>
                  </tr>
                ))
              ) : displayData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      {emptyIcon}
                      <div>{emptyMessage}</div>
                    </div>
                  </td>
                </tr>
              ) : (
                displayData.map((row, localIdx) => {
                  const globalIdx =
                    isServerPaged || !pagination
                      ? localIdx
                      : (effectivePage - 1) * pageSize + localIdx;

                  return (
                    <tr
                      key={keyExtractor(row, globalIdx)}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className={`px-4 py-3.5 ${getAlignClass(col.align)} ${
                            col.className ?? ""
                          }`}
                        >
                          {col.cell(row, globalIdx)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Responsive Cards View */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-border bg-card p-4 shadow-sm animate-pulse"
            />
          ))
        ) : displayData.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card py-12 text-center text-sm text-muted-foreground">
            <div className="flex flex-col items-center justify-center gap-2">
              {emptyIcon}
              <div>{emptyMessage}</div>
            </div>
          </div>
        ) : (
          displayData.map((row, localIdx) => {
            const globalIdx =
              isServerPaged || !pagination
                ? localIdx
                : (effectivePage - 1) * pageSize + localIdx;

            const rowId = idExtractor
              ? idExtractor(row, globalIdx)
              : keyExtractor(row, globalIdx);

            return (
              <div
                key={keyExtractor(row, globalIdx)}
                className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-3 transition-colors"
              >
                {/* Header: ID and action icons */}
                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                  <span className="text-sm font-bold text-foreground tracking-tight">
                    Id :{" "}
                    <span className="text-muted-foreground font-semibold">
                      #{rowId}
                    </span>
                  </span>
                  {topRightAction && (
                    <div className="flex items-center gap-1.5">
                      {topRightAction(row, globalIdx)}
                    </div>
                  )}
                </div>

                {/* Content rows with vertically aligned colons */}
                <div className="space-y-2 text-xs">
                  {columns
                    .filter((col) => !col.hideOnMobileCard)
                    .map((col, colIdx) => {
                      const label =
                        col.mobileLabel ??
                        (typeof col.header === "string" ? col.header : "");

                      return (
                        <div
                          key={colIdx}
                          className="grid items-center"
                          style={{
                            gridTemplateColumns: `${labelWidth} 12px 1fr`,
                          }}
                        >
                          <span className="text-muted-foreground font-medium">
                            {label}
                          </span>
                          <span className="text-muted-foreground font-semibold">
                            :
                          </span>
                          <div className="min-w-0 font-medium text-foreground">
                            {col.cell(row, globalIdx)}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Bottom action button */}
                {bottomAction && (
                  <div className="pt-0.5">{bottomAction(row, globalIdx)}</div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && totalPages > 1 && (
        <AdminPagination
          currentPage={effectivePage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
