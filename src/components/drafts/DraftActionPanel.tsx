import { SortOptions } from '@/lib/types/sort'
import { ArrowUpDown, FolderOpenIcon, Search, X } from 'lucide-react'
import { DialogBox } from '../Dialog'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Input } from '../ui/input'

export interface DraftActionPanelProps {
  name: string
  draftsCount: number
  searchQuery?: string
  onSearchChange?: (query: string) => void
  handleClearSearch?: () => void
  currentSortOption?: SortOptions
  onSortChange?: (sort: SortOptions) => void
  getSortIcon?: (sort: SortOptions) => React.ReactNode
  handleCreateDraft: () => void
  isCreateDraftOpen: boolean
  setIsCreateDraftOpen: (open: boolean) => void
  newDraftTitle: string
  setNewDraftTitle: (title: string) => void
  showDraftControls: boolean
}

export const DraftActionPanel: React.FC<DraftActionPanelProps> = ({
  name,
  searchQuery,
  onSearchChange,
  handleClearSearch,
  onSortChange,
  getSortIcon,
  handleCreateDraft,
  isCreateDraftOpen,
  setIsCreateDraftOpen,
  newDraftTitle,
  setNewDraftTitle,
  showDraftControls,
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <FolderOpenIcon className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground/90 text-lg">{name}</h2>
        {/*<span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {draftsCount} drafts
        </span>*/}
      </div>
      {showDraftControls && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search drafts..."
              value={searchQuery}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              className="pl-9 pr-8 w-full sm:w-[200px] md:w-[250px]"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  onSortChange && onSortChange(SortOptions.NEWEST_FIRST)
                }
                className="flex justify-between"
              >
                <span>Newest First</span>
                {getSortIcon && getSortIcon(SortOptions.NEWEST_FIRST)}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onSortChange && onSortChange(SortOptions.OLDEST_FIRST)
                }
                className="flex justify-between"
              >
                <span>Oldest First</span>
                {getSortIcon && getSortIcon(SortOptions.OLDEST_FIRST)}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onSortChange && onSortChange(SortOptions.TITLE_ASC)
                }
                className="flex justify-between"
              >
                <span>Title (A-Z)</span>
                {getSortIcon && getSortIcon(SortOptions.TITLE_ASC)}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onSortChange && onSortChange(SortOptions.TITLE_DESC)
                }
                className="flex justify-between"
              >
                <span>Title (Z-A)</span>
                {getSortIcon && getSortIcon(SortOptions.TITLE_DESC)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DialogBox
            isOpen={isCreateDraftOpen}
            onOpenChange={setIsCreateDraftOpen}
            title="Create New Draft"
            description="Enter a title for your new draft"
            content={
              <Input
                placeholder="Draft title"
                value={newDraftTitle}
                onChange={(e) => setNewDraftTitle(e.target.value)}
              />
            }
            footer={
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewDraftTitle('')
                    setIsCreateDraftOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateDraft}>Create Draft</Button>
              </>
            }
          />
        </div>
      )}
    </>
  )
}
