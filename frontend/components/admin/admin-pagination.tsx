"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "…")[] = [];
  pages.push(1);

  let start = Math.max(2, currentPage - 1);
  let end = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 3) {
    start = 2;
    end = 4;
  } else if (currentPage >= totalPages - 2) {
    start = totalPages - 3;
    end = totalPages - 1;
  }

  if (start > 2) {
    pages.push("…");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("…");
  }

  pages.push(totalPages);

  return pages;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className = "",
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 ${className}`}
    >
      <p className="text-sm text-muted-foreground">
        หน้า <strong>{currentPage}</strong> จาก <strong>{totalPages}</strong>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {/* First page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-9 px-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="หน้าแรก"
        >
          «
        </button>

        {/* Previous page */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-9 flex items-center gap-1 px-3 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          ก่อน
        </button>

        {/* Page numbers */}
        {pageNumbers.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 text-sm text-muted-foreground select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p as number)}
              className={`min-w-[36px] h-9 px-2 rounded-lg border text-sm font-medium transition-colors ${
                currentPage === p
                  ? "border-[#4E0707] bg-[#4E0707] text-white"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next page */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-9 flex items-center gap-1 px-3 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ถัดไป
          <ChevronRight size={14} />
        </button>

        {/* Last page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-9 px-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="หน้าสุดท้าย"
        >
          »
        </button>
      </div>
    </div>
  );
}
