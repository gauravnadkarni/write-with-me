import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  size: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  isVisible: boolean
  showControlsOnTop: boolean
}

export function withPagination<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function PaginationWrapper(props: T & PaginationProps) {
    const {
      page: currentPage,
      totalPages,
      onPageChange,
      isVisible,
      showControlsOnTop,
      ...restProps
    } = props

    const renderPaginationItems = () => {
      const items = []

      // First page button (using text since PaginationFirst isn't available)
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            onClick={() => currentPage !== 1 && onPageChange(1)}
            isActive={false}
            className={
              currentPage === 1
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      )

      // Previous button
      items.push(
        <PaginationItem key="prev">
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
            title="Previous page"
          />
        </PaginationItem>
      )

      // First page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={currentPage === 1}
            className={
              currentPage === 1
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
          >
            1
          </PaginationLink>
        </PaginationItem>
      )

      // Render leading ellipsis if needed
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="start-ellipsis" className="cursor-default">
            <span className="px-4">...</span>
          </PaginationItem>
        )
      }

      // Pages around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      // Don't repeat page 1
      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => onPageChange(i)}
                isActive={i === currentPage}
                className={
                  i === currentPage
                    ? 'opacity-50 pointer-events-none'
                    : 'cursor-pointer'
                }
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          )
        }
      }

      // Render trailing ellipsis if needed
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="end-ellipsis" className="cursor-default">
            <span className="px-4">...</span>
          </PaginationItem>
        )
      }

      // Last page (only if totalPages > 1)
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => onPageChange(totalPages)}
              isActive={currentPage === totalPages}
              className={
                currentPage === totalPages
                  ? 'opacity-50 pointer-events-none'
                  : 'cursor-pointer'
              }
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )
      }

      // Next button
      items.push(
        <PaginationItem key="next">
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
            title="Next page"
          />
        </PaginationItem>
      )

      // Last page button (using text since PaginationLast isn't available)
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            onClick={() =>
              currentPage !== totalPages && onPageChange(totalPages)
            }
            isActive={false}
            className={
              currentPage === totalPages
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer'
            }
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationLink>
        </PaginationItem>
      )

      return items
    }

    const PaginationComponent = (
      <Pagination>
        <PaginationContent>{renderPaginationItems()}</PaginationContent>
      </Pagination>
    )

    return (
      <div>
        {isVisible && showControlsOnTop && PaginationComponent}
        <div className="my-5">
          <WrappedComponent {...(restProps as T)} />
        </div>
        {isVisible && PaginationComponent}
      </div>
    )
  }
}
