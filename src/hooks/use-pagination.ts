import { useMemo } from "react";

interface UsePaginationProps {
  offset: number;
  limit: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onOffsetChange: (newOffset: number) => void;
}

export function usePagination({
  offset,
  limit,
  totalCount,
  hasNext,
  hasPrevious,
  onOffsetChange,
}: UsePaginationProps) {
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  function handleNext() {
    if (hasNext) onOffsetChange(offset + limit);
  }

  function handlePrevious() {
    if (hasPrevious) onOffsetChange(Math.max(0, offset - limit));
  }

  function handlePageClick(pageNumber: number) {
    onOffsetChange((pageNumber - 1) * limit);
  }

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "ellipsis-end"];
    }

    if (currentPage >= totalPages - 2) {
      return ["ellipsis-start", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return ["ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end"];
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    pageNumbers,
    handleNext,
    handlePrevious,
    handlePageClick,
    hasNext,
    hasPrevious,
  };
}
