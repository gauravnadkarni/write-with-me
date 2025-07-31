import prisma, { applyWithUserFilter } from '@/lib/prisma'
import { FolderModel } from '../types/folder-model'

export const createFolder = async (
  title: string,
  color: string,
  description: string,
  userId: string,
  isUncategorized: boolean = false
): Promise<FolderModel> => {
  return prisma.folders.create({
    data: {
      title,
      color,
      description,
      user: {
        connect: { id: userId },
      },
      isUncategorizedFolder: isUncategorized,
    },
  })
}

export const listAllFolders = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  checkHasMore: boolean = false
): Promise<Array<FolderModel & { _count: { drafts: number } }>> => {
  return prisma.folders.findMany({
    skip: (page - 1) * pageSize,
    take: checkHasMore ? pageSize + 1 : pageSize,
    orderBy: {
      updatedAt: 'desc',
    },
    ...applyWithUserFilter({ userId }),
    include: {
      _count: {
        select: {
          drafts: true, // Get count of drafts under each folder
        },
      },
    },
  })
}

export const getFolderById = async (
  userId: string,
  id: string
): Promise<FolderModel | null> => {
  return prisma.folders.findFirst({
    ...applyWithUserFilter({ userId, id }),
  })
}

export const deleteFolderById = async (
  userId: string,
  id: string
): Promise<void> => {
  await prisma.folders.deleteMany({
    ...applyWithUserFilter({ userId, id }),
  })
}
