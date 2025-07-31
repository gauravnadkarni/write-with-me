'use client'

import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { useToast } from '@/hooks/use-toast'
import useAuthStore from '@/lib/store/authStore'
import useDraftStore from '@/lib/store/draftsStore'
import useFolderStore from '@/lib/store/foldersStore'
import useSuggestionStore from '@/lib/store/suggestionsStore'
import { FolderModelWithoutUserIdAndTimestamps } from '@/lib/types/folder-model'
import { getContext } from '@/lib/utils'
import { User } from '@supabase/supabase-js'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import DraftContainer from '../../../components/drafts/DraftContainer'
import useSubscriptionsStore from '@/lib/store/subscriptionsStore'

interface ContainerProps {
  user: User
}

const DEFAULT_FOLDER_FETCH_SIZE = 10

export const Container: React.FC<ContainerProps> = ({ user }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const newDraftTitle = searchParams.get('title')
  //const params = useParams();
  const { toast } = useToast()
  const [isScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchFolderValue, setSearchFolderValue] = useState('')
  //const searchParams = useSearchParams();
  //const slug = params.slug;
  //const folderId = searchParams.get("folder") || null;
  const {
    signout,
    signOut: { isSignedOut },
  } = useAuthStore((state) => state)
  const {
    currentFolder: currentFolderFromState,
    setCurrentFolder: setCurrentFolderfomState,
    createFolder,
    list: folderListFromState,
    listFolders,
    listSuccess: folderListSuccess,
    isListProcessing: isFolderListProcessing,
    isListProcessingForFirstRequest: isFolderListProcessingForFirstRequest,
    deleteFolder,
    listHasMore: folderListHasMore,
    folderListPage,
    setFolderListPage,
  } = useFolderStore((state) => state)
  const {
    createDraft,
    isCreateProcessing,
    createSuccess,
    currentDraft,
    resetCreateDraft,
  } = useDraftStore((state) => state)
  const {
    currentSuggestions,
    isGetProcessing: isGetSuggestionsProcessing,
    getSuggestions,
    clearCurrentSuggestions,
    getSuccess: getSuggestionsSuccess,
  } = useSuggestionStore((state) => state)
  const {
    getSubscription,
    currentSubscription,
    isGetProcessing: isGetSubscriptionProcessing,
  } = useSubscriptionsStore((state) => state)

  const [isFolderAdding, setIsFolderAdding] = useState(false)
  const [newFolderName, setNewFolderName] = useState<string>('')
  const [title, setTitle] = useState<string>(newDraftTitle || '')
  const [content, setContent] = useState<string>('')
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
    const currentFolder = currentFolderFromState
    if (!currentFolder) return
    createDraft(
      {
        content,
        title,
        isErrored: false,
        isProcessing: true,
      },
      currentFolder
    )
  }

  const getNewSuggestions = async (content: string) => {
    const context = getContext(content)
    if (context === undefined) return
    getSuggestions(context, currentSubscription)
  }

  useEffect(() => {
    if (createSuccess === true) {
      toast({
        title: 'Success!',
        description: 'Draft was created successfully.',
        variant: 'default',
      })
      resetCreateDraft()
      router.push(
        `/drafts/edit/${currentDraft?.id}?folder=${
          currentFolderFromState?.id || ''
        }`
      )
    }
  }, [
    createSuccess,
    toast,
    currentDraft,
    currentFolderFromState,
    router,
    resetCreateDraft,
  ])

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
      setTitle={setTitle}
      content={content}
      setContent={setContent}
      suggestions={currentSuggestions}
      isLoadingSuggestions={isGetSuggestionsProcessing}
      suggestionTimeoutRef={suggestionTimeoutRef}
      getNewSuggestions={getNewSuggestions}
      resetSuggestions={clearCurrentSuggestions}
      onSave={onClickOfSaveDraft}
      isProcessing={isCreateProcessing}
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
