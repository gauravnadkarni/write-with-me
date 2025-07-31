'use server'

import { serverActionWrapper } from '../server-action-wrapper'
import { draftSchema } from '../schemas/draft'
import { getAuthUser } from '../services/auth-handler'
import {
  createNewDraft,
  deleteDraft,
  editDraft,
  listAllDrafts,
} from '../services/draft-handler'
import { DraftModelWithoutUserIdAndTimestamps } from '../types/draft-model'
import { SortOptions } from '../types/sort'

export const createDraftServerAction = (
  draft: Omit<DraftModelWithoutUserIdAndTimestamps, 'id'>
) => {
  const serverAction = async () => {
    const user = await getAuthUser()
    const validatedDraftData = await draftSchema.validate(draft, {
      abortEarly: false,
    })
    const newDraft = await createNewDraft(
      user.id,
      validatedDraftData.title,
      validatedDraftData.content,
      draft.folderId
    )
    return newDraft
  }
  return serverActionWrapper(serverAction)
}

export const editDraftServerAction = (
  draft: DraftModelWithoutUserIdAndTimestamps
) => {
  const serverAction = async () => {
    const user = await getAuthUser()
    const validatedDraftData = await draftSchema.validate(draft, {
      abortEarly: false,
    })
    const newDraft = await editDraft(
      user.id,
      draft.id,
      validatedDraftData.title,
      validatedDraftData.content,
      draft.folderId
    )
    return newDraft
  }
  return serverActionWrapper(serverAction)
}

export const listDraftServerAction = (
  folderId: string,
  page: number = 1,
  size: number = 10,
  sort: SortOptions = SortOptions.NEWEST_FIRST,
  searchQuery: string = ''
) => {
  const serverAction = async () => {
    const user = await getAuthUser()
    const drafts = await listAllDrafts(
      user.id,
      folderId,
      page,
      size,
      sort,
      searchQuery
    )
    return drafts
  }
  return serverActionWrapper(serverAction)
}

export const deleteDraftServerAction = (
  draft: DraftModelWithoutUserIdAndTimestamps
) => {
  const serverAction = async () => {
    const user = await getAuthUser()
    await deleteDraft(user.id, draft.id, draft.folderId)
  }
  return serverActionWrapper(serverAction)
}
