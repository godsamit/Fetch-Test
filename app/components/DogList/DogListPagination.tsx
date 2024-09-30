import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import { useNavigation } from "@remix-run/react";
import { cn } from "~/lib/utils";

export const DogListPagination = ({ 
  totalPages, 
  currentPage, 
  onPageChange 
} : {
  totalPages: number, 
  currentPage: number, 
  onPageChange: (page: number) => void
}) => {
  const pageWindow = 5;

  const halfWindow = Math.floor(pageWindow / 2);

  let startPage = Math.max(1, currentPage - halfWindow);
  let endPage = Math.min(totalPages, currentPage + halfWindow);

  if (currentPage <= halfWindow) {
    endPage = Math.min(totalPages, pageWindow);
  } else if (currentPage + halfWindow >= totalPages) {
    startPage = Math.max(1, totalPages - pageWindow + 1);
  }

  const pages = new Array(endPage - startPage + 1)
    .fill(0)
    .map((_, i) => startPage + i);

  const navigation = useNavigation();
  
  return (
    <Pagination 
      className={cn(
        "mt-auto flex-shrink-0",
        navigation.state === "loading" && "opacity-50 pointer-events-none"
      )}
    >
      <PaginationContent>
        {currentPage > 1 &&
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)} 
            />
          </PaginationItem>
        }

        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <PaginationEllipsis />}
            <PaginationItem >
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {currentPage < totalPages &&
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)} 
            />
          </PaginationItem>
        }
      </PaginationContent>
    </Pagination>
  )
} 