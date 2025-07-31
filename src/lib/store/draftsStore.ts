// src/store/useStore.ts
import { create } from 'zustand'
import {
  DraftModel,
  DraftModelWithoutUserId,
  DraftModelWithoutUserIdAndTimestamps,
} from '../types/draft-model'
import { FolderModelWithoutUserIdAndTimestamps } from '../types/folder-model'
import {
  createDraftServerAction,
  deleteDraftServerAction,
  editDraftServerAction,
  listDraftServerAction,
} from '../actions/drafts'
import { SortOptions } from '../types/sort'

type DraftState = {
  currentDraft:
    | (DraftModelWithoutUserIdAndTimestamps & {
        isProcessing: boolean
        isErrored: boolean
      })
    | null
  list: Array<
    DraftModelWithoutUserId & {
      id: string
      isProcessing: boolean
      isErrored: boolean
    }
  >
  totalListPages: number
  listPage: number
  isListProcessing: boolean
  listSuccess: boolean
  listError: string | null
  isCreateProcessing: boolean
  createError: string | null
  createSuccess: boolean
  isEditProcessing: boolean
  editError: string | null
  editSuccess: boolean
  isDeleteProcessing: boolean
  deleteError: string | null
  deleteSuccess: boolean
  searchQuery: string
  currentSortOption: SortOptions
}

