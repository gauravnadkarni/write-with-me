import { AppError } from '../errors/app-error'
import {
  createFolder,
  deleteFolderById,
  getFolderById,
  listAllFolders,
} from '../repositories/folders'

export const createNewFolder = async (
  userId: string,
  title: string,
  description: string,
  color: string
) => createFolder(title, color, description, userId)

export const listFolders = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  checkHasMore: boolean = false
) => listAllFolders(userId, page, pageSize, checkHasMore)

export const deleteFolder = async (userId: string, folderId: string) => {
  const folder = await getFolderById(userId, folderId)
  if (folder && folder.isUncategorizedFolder) {
    throw new AppError('Cannot delete the uncategorized folder', 400)
  }
  return deleteFolderById(userId, folderId)
}

export const getFolder = async (userId: string, folderId: string) =>
  getFolderById(userId, folderId)
