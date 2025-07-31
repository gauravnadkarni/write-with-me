'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { getEditor } from '@/components/drafts/DraftContainer'
import { DraftListWithPagination } from '@/components/drafts/DraftList'
import Spinner from '@/components/Spinner'
import { toast } from '@/hooks/use-toast'
import useAuthStore from '@/lib/store/authStore'
import useDraftStore from '@/lib/store/draftsStore'
import useFolderStore from '@/lib/store/foldersStore'
import { FolderModelWithoutUserIdAndTimestamps } from '@/lib/types/folder-model'
import { SortOptions } from '@/lib/types/sort'
import {
  cleanString,
  convertUtcDateTimeToLocal,
  exportToMarkdown,
} from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import { ArrowDown, ArrowUp, SortAsc, SortDesc } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface ContainerProps {
  user: User
}

const DEFAULT_FOLDER_FETCH_SIZE = 10

const DEFAULT_DRAFT_FETCH_SIZE = 5

export const Container: React.FC<ContainerProps> = ({ user }) => {
  const router = useRouter()
  const [isScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchFolderValue, setSearchFolderValue] = useState('')
  const [isCreateDraftOpen, setIsCreateDraftOpen] = useState(false)
  const [newDraftTitle, setNewDraftTitle] = useState('')
  const [isFolderAdding, setIsFolderAdding] = useState(false)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const searchQueryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const {
    signout,
    signOut: { isSignedOut },
  } = useAuthStore((state) => state)
  const {
    currentFolder,
    setCurrentFolder,
    createFolder,
    list: folderListFromState,
    listFolders,
    listSuccess: folderListSuccess,
    isListProcessing: isFolderListProcessing,
    isListProcessingForFirstRequest: isFolderListProcessingForFirstRequest,
    deleteFolder,
    isDeleteProcessing: isFolderDeleteProcessing,
    deleteError: folderDeleteError,
    listHasMore: folderListHasMore,
    folderListPage,
    setFolderListPage,
  } = useFolderStore((state) => state)
  const {
    listDrafts,
    list: draftListFromState,
    isListProcessing: isDraftListProcessing,
    deleteDraft,
    deleteSuccess: deleteDraftSuccess,
    setCurrentDraft,
    listSuccess: draftListSuccess,
    totalListPages: totalDraftListPages,
    listPage: draftListPage,
    setListPage: setDraftListPage,
    currentSortOption,
    searchQuery,
    setSearchQuery,
    setCurrentSortOption,
  } = useDraftStore((state) => state)

  const getSortIcon = (option: SortOptions) => {
    if (currentSortOption !== option) {
      return null
    }
    switch (option) {
      case SortOptions.NEWEST_FIRST:
        return <ArrowDown className="h-4 w-4 ml-2" />
      case SortOptions.OLDEST_FIRST:
        return <ArrowUp className="h-4 w-4 ml-2" />
      case SortOptions.TITLE_ASC:
        return <SortAsc className="h-4 w-4 ml-2" />
      case SortOptions.TITLE_DESC:
        return <SortDesc className="h-4 w-4 ml-2" />
    }
  }

  const addFolder = (title: string) => {
    const id = `#$$${name}`
    const newFolder = {
      id,
      title,
      description: 'NA',
      color: '#ffffff',
      isProcessing: true,
      isErrored: false,
      isUncategorizedFolder: false,
    }
    createFolder(newFolder)
  }

  const onFolderDelete = (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      id?: string
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    deleteFolder(folder)
  }

  const onClickOfSignout = () => {
    signout()
  }

  const onClickOfAddDrafts = () => {
    setCurrentDraft(null)
    router.push(
      `/drafts/add?folder=${currentFolder?.id || ''}&title=${newDraftTitle}`
    )
  }

  const onClickOfDeleteDraft = (draftId: string) => {
    const draftToBeDeleted = draftListFromState.find(
      (draft) => draft.id === draftId
    )
    if (!draftToBeDeleted) {
      return
    }
    deleteDraft(draftToBeDeleted)
  }

  const onClickOfEditDraft = (draftId: string) => {
    const selectedDraft = draftListFromState.find(
      (draft) => draft.id === draftId
    )
    if (!selectedDraft) {
      return
    }
    setCurrentDraft(selectedDraft)
    router.push(`/drafts/edit/${draftId}?folder=${currentFolder?.id || ''}`)
  }

  const onClickOfExportDraft = (draftId: string) => {
    const selectedDraft = draftListFromState.find(
      (draft) => draft.id === draftId
    )
    if (!selectedDraft) {
      return
    }
    const editor = getEditor(selectedDraft.content, undefined)
    exportToMarkdown(editor!)
  }

  useEffect(() => {
    if (!currentFolder) return
    router.push(`/dashboard?folder=${currentFolder.id}`)
    listDrafts(currentFolder.id, 1, DEFAULT_DRAFT_FETCH_SIZE)
  }, [currentFolder, listDrafts, router])

  useEffect(() => {
    if (folderListPage === 1) {
      listFolders(folderListPage, DEFAULT_FOLDER_FETCH_SIZE, true)
    } else {
      listFolders(folderListPage, DEFAULT_FOLDER_FETCH_SIZE, false)
    }
  }, [folderListPage, listFolders])

  useEffect(() => {
    if (folderListSuccess && !currentFolder) {
      if (folderListFromState.length > 0) {
        setCurrentFolder(folderListFromState[0])
      }
    }
  }, [folderListSuccess, currentFolder, setCurrentFolder, folderListFromState])

  useEffect(() => {
    if (!currentFolder) {
      return
    }
    if (searchQueryTimeoutRef.current) {
      clearTimeout(searchQueryTimeoutRef.current)
    }
    searchQueryTimeoutRef.current = setTimeout(() => {
      if (!currentFolder) {
        return
      }
      listDrafts(currentFolder.id, 1, DEFAULT_DRAFT_FETCH_SIZE)
    }, 2000)
    return () => {
      if (searchQueryTimeoutRef.current) {
        clearTimeout(searchQueryTimeoutRef.current)
      }
    }
  }, [searchQuery, listDrafts, currentFolder])

  /*
  useEffect(() => {
    if (!currentFolder) return
    listDrafts(currentFolder.id, 1, DEFAULT_DRAFT_FETCH_SIZE)
  }, [currentFolder, listDrafts])
*/
  useEffect(() => {
    if (isFolderDeleteProcessing === false && folderDeleteError) {
      toast({
        title: 'Failure!',
        description: folderDeleteError,
        variant: 'destructive',
      })
    }
  }, [isFolderDeleteProcessing, folderDeleteError])

  useEffect(() => {
    if (!deleteDraftSuccess) {
      return
    }
    toast({
      title: 'Success!',
      description: 'Draft deleted successfully',
    })
    if (folderListPage === 1) {
      listFolders(folderListPage, DEFAULT_FOLDER_FETCH_SIZE, true)
    } else {
      listFolders(folderListPage, DEFAULT_FOLDER_FETCH_SIZE, false)
    }
  }, [folderListPage, listFolders, deleteDraftSuccess])

  useEffect(() => {
    if (isSignedOut) {
      redirect('/auth')
    }
  }, [isSignedOut])

  useEffect(() => {
    if (folderListPage === 1) {
      return
    }
    if (folderListSuccess && !isFolderListProcessingForFirstRequest) {
      const viewportElement = scrollRef.current?.querySelector(
        '[data-radix-scroll-area-viewport]'
      )
      if (viewportElement) {
        ;(viewportElement as HTMLDivElement).scrollTo({
          top: (viewportElement as HTMLDivElement).scrollHeight,
          behavior: 'smooth',
        })
      }
    }
  }, [folderListSuccess, isFolderListProcessingForFirstRequest, folderListPage])

  useEffect(() => {
    if (!currentFolder) {
      return
    }
    listDrafts(currentFolder.id, 1, DEFAULT_DRAFT_FETCH_SIZE)
  }, [currentSortOption, listDrafts, currentFolder])

  const filteredFolders = folderListFromState.filter((folder) => {
    if (!searchFolderValue) {
      return true
    }
    return folder.title.toLowerCase().includes(searchFolderValue.toLowerCase())
  })

  return (
    <>
      <DashboardLayout
        showFooterLinks={false}
        currentFolder={currentFolder || null}
        folders={filteredFolders}
        isSignedOut={isSignedOut}
        onClickOfSignOut={onClickOfSignout}
        setCurrentFolder={setCurrentFolder}
        user={user}
        setFolder={addFolder}
        showAddButton
        onClickOfAdd={onClickOfAddDrafts}
        isFolderAdding={isFolderAdding}
        newFolderName={newFolderName}
        setIsFolderAdding={setIsFolderAdding}
        setNewFolderName={setNewFolderName}
        isFolderListProcessing={isFolderListProcessing}
        isFolderListProcessingForFirstRequest={
          isFolderListProcessingForFirstRequest
        }
        onFolderDelete={onFolderDelete}
        onClickOfUpgrade={() => {
          router.push('/upgrade')
        }}
        folderListHasMore={folderListHasMore}
        folderListSize={DEFAULT_FOLDER_FETCH_SIZE}
        folderListPage={folderListPage}
        setFolderListPage={setFolderListPage}
        scrollRef={scrollRef}
        isPageScrolled={isScrolled}
        isMobileViewOpen={isMobileMenuOpen}
        setIsMobileViewOpen={setIsMobileMenuOpen}
        navLinks={[]}
        searchFolderValue={searchFolderValue}
        setSearchFolderValue={setSearchFolderValue}
        onClickOfAddDrafts={onClickOfAddDrafts}
        isCreateDraftOpen={isCreateDraftOpen}
        setIsCreateDraftOpen={setIsCreateDraftOpen}
        newDraftTitle={newDraftTitle}
        setNewDraftTitle={setNewDraftTitle}
        showDraftControls
        getSortIcon={getSortIcon}
        currentSortOption={currentSortOption}
        onSortChange={setCurrentSortOption}
        onSearchChange={setSearchQuery}
        handleClearSearch={() => setSearchQuery('')}
        searchQuery={searchQuery}
      >
        {isDraftListProcessing && (
          <div className="relative pt-8">
            <div className="absolute inset-0 w-full h-full flex justify-center items-center z-[9999] opacity-40">
              <Spinner rootClasses={['text-primary']} />
            </div>
          </div>
        )}
        {!isDraftListProcessing && (
          <DraftListWithPagination
            isEmpty={draftListSuccess && draftListFromState.length === 0}
            drafts={draftListFromState.map((draft) => ({
              ...draft,
              content: cleanString(draft.content),
              createdAt: convertUtcDateTimeToLocal(
                draft.createdAt,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                'MMM d, yyyy - h:mm a'
              ),
              updatedAt: convertUtcDateTimeToLocal(
                draft.updatedAt,
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                'MMM d, yyyy - h:mm a'
              ),
              onClickOfDelete: () => {
                onClickOfDeleteDraft(draft.id)
              },
              onClickOfEdit: () => {
                onClickOfEditDraft(draft.id)
              },
              onClickOfDownload: () => {
                onClickOfExportDraft(draft.id)
              },
            }))}
            onPageChange={(page: number) => {
              setDraftListPage(page)
              if (!currentFolder) return
              listDrafts(currentFolder.id, page, DEFAULT_DRAFT_FETCH_SIZE)
            }}
            page={draftListPage}
            size={DEFAULT_DRAFT_FETCH_SIZE}
            totalPages={totalDraftListPages}
            isVisible={draftListFromState.length > 0}
            showControlsOnTop={false}
          />
        )}
      </DashboardLayout>
    </>
  )
}