type DraftActions = {
  startListDrafts: (folderId: string) => void
  listDrafts: (folderId: string, page?: number, size?: number) => void
  listDraftsSuccess: (
    data: Array<DraftModel>,
    totalCount: number,
    totalPages: number
  ) => void
  listDraftsFailure: (error: string) => void

  moveDraftToFolder: (draftId: string, targetFolderId: string) => void

  startCreateDraft: (
    draft: Omit<DraftModelWithoutUserIdAndTimestamps, 'id' | 'folderId'> & {
      isProcessing: boolean
      isErrored: boolean
    },
    folder:
      | (FolderModelWithoutUserIdAndTimestamps & {
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => void
  createDraft: (
    draft: Omit<DraftModelWithoutUserIdAndTimestamps, 'id' | 'folderId'> & {
      isProcessing: boolean
      isErrored: boolean
    },
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  createDraftSuccess: (data: DraftModel) => void
  createDraftFailure: (error: string) => void
  resetCreateDraft: () => void

  startEditDraft: (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    },
    folder:
      | (FolderModelWithoutUserIdAndTimestamps & {
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => void
  editDraft: (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    },
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  editDraftSuccess: (data: DraftModel) => void
  editDraftFailure: (error: string) => void
  resetEditDraft: () => void

  startDeleteDraft: (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  deleteDraft: (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  deleteDraftSuccess: (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  deleteDraftFailure: (error: string) => void
  resetDeleteDraft: () => void

  setCurrentDraft: (
    draft:
      | (DraftModelWithoutUserIdAndTimestamps & {
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => void
  setListPage: (page: number) => void
  resetState: () => void
  setSearchQuery: (searchQuery: string) => void
  setCurrentSortOption: (sortOption: SortOptions) => void
}

const initialDraftState: DraftState = {
  currentDraft: null,
  list: [],
  totalListPages: 1,
  listPage: 1,
  listSuccess: false,
  listError: null,
  isListProcessing: false,
  createError: null,
  createSuccess: false,
  isCreateProcessing: false,
  editError: null,
  editSuccess: false,
  isEditProcessing: false,
  deleteSuccess: false,
  deleteError: null,
  isDeleteProcessing: false,
  searchQuery: '',
  currentSortOption: SortOptions.NEWEST_FIRST,
}

const useDraftsStore = create<DraftState & DraftActions>((set, get) => ({
  ...initialDraftState,

  startListDrafts: () => {
    const currentState = get()
    set({
      ...currentState,
      isListProcessing: true,
    })
  },
  listDrafts: async (folderId: string, page?: number, size?: number) => {
    get().startListDrafts(folderId)
    const currentSortOption = get().currentSortOption
    const searchQuery = get().searchQuery
    try {
      const response = await listDraftServerAction(
        folderId,
        page,
        size,
        currentSortOption,
        searchQuery
      )
      if ('error' in response) {
        throw response.error
      }
      const draftData = response.data
      get().listDraftsSuccess(
        draftData.drafts,
        draftData.totalCount,
        draftData.totalPages
      )
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().listDraftsFailure(error)
        return
      }
      get().listDraftsFailure('Error has occured in the backend')
    }
  },
  listDraftsSuccess: (
    drafts: Array<DraftModel>,
    totalCount: number,
    totalPages: number
  ) => {
    const currentState = get()
    set({
      ...currentState,
      isListProcessing: false,
      list: drafts.map((draft) => ({
        ...draft,
        isErrored: false,
        isProcessing: false,
      })),
      totalListPages: totalPages,
      listSuccess: true,
    })
  },
  listDraftsFailure: (error) => {
    const currentState = get()
    set({
      ...currentState,
      isListProcessing: false,
      list: currentState.list,
      listError: error,
    })
  },

  startCreateDraft: () => {
    const currentState = get()
    set({
      ...currentState,
      isCreateProcessing: true,
      createError: null,
      createSuccess: false,
    })
  },
  createDraft: async (
    draft: Omit<DraftModelWithoutUserIdAndTimestamps, 'id' | 'folderId'> & {
      isProcessing: boolean
      isErrored: boolean
    },
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    try {
      get().startCreateDraft(draft, folder)
      const draftPayload = { ...draft, folderId: folder.id }
      const response = await createDraftServerAction(draftPayload)
      if ('error' in response) {
        throw response.error
      }
      const draftData = response.data
      if (!draftData) {
        throw new Error('Draft creation failed')
      }
      get().createDraftSuccess(draftData)
      get().setCurrentDraft({
        ...draftData,
        isErrored: false,
        isProcessing: false,
      })
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().createDraftFailure(error)
        return
      }
      get().createDraftFailure('Error has occured in the backend')
    }
  },
  createDraftSuccess: () => {
    const currentState = get()
    set({
      ...currentState,
      isCreateProcessing: false,
      createSuccess: true,
      list: [
        ...currentState.list.map((draft) => {
          if (draft.isProcessing) {
            return { ...draft, isErrored: false, isProcessing: false }
          }
          return draft
        }),
      ],
    })
  },
  createDraftFailure: (error) => {
    const currentState = get()
    set({
      ...currentState,
      list: [
        ...currentState.list.map((draft) => {
          if (draft.isProcessing) {
            return { ...draft, isErrored: true, isProcessing: false }
          }
          return draft
        }),
      ],
      isCreateProcessing: false,
      createError: error,
    })
  },
  resetCreateDraft: () => {
    const currentState = get()
    set({
      ...currentState,
      isCreateProcessing: false,
      createError: null,
      createSuccess: false,
    })
  },

  startEditDraft: () => {
    const currentState = get()
    set({
      ...currentState,
      isEditProcessing: true,
      editError: null,
      editSuccess: false,
    })
  },
  editDraft: async (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      id?: string
      isProcessing: boolean
      isErrored: boolean
    },
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    try {
      get().startEditDraft(draft, folder)
      const draftPayload = { ...draft, folderId: folder.id }
      const response = await editDraftServerAction(draftPayload)
      if ('error' in response) {
        throw response.error
      }
      const draftData = response.data
      if (!draftData) {
        throw new Error('Draft creation failed')
      }

      get().editDraftSuccess(draftData)
      get().setCurrentDraft({
        ...draftData,
        isErrored: false,
        isProcessing: false,
      })
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().editDraftFailure(error)
        return
      }
      get().editDraftFailure('Error has occured in the backend')
    }
  },
  editDraftSuccess: () => {
    const currentState = get()
    set({
      ...currentState,
      isEditProcessing: false,
      editSuccess: true,
      list: [
        ...currentState.list.map((draft) => {
          if (draft.isProcessing) {
            return { ...draft, isErrored: false, isProcessing: false }
          }
          return draft
        }),
      ],
    })
  },
  editDraftFailure: (error) => {
    const currentState = get()
    set({
      ...currentState,
      list: [
        ...currentState.list.map((draft) => {
          if (draft.isProcessing) {
            return { ...draft, isErrored: true, isProcessing: false }
          }
          return draft
        }),
      ],
      isEditProcessing: false,
      editError: error,
    })
  },
  resetEditDraft: () => {
    const currentState = get()
    set({
      ...currentState,
      isEditProcessing: false,
      editError: null,
      editSuccess: false,
    })
  },

  startDeleteDraft: (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    const currentState = get()
    set({
      ...currentState,
      isDeleteProcessing: true,
      list: currentState.list.map((draftFromState) => {
        if (draftFromState.id === draft.id) {
          return { ...draftFromState, isProcessing: true }
        }
        return draftFromState
      }),
      deleteSuccess: false,
      deleteError: null,
    })
  },
  deleteDraft: async (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    try {
      get().startDeleteDraft(draft)
      const response = await deleteDraftServerAction(draft)
      if ('error' in response) {
        throw response.error
      }
      get().deleteDraftSuccess(draft)
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().deleteDraftFailure(error)
        return
      }
      get().deleteDraftFailure('Error has occured in the backend')
    }
  },
  deleteDraftSuccess: (
    draft: DraftModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    const currentState = get()
    set({
      ...currentState,
      isDeleteProcessing: false,
      list: currentState.list.filter(
        (draftFromState) => draft.id !== draftFromState.id
      ),
      deleteSuccess: true,
      deleteError: null,
    })
  },
  deleteDraftFailure: (error) => {
    const currentState = get()
    set({
      ...currentState,
      isDeleteProcessing: false,
      deleteError: error,
    })
  },
  resetDeleteDraft: () => {
    const currentState = get()
    set({
      ...currentState,
      isDeleteProcessing: false,
      deleteError: null,
      deleteSuccess: false,
    })
  },

  setCurrentDraft: (
    draft:
      | (DraftModelWithoutUserIdAndTimestamps & {
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => {
    const currentState = get()
    set({
      ...currentState,
      currentDraft: draft,
    })
  },
  setListPage: (page: number) => {
    const currentState = get()
    set({
      ...currentState,
      listPage: page,
    })
  },
  resetState: () => {
    set({ ...initialDraftState })
  },
  setSearchQuery: (searchQuery: string) => {
    const currentState = get()
    set({
      ...currentState,
      searchQuery,
    })
  },
  setCurrentSortOption: (sortOption: SortOptions) => {
    const currentState = get()
    set({
      ...currentState,
      currentSortOption: sortOption,
    })
  },

  moveDraftToFolder: async (draftId: string, targetFolderId: string) => {
    try {
      const draft = get().list.find((d) => d.id === draftId)
      if (!draft) {
        console.error('Draft not found in state:', draftId)
        return
      }

      // Store the source folder ID for refreshing later
      const sourceFolderId = draft.folderId

      // Optimistically update the UI - remove from current list
      set({
        list: get().list.filter((d) => d.id !== draftId),
      })

      // Call the API to move the draft
      const response = await editDraftServerAction({
        id: draftId,
        title: draft.title,
        content: draft.content,
        folderId: targetFolderId,
      })

      if ('error' in response) {
        throw new Error(response.error)
      }

      // Refresh the current folder view
      const currentFolderId = get().currentDraft?.folderId || sourceFolderId
      if (currentFolderId) {
        get().listDrafts(currentFolderId)
      }
    } catch (error) {
      console.error('Error moving draft:', error)
      // If there's an error, refresh to restore the UI
      const currentFolderId = get().currentDraft?.folderId
      if (currentFolderId) {
        get().listDrafts(currentFolderId)
      }
    }
  },
}))

export default useDraftsStore
