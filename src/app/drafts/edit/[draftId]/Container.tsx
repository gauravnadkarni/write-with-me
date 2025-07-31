'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import DraftContainer from '@/components/drafts/DraftContainer'
import { toast } from '@/hooks/use-toast'
import useAuthStore from '@/lib/store/authStore'
import useDraftStore from '@/lib/store/draftsStore'
import useFolderStore from '@/lib/store/foldersStore'
import useSubscriptionsStore from '@/lib/store/subscriptionsStore'
import useSuggestionStore from '@/lib/store/suggestionsStore'
import { FolderModelWithoutUserIdAndTimestamps } from '@/lib/types/folder-model'
import { getContext } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface ContainerProps {
  user: User
}

const DEFAULT_FOLDER_FETCH_SIZE = 10

export const Container: React.FC<ContainerProps> = ({ user }) => {
  const router = useRouter()
  //const params = useParams();
  //const searchParams = useSearchParams();
  //const draftId: string | Array<string> = params.draftId;
  //const folderId: string | null = searchParams.get("folder") || null;
  const [isScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchFolderValue, setSearchFolderValue] = useState('')
  const {
    signout,
    signOut: { isSignedOut },
  } = useAuthStore((state) => state)
  const {
    currentFolder: currentFolderFromState,
    setCurrentFolder: setCurrentFolderfomState,
    createFolder,
    list: folderListFromState,
    listSuccess: folderListSuccess,
    isListProcessing: isFolderListProcessing,
    isListProcessingForFirstRequest: isFolderListProcessingForFirstRequest,
    deleteFolder,
    listFolders,
    listHasMore: folderListHasMore,
    folderListPage,
    setFolderListPage,
  } = useFolderStore((state) => state)
  const {
    editDraft,
    currentDraft: currentDraftFromState,
    isEditProcessing,
    setCurrentDraft,
    editSuccess,
    resetEditDraft,
  } = useDraftStore((state) => state)
  const {
    currentSuggestions,
    getSuggestions,
    clearCurrentSuggestions,
    isGetProcessing: isLoadingSuggestions,
    getSuccess: getSuggestionsSuccess,
  } = useSuggestionStore((state) => state)
  const {
    getSubscription,
    currentSubscription,
    isGetProcessing: isGetSubscriptionProcessing,
  } = useSubscriptionsStore((state) => state)

  const [isFolderAdding, setIsFolderAdding] = useState(false)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const [title, setTitle] = useState<string>(
    currentDraftFromState ? currentDraftFromState.title : ''
  )
  const [content, setContent] = useState<string>(
    currentDraftFromState ? currentDraftFromState.content : ''
  )
  const suggestionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)

  const setCurrentFolder = (
    folder:
      | (FolderModelWithoutUserIdAndTimestamps & {
          id?: string
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => {
    setCurrentFolderfomState(folder)
    router.push(`/dashboard?folder=${folder?.id || ''}`)
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

  const onClickOfSaveDraft = async (title: string, content: string) => {
    if (!currentDraftFromState || !currentFolderFromState) return
    const currentDraft = { ...currentDraftFromState, title, content }
    setCurrentDraft(currentDraft)
    editDraft(currentDraft, currentFolderFromState)
  }

  const getNewSuggestions = async (content: string) => {
    const context = getContext(content)
    if (context === undefined) return
    getSuggestions(context, currentSubscription)
  }

  useEffect(() => {
    if (editSuccess === true) {
      toast({
        title: 'Success!',
        description: 'Draft was updated successfully.',
        variant: 'default',
      })
      resetEditDraft()
    }
  }, [editSuccess, resetEditDraft])

  useEffect(() => {
    if (isSignedOut) {
      redirect('/auth')
    }
  }, [isSignedOut])

  useEffect(() => {
    listFolders(folderListPage, DEFAULT_FOLDER_FETCH_SIZE, true)
    clearCurrentSuggestions()
  }, [folderListPage, listFolders, clearCurrentSuggestions])

  useEffect(() => {
    if (folderListPage === 1) {
      return
    }
    if (folderListSuccess && !isFolderListProcessingForFirstRequest) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [folderListSuccess, isFolderListProcessingForFirstRequest, folderListPage])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  useEffect(() => {
    if (getSuggestionsSuccess) {
      getSubscription()
    }
  }, [getSuggestionsSuccess, getSubscription])

  const childComponent = (
    <DraftContainer
      title={title}
      content={content}
      setTitle={setTitle}
      setContent={setContent}
      onSave={onClickOfSaveDraft}
      isProcessing={isEditProcessing}
      suggestionTimeoutRef={suggestionTimeoutRef}
      resetSuggestions={clearCurrentSuggestions}
      suggestions={currentSuggestions}
      isLoadingSuggestions={isLoadingSuggestions}
      getNewSuggestions={getNewSuggestions}
      isLoadingApiUsage={isGetSubscriptionProcessing}
      apiUsagePercentage={
        currentSubscription
          ? (currentSubscription.totalCreditRemaining /
              currentSubscription.totalCredit) *
            100
          : 0
      }
      remainingCredit={
        currentSubscription ? currentSubscription.totalCreditRemaining : 0
      }
    />
  )

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
        currentFolder={currentFolderFromState || null}
        folders={filteredFolders}
        isSignedOut={isSignedOut}
        onClickOfSignOut={onClickOfSignout}
        setCurrentFolder={setCurrentFolder}
        user={user}
        setFolder={addFolder}
        showAddButton={false}
        onClickOfAdd={() => {}}
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
        onClickOfAddDrafts={() => {}}
        isCreateDraftOpen={false}
        setIsCreateDraftOpen={() => {}}
        newDraftTitle={title}
        setNewDraftTitle={() => {}}
        showDraftControls={false}
      >
        {childComponent}
      </DashboardLayout>
    </>
  )
}
