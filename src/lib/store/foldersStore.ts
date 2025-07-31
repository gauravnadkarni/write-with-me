// src/store/useStore.ts
import { create } from 'zustand'
import {
  createFolderServerAction,
  deleteFolderServerAction,
  getFolderServerAction,
  listFolderServerAction,
} from '../actions/folders'
import {
  FolderModel,
  FolderModelWithoutUserIdAndTimestamps,
} from '../types/folder-model'

type FolderState = {
  currentFolder:
    | (FolderModelWithoutUserIdAndTimestamps & {
        id?: string
        isProcessing: boolean
        isErrored: boolean
      })
    | null
  list: Array<
    FolderModelWithoutUserIdAndTimestamps & {
      id: string
      isProcessing: boolean
      isErrored: boolean
    } & { draftCount?: number }
  >
  listHasMore: boolean
  listSuccess: boolean
  getSuccess: boolean
  createSuccess: boolean
  deleteSuccess: boolean
  listError: string | null
  getError: string | null
  createError: string | null
  deleteError: string | null
  isListProcessing: boolean
  isListProcessingForFirstRequest: boolean
  isGetProcessing: boolean
  isCreateProcessing: boolean
  isDeleteProcessing: boolean
  folderListPage: number
}

type FolderActions = {
  startListFolders: (isInitialLoad: boolean) => void
  listFolders: (
    page: number,
    size: number,
    isInitialLoad: boolean
  ) => Promise<void>
  listFoldersSuccess: (data: {
    folders: Array<FolderModel & { draftCount: number }>
    hasMore: boolean
  }) => void
  listFoldersFailure: (error: string) => void

  startGetFolder: (folderId: string) => void
  getFolder: (folderId: string, setAsCurrentFolder: boolean) => void
  getFolderSuccess: (data: FolderModel) => void
  getFolderFailure: (error: string) => void

  startCreateFolder: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  createFolder: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  createFolderSuccess: (data: FolderModel) => void
  createFolderFailure: (error: string) => void

  startDeleteFolder: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  deleteFolder: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  deleteFolderSuccess: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => void
  deleteFolderFailure: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    },
    error: string
  ) => void
  setCurrentFolder: (
    folder:
      | (FolderModelWithoutUserIdAndTimestamps & {
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => void
  setFolderListPage: (page: number) => void
  resetState: () => void
}

const initialFolderState: FolderState = {
  currentFolder: null,
  list: [],
  listHasMore: false,
  listSuccess: false,
  getSuccess: false,
  createSuccess: false,
  deleteSuccess: false,
  listError: null,
  getError: null,
  createError: null,
  deleteError: null,
  isListProcessing: false,
  isListProcessingForFirstRequest: false,
  isGetProcessing: false,
  isCreateProcessing: false,
  isDeleteProcessing: false,
  folderListPage: 1,
}

const useFoldersStore = create<FolderState & FolderActions>((set, get) => ({
  ...initialFolderState,
  startListFolders: (isInitialLoad: boolean) => {
    const currentState = get()
    set({
      ...currentState,
      isListProcessing: true,
      isListProcessingForFirstRequest: isInitialLoad,
      listSuccess: false,
      listError: null,
    })
  },
  listFolders: async (page: number, size: number, isInitialLoad: boolean) => {
    get().startListFolders(isInitialLoad)
    try {
      const response = await listFolderServerAction(page, size, true)
      if ('error' in response) {
        throw response.error
      }
      const folderData = response.data
      get().listFoldersSuccess(folderData)
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().listFoldersFailure(error)
        return
      }
      get().listFoldersFailure('Error has occured in the backend')
    }
  },
  listFoldersSuccess: (folderData: {
    folders: Array<FolderModel & { draftCount: number }>
    hasMore: boolean
  }) => {
    const currentState = get()
    set({
      ...currentState,
      isListProcessing: false,
      isListProcessingForFirstRequest: false,
      //list: [...currentState.list, ...folderData.folders.map((folder)=>({...folder, isErrored:false, isProcessing:false}))],
      list: [
        ...currentState.list.map((folderFromState) => {
          const matchingFolder = folderData.folders.find(
            (folderFromBackend) => folderFromBackend.id === folderFromState.id
          )
          return matchingFolder
            ? { ...matchingFolder, isErrored: false, isProcessing: false }
            : folderFromState
        }),
        ...folderData.folders
          .filter(
            (folderFromBackend) =>
              !currentState.list.some(
                (folderFromState) => folderFromState.id === folderFromBackend.id
              )
          )
          .map((unmatchedFolderFromBackend) => ({
            ...unmatchedFolderFromBackend,
            isErrored: false,
            isProcessing: false,
          })),
      ],
      listSuccess: true,
      listHasMore: folderData.hasMore,
    })
  },
  listFoldersFailure: (error) => {
    const currentState = get()
    set({
      ...currentState,
      isListProcessing: false,
      list: currentState.list,
      listError: error,
    })
  },
  startGetFolder: () => {
    const currentState = get()
    set({
      ...currentState,
      isGetProcessing: true,
    })
  },
  getFolder: async (folderId: string, setAsCurrentFolder: boolean) => {
    get().startGetFolder(folderId)
    try {
      const response = await getFolderServerAction(folderId)
      if ('error' in response) {
        throw response.error
      }

      if (!response.data) {
        throw new Error('Folder not found')
      }
      const folderData = response.data
      if (setAsCurrentFolder) {
        get().setCurrentFolder({
          ...folderData,
          isProcessing: false,
          isErrored: false,
        })
      }
      get().getFolderSuccess(folderData)
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().getFolderFailure(error)
        return
      }
      get().getFolderFailure('Error has occured in the backend')
    }
  },
  getFolderSuccess: () => {
    const currentState = get()
    set({
      ...currentState,
      isGetProcessing: false,
      getSuccess: true,
    })
  },
  getFolderFailure: (error) => {
    const currentState = get()
    set({
      ...currentState,
      isGetProcessing: false,
      getError: error,
    })
  },

  startCreateFolder: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      id?: string
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    const currentState = get()
    set({
      ...currentState,
      list: [{ ...folder }, ...currentState.list],
      isCreateProcessing: true,
      createError: null,
      createSuccess: false,
    })
  },
  createFolder: async (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    try {
      get().startCreateFolder(folder)
      const response = await createFolderServerAction(folder)
      if ('error' in response) {
        throw response.error
      }
      const folderData = response.data
      if (!folderData) {
        throw new Error('Folder creation failed')
      }
      get().createFolderSuccess(folderData)
      get().setCurrentFolder({
        ...folderData,
        isErrored: false,
        isProcessing: false,
      })
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().createFolderFailure(error)
        return
      }
      get().createFolderFailure('Error has occured in the backend')
    }
  },
  createFolderSuccess: (data: FolderModel) => {
    const currentState = get()
    set({
      ...currentState,
      isCreateProcessing: false,
      createSuccess: true,
      list: [
        ...currentState.list.map((folder) => {
          if (folder.isProcessing) {
            return { ...data, isErrored: false, isProcessing: false }
          }
          return folder
        }),
      ],
    })
  },
  createFolderFailure: (error) => {
    const currentState = get()
    set({
      ...currentState,
      list: [
        ...currentState.list.map((folder) => {
          if (folder.isProcessing) {
            return { ...folder, isErrored: true, isProcessing: false }
          }
          return folder
        }),
      ],
      isCreateProcessing: false,
      createError: error,
    })
  },

  startDeleteFolder: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    const currentState = get()
    set({
      ...currentState,
      isDeleteProcessing: true,
      list: currentState.list.map((folderFromState) => {
        if (folderFromState.id === folder.id) {
          return { ...folderFromState, isProcessing: true }
        }
        return folderFromState
      }),
      deleteSuccess: false,
      deleteError: null,
    })
  },
  deleteFolder: async (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    try {
      get().startDeleteFolder(folder)
      const response = await deleteFolderServerAction(folder)
      if ('error' in response) {
        throw response.error
      }
      get().deleteFolderSuccess(folder)
    } catch (error: unknown) {
      if (typeof error === 'string') {
        get().deleteFolderFailure(folder, error)
        return
      }
      get().deleteFolderFailure(folder, 'Error has occured in the backend')
    }
  },
  deleteFolderSuccess: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    }
  ) => {
    const currentState = get()
    set({
      ...currentState,
      isDeleteProcessing: false,
      list: currentState.list.filter(
        (folderFromState) => folder.id !== folderFromState.id
      ),
      deleteSuccess: true,
      deleteError: null,
    })
  },
  deleteFolderFailure: (
    folder: FolderModelWithoutUserIdAndTimestamps & {
      isProcessing: boolean
      isErrored: boolean
    },
    error
  ) => {
    const currentState = get()
    set({
      ...currentState,
      list: currentState.list.map((folderFromState) => {
        if (folderFromState.id === folder.id) {
          return { ...folderFromState, isProcessing: false }
        }
        return folderFromState
      }),
      isDeleteProcessing: false,
      deleteError: error,
    })
  },
  setCurrentFolder: (
    folder:
      | (FolderModelWithoutUserIdAndTimestamps & {
          isProcessing: boolean
          isErrored: boolean
        })
      | null
  ) => {
    const currentState = get()
    set({
      ...currentState,
      currentFolder: folder,
    })
  },
  setFolderListPage: (page: number) => {
    const currentState = get()
    set({
      ...currentState,
      folderListPage: page,
      listSuccess: false,
    })
  },
  resetState: () => {
    set({ ...initialFolderState })
  },
}))

export default useFoldersStore
