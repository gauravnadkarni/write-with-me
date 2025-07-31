import { DraftDragItem, ItemTypes } from '@/lib/types/dnd-types'
import { FolderModelWithoutUserIdAndTimestamps } from '@/lib/types/folder-model'
import { useMemo } from 'react'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import Spinner from '../Spinner'
import { Folder, FolderOpen, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const DropEnabledFolder = ({
  folder,
  handleMoveDraft,
  moveDraftToFolder,
  selectedFolder,
  onSelectFolder,
  onDelete,
}: {
  folder: FolderModelWithoutUserIdAndTimestamps & {
    id?: string
    isProcessing: boolean
    isErrored: boolean
  }
  handleMoveDraft: (
    draftId: string,
    sourceFolderId: string | null,
    targetFolderId: string
  ) => void
  moveDraftToFolder: (draftId: string, folderId: string) => void
  selectedFolder:
    | (FolderModelWithoutUserIdAndTimestamps & {
        isProcessing: boolean
        isErrored: boolean
      })
    | null
  onSelectFolder: (
    folder:
      | (FolderModelWithoutUserIdAndTimestamps & {
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => void
  onDelete: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      id?: string
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
}) => {
  const dropSpec = useMemo(
    () => ({
      accept: ItemTypes.DRAFT,
      drop: (item: DraftDragItem) => {
        if (folder.id && item.draftId) {
          handleMoveDraft(item.draftId, item.folderId, folder.id)
          // Store function for optimistic updates
          if (folder.id) {
            moveDraftToFolder(item.draftId, folder.id)
          }
        }
        return { moved: true }
      },
      canDrop: (item: DraftDragItem) => {
        // Cannot drop if this is already the draft's folder or folder is processing
        return (
          item.folderId !== folder.id &&
          !folder.isProcessing &&
          !folder.isErrored
        )
      },
      collect: (monitor: DropTargetMonitor<DraftDragItem>) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [folder, handleMoveDraft, moveDraftToFolder]
  )
  const [{ isOver, canDrop }, drop] = useDrop(dropSpec)

  return (
    <div
      ref={(node: HTMLDivElement | null) => {
        if (node) {
          drop(node)
        }
      }}
      className={cn(
        'relative flex gap-2 rounded m-1 transition-all duration-200',
        selectedFolder?.id === folder.id &&
          'bg-primary text-primary-foreground',
        selectedFolder?.id !== folder.id && 'hover:bg-accent/50',
        isOver && canDrop && 'ring-2 ring-primary bg-primary/10 scale-105',
        isOver && !canDrop && 'ring-2 ring-destructive bg-destructive/10'
      )}
      key={folder.id}
      role="droppable"
      aria-label={`Drop here to move to ${folder.title}`}
    >
      {folder.isProcessing && (
        <div className="absolute rounded inset-0 w-full h-full flex justify-center items-center z-[9999] bg-green-50 opacity-40">
          <Spinner />
        </div>
      )}
      <button
        key={folder.id || folder.title}
        disabled={folder.isProcessing || folder.isErrored}
        className={cn(
          'flex justify-between w-full hover:bg-transparent p-2',
          selectedFolder?.id === folder.id && 'font-bold',
          folder.isErrored && 'bg-red-400'
        )}
        onClick={() => {
          if (!folder.isProcessing) {
            onSelectFolder(folder)
          }
        }}
      >
        <div className="flex items-center gap-2">
          {folder.id === selectedFolder?.id ? (
            <FolderOpen
              className={`h-4 w-4 ${
                selectedFolder?.id === folder.id
                  ? 'text-primary-foreground'
                  : 'text-primary/70'
              }`}
            />
          ) : (
            <Folder
              className={`h-4 w-4 ${
                selectedFolder?.id === folder.id
                  ? 'text-primary-foreground'
                  : 'text-primary/70'
              }`}
            />
          )}
          <span className="text-sm">{folder.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              selectedFolder?.id === folder.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {'draftCount' in folder ? <>{folder.draftCount}</> : '0'}
          </span>
          {!folder.isProcessing && !folder.isUncategorizedFolder && (
            <div
              className="h-6 w-6 hover:bg-accent/90 rounded flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(folder)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
