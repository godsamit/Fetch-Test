import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import { useNavigate, useSearchParams,useNavigation } from "@remix-run/react";
import { cn } from "~/lib/utils";
import type { DogsSearchResponse } from "~/utils/types";
import { DEFAULT_PAGE_SIZE } from "~/utils/constants";

export const DogListPagination = ({ 
  dogSearchMeta
} : {
  dogSearchMeta: DogsSearchResponse, 

}) => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  // Get current page config
  const [searchParams] = useSearchParams();
  const pageSize = searchParams.get("size") ? parseInt(searchParams.get("size")!) : DEFAULT_PAGE_SIZE;
  const from = searchParams.get("from") ? parseInt(searchParams.get("from")!) : 0;
  const currentPage = Math.floor(from / pageSize) + 1;
  const totalPages = Math.ceil(dogSearchMeta.total / pageSize);

  // Always diaplay 5 pages around the current page
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

  // handle page change
  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (page === 1) {
      newSearchParams.delete("from");
    } else {
      newSearchParams.set("from", ((page - 1) * pageSize).toString());
    }
    navigate(`?${newSearchParams.toString()}`, { replace: true });
  }

  
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
              onClick={() => handlePageChange(currentPage - 1)} 
            />
          </PaginationItem>
        }

        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageChange(page)}
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
              <PaginationLink onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {currentPage < totalPages &&
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)} 
            />
          </PaginationItem>
        }
      </PaginationContent>
    </Pagination>
  )
} 