import { FolderListWithInfiniteScroll } from '@/components/dashboard/FolderList'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { FolderModelWithoutUserIdAndTimestamps } from '@/lib/types/folder-model'
import { User } from '@supabase/supabase-js'
import { DraftActionPanel } from '../drafts/DraftActionPanel'
import { Separator } from '../ui/separator'
import { SortOptions } from '@/lib/types/sort'

interface ContainerProps {
  user: User
  onClickOfSignOut: (e: React.MouseEvent) => void
  onClickOfUpgrade: (e: React.MouseEvent) => void
  isSignedOut: boolean
  folders: Array<
    FolderModelWithoutUserIdAndTimestamps & {
      id?: string
      isProcessing: boolean
      isErrored: boolean
    }
  >
  setFolder: (name: string) => void
  currentFolder:
    | (FolderModelWithoutUserIdAndTimestamps & {
        isProcessing: boolean
        isErrored: boolean
      })
    | null
  setCurrentFolder: (
    name:
      | (FolderModelWithoutUserIdAndTimestamps & {
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => void
  showFooterLinks: boolean
  showAddButton: boolean
  onClickOfAdd: (e: React.MouseEvent) => void
  isFolderAdding: boolean
  setIsFolderAdding: (isAdding: boolean) => void
  newFolderName: string
  setNewFolderName: (folderName: string) => void
  isFolderListProcessing: boolean
  isFolderListProcessingForFirstRequest: boolean
  onFolderDelete: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      id?: string
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  folderListHasMore: boolean
  folderListSize: number
  folderListPage: number
  setFolderListPage: (page: number) => void
  scrollRef: React.RefObject<HTMLDivElement>
  isPageScrolled: boolean
  isMobileViewOpen: boolean
  setIsMobileViewOpen: (isOpen: boolean) => void
  navLinks: Array<{ name: string; href: string }>
  searchFolderValue: string
  setSearchFolderValue: (value: string) => void
  onClickOfAddDrafts: () => void
  isCreateDraftOpen: boolean
  setIsCreateDraftOpen: (open: boolean) => void
  newDraftTitle: string
  setNewDraftTitle: (title: string) => void
  showDraftControls: boolean
  currentSortOption?: SortOptions
  onSortChange?: (sort: SortOptions) => void
  getSortIcon?: (sort: SortOptions) => React.ReactNode
  searchQuery?: string
  onSearchChange?: (query: string) => void
  handleClearSearch?: () => void
}

export const DashboardLayout: React.FC<
  ContainerProps & React.PropsWithChildren
> = ({
  user,
  currentFolder,
  folders,
  onClickOfSignOut,
  setCurrentFolder,
  setFolder,
  showFooterLinks,
  isFolderAdding,
  setIsFolderAdding,
  newFolderName,
  setNewFolderName,
  isFolderListProcessing,
  isFolderListProcessingForFirstRequest,
  onFolderDelete,
  onClickOfUpgrade,
  folderListHasMore,
  folderListSize,
  folderListPage,
  setFolderListPage,
  scrollRef,
  isPageScrolled,
  isMobileViewOpen,
  setIsMobileViewOpen,
  navLinks,
  searchFolderValue,
  setSearchFolderValue,
  onClickOfAddDrafts,
  isCreateDraftOpen,
  setIsCreateDraftOpen,
  newDraftTitle,
  setNewDraftTitle,
  showDraftControls,
  onSortChange,
  getSortIcon,
  currentSortOption,
  onSearchChange,
  handleClearSearch,
  searchQuery,
  children,
}) => {
  return (
    <>
      <Header
        isSignedIn={user ? true : false}
        onClickOfSignOut={onClickOfSignOut}
        showLinks={false}
        onClickOfUpgrade={onClickOfUpgrade}
        isPageScrolled={isPageScrolled}
        isMobileViewOpen={isMobileViewOpen}
        setIsMobileViewOpen={setIsMobileViewOpen}
        navLinks={navLinks}
        showSignedInButton={false}
        showGetStartedButton={false}
        showBorder
      />
      <div className="min-h-[calc(100vh-7rem)] bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-12 gap-6">
            <aside className="col-span-12 md:col-span-3 space-y-6">
              <FolderListWithInfiniteScroll
                folders={folders}
                selectedFolder={currentFolder}
                onSelectFolder={setCurrentFolder}
                onAddFolder={setFolder}
                isFolderAdding={isFolderAdding}
                setIsFolderAdding={setIsFolderAdding}
                newFolderName={newFolderName}
                setNewFolderName={setNewFolderName}
                isProcessing={isFolderListProcessing}
                isProcessingForFirstRequest={
                  isFolderListProcessingForFirstRequest
                }
                onDelete={onFolderDelete}
                searchFolderValue={searchFolderValue}
                setSearchFolderValue={setSearchFolderValue}
                hasMore={folderListHasMore}
                size={folderListSize}
                page={folderListPage}
                setPage={setFolderListPage}
                scrollRef={scrollRef}
              />
            </aside>
            <div className="col-span-12 md:col-span-9 space-y-6">
              <div className="bg-card rounded-xl border border-border/40 p-5 space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <DraftActionPanel
                    name={currentFolder?.title || 'Uncategorized'}
                    draftsCount={
                      currentFolder && 'draftCount' in currentFolder
                        ? (currentFolder.draftCount as number)
                        : 0
                    }
                    handleCreateDraft={onClickOfAddDrafts}
                    isCreateDraftOpen={isCreateDraftOpen}
                    setIsCreateDraftOpen={setIsCreateDraftOpen}
                    newDraftTitle={newDraftTitle}
                    setNewDraftTitle={setNewDraftTitle}
                    showDraftControls={showDraftControls}
                    getSortIcon={getSortIcon}
                    currentSortOption={currentSortOption}
                    onSortChange={onSortChange}
                    onSearchChange={onSearchChange}
                    handleClearSearch={handleClearSearch}
                    searchQuery={searchQuery}
                  />
                </div>
                <Separator />
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer showLinks={showFooterLinks} />
    </>
  )
}
