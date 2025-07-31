import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { editDraftServerAction } from '@/lib/actions/drafts'
import useDraftsStore from '@/lib/store/draftsStore'
import { FolderModelWithoutUserIdAndTimestamps } from '@/lib/types/folder-model'
import { Search } from 'lucide-react'
import React from 'react'
import { DialogBox } from '../Dialog'
import { withInfiniteLoader } from '../hoc/withInfiniteLoader'
import Spinner from '../Spinner'
import { ScrollArea } from '../ui/scroll-area'
import { DropEnabledFolder } from './DropEnabledFolder'

interface FolderListProps {
  folders: Array<
    FolderModelWithoutUserIdAndTimestamps & {
      id?: string
      isProcessing: boolean
      isErrored: boolean
    }
  >
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
  onAddFolder: (name: string) => void
  isFolderAdding: boolean
  setIsFolderAdding: (isAdding: boolean) => void
  newFolderName: string | undefined
  setNewFolderName: (folderName: string) => void
  isProcessing: boolean
  isProcessingForFirstRequest: boolean
  onDelete: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      id?: string
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  scrollRef?: React.RefObject<HTMLDivElement>
  searchFolderValue: string
  setSearchFolderValue: (value: string) => void
}

const FolderListComponent: React.FC<FolderListProps> = ({
  folders,
  selectedFolder,
  onSelectFolder,
  onAddFolder,
  isFolderAdding,
  setIsFolderAdding,
  newFolderName,
  setNewFolderName,
  isProcessing,
  isProcessingForFirstRequest,
  scrollRef,
  onDelete,
  searchFolderValue,
  setSearchFolderValue,
}: FolderListProps) => {
  const { toast } = useToast()
  const { listDrafts: draftsListRefresh, moveDraftToFolder } = useDraftsStore(
    (state) => ({
      listDrafts: state.listDrafts,
      moveDraftToFolder: state.moveDraftToFolder,
    })
  )

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFolderName) {
      onAddFolder(newFolderName.trim())
      setNewFolderName('')
      setIsFolderAdding(false)
    }
  }

  const handleMoveDraft = async (
    draftId: string,
    sourceFolderId: string | null,
    targetFolderId: string
  ) => {
    // Don't do anything if source and target folders are the same
    if (sourceFolderId === targetFolderId) return

    try {
      // Call the API to move the draft
      const response = await editDraftServerAction({
        id: draftId,
        title: '', // These fields will be filled in by the server
        content: '', // using the existing draft data
        folderId: targetFolderId,
      })

      if ('error' in response) {
        throw new Error(response.error)
      }

      // Refresh drafts list in current folder
      if (selectedFolder?.id) {
        draftsListRefresh(selectedFolder.id)
      }

      toast({
        title: 'Draft moved successfully',
        description: 'The draft has been moved to the new folder',
        variant: 'default',
      })
    } catch (error) {
      console.error('Error moving draft:', error)
      toast({
        title: 'Failed to move draft',
        description: 'There was an error moving the draft',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="bg-card rounded-xl border border-border/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground/90 text-lg">Folders</h2>
        <DialogBox
          isOpen={isFolderAdding}
          onOpenChange={setIsFolderAdding}
          title="Create New Folder"
          description="Enter a name for your new folder"
          content={
            <Input
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          }
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setIsFolderAdding(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddFolder}>Create Folder</Button>
            </>
          }
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search folders..."
          className="pl-9"
          value={searchFolderValue}
          onChange={(e) => setSearchFolderValue(e.target.value)}
        />
      </div>
      <ScrollArea ref={scrollRef} className="space-y-1 h-96 flex flex-col">
        {!isProcessing &&
          folders.map((folder) => {
            return (
              <DropEnabledFolder
                key={folder.id}
                folder={folder}
                handleMoveDraft={handleMoveDraft}
                moveDraftToFolder={moveDraftToFolder}
                selectedFolder={selectedFolder}
                onSelectFolder={onSelectFolder}
                onDelete={onDelete}
              />
            )
          })}
        {isProcessingForFirstRequest && (
          <div className="relative pt-8">
            <div className="absolute inset-0 w-full h-full flex justify-center items-center z-[9999] bg-green-50 opacity-40">
              <Spinner />
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

FolderListComponent.displayName = 'FolderList'
export const FolderList = FolderListComponent
export const FolderListWithInfiniteScroll = withInfiniteLoader(FolderList)
