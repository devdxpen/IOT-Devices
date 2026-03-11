import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  // Logic to calculate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t border-neutral-200">
      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-neutral-500">Show</p>
        <Select
          value={pageSize.toString()}
          onValueChange={(val) => onPageSizeChange(Number(val))}
        >
          <SelectTrigger className="h-8 w-[70px] bg-white border-neutral-200 text-neutral-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium text-neutral-500">of {totalItems}</p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 pl-2.5 text-neutral-600 bg-white border-neutral-200 hover:bg-neutral-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <div
              key={`ellipsis-${index}`}
              className="h-8 w-8 flex items-center justify-center text-neutral-400"
            >
              <MoreHorizontal className="h-4 w-4" />
            </div>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className={`h-8 w-8 ${
                currentPage === page
                  ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500"
                  : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 pr-2.5 text-neutral-600 bg-white border-neutral-200 hover:bg-neutral-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
