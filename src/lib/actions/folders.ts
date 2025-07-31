'use server'

import { serverActionWrapper } from '@/lib/server-action-wrapper'
import { AppError } from '../errors/app-error'
import { folderSchema } from '../schemas/folder'
import { getAuthUser } from '../services/auth-handler'
import { getDraftCountInsideFolder } from '../services/draft-handler'
import {
  createNewFolder,
  deleteFolder,
  getFolder,
  listFolders,
} from '../services/folder-handler'
import { FolderModelWithoutUserIdAndTimestamps } from '../types/folder-model'

export const createFolderServerAction = (
  folder: Omit<FolderModelWithoutUserIdAndTimestamps, 'id'>
) => {
  const serverAction = async () => {
    const user = await getAuthUser()
    const validatedFolderData = await folderSchema.validate(folder, {
      abortEarly: false,
    })
    const newFolder = await createNewFolder(
      user.id,
      validatedFolderData.title,
      validatedFolderData.description,
      validatedFolderData.color
    )
    return newFolder
  }
  return serverActionWrapper(serverAction)
}

export const listFolderServerAction = (
  page: number = 1,
  size: number = 10,
  checkHasMore: boolean = false
) => {
  const serverAction = async () => {
    const user = await getAuthUser()
    const folders = await listFolders(user.id, page, size, checkHasMore)
    const mappedFolders = folders.map((folder) => ({
      ...folder,
      draftCount: folder._count.drafts,
    }))
    if (checkHasMore && mappedFolders.length > size) {
      return {
        folders: mappedFolders.slice(0, size),
        hasMore: true,
      }
    }
    return {
      folders: mappedFolders,
      hasMore: mappedFolders.length > size,
    }
  }
  return serverActionWrapper(serverAction)
}

export const getFolderServerAction = (folderId: string) => {
  const serverAction = async () => {
    const user = await getAuthUser()
    const folder = await getFolder(user.id, folderId)
    return folder
  }
  return serverActionWrapper(serverAction)
}

export const deleteFolderServerAction = (
  folder: FolderModelWithoutUserIdAndTimestamps
) => {
  const serverAction = async () => {
    const user = await getAuthUser()
    const draftCount = await getDraftCountInsideFolder(user.id, folder.id)
    if (draftCount === 0) {
      await deleteFolder(user.id, folder.id)
    } else {
      throw new AppError(
        'Folder has drafts. Please move the drafts to another folder before deleting the folder.',
        400
      )
    }
  }
  return serverActionWrapper(serverAction)
}
