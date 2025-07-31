import Spinner from '../Spinner'
import { Button } from '../ui/button'

interface InfiniteScrollProps {
  hasMore: boolean
  size: number
  page: number
  setPage: (page: number) => void
  isProcessing: boolean
  scrollRef?: React.RefObject<HTMLDivElement>
}

export function withInfiniteLoader<T extends object>(
  WrappedComponent: React.ComponentType<
    T & { scrollRef?: React.RefObject<HTMLDivElement> }
  >
) {
  return function InfiniteLoaderComponent(props: T & InfiniteScrollProps) {
    const { hasMore, page, setPage, isProcessing, scrollRef, ...restProps } =
      props
    const handleLoadMore = async () => {
      if (hasMore) {
        setPage(page + 1)
      }
    }

    return (
      <>
        <div className="h-full overflow-y-auto border-b">
          <WrappedComponent {...(restProps as T)} scrollRef={scrollRef} />
          {
            <div className="flex justify-center py-4">
              <Button
                onClick={handleLoadMore}
                className="bg-primary text-foreground px-4 py-2 rounded-md hover:bg-primary-foreground w-full"
                disabled={!hasMore || isProcessing}
              >
                {isProcessing ? (
                  <Spinner />
                ) : hasMore ? (
                  'Load More'
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          }
        </div>
        <div className="h-2 w-full bg-background md:bg-transparent"></div>
      </>
    )
  }
}
