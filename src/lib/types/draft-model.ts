import { Drafts } from '@prisma/client'

export type DraftModel = Drafts

export type DraftModelWithoutUserId = Omit<Drafts, 'userId'>

export type DraftModelWithoutTimestamps = Omit<
  Drafts,
  'createdAt' | 'updatedAt'
>

export type DraftModelWithoutUserIdAndTimestamps = Omit<
  Drafts,
  'userId' | 'createdAt' | 'updatedAt'
>
