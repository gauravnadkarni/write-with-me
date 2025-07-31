import { AppError } from '../errors/app-error'
import {
  createDraft,
  deleteDraftById,
  listAllDraftsByFolder,
  getDraftById as getDraftByIdFromRepository,
  editDraftById,
  getDraftCount,
} from '../repositories/drafts'
import { SortOptions } from '../types/sort'

export const createNewDraft = async (
  userId: string,
  title: string,
  content: string,
  folderId: string
) => createDraft(userId, title, content, folderId)

export const getDraftById = async (userId: string, draftId: string) =>
  getDraftByIdFromRepository(userId, draftId)

export const editDraft = async (
  userId: string,
  draftId: string,
  title: string,
  content: string,
  folderId: string | null
) => {
  const draft = await getDraftByIdFromRepository(userId, draftId)
  if (!draft) throw new AppError('Draft not found', 400)
  return editDraftById(userId, draftId, title, content, folderId)
}

export const listAllDrafts = async (
  userId: string,
  folderId: string,
  page: number = 1,
  pageSize: number = 10,
  sort: SortOptions,
  searchQuery: string = ''
) => listAllDraftsByFolder(userId, folderId, page, pageSize, sort, searchQuery)

export const deleteDraft = async (
  userId: string,
  draftId: string,
  folderId: string
) => {
  return deleteDraftById(userId, draftId, folderId)
}

export const getDraftCountInsideFolder = async (
  userId: string,
  folderId: string
) => getDraftCount(userId, folderId)
