import { Folders } from '@prisma/client'

export type FolderModel = Folders

export type FolderModelWithoutUserId = Omit<Folders, 'userId'>

export type FolderModelWithoutTimestamps = Omit<
  Folders,
  'createdAt' | 'updatedAt'
>

export type FolderModelWithoutUserIdAndTimestamps = Omit<
  Folders,
  'userId' | 'createdAt' | 'updatedAt'
>
