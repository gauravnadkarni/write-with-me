import prisma, { applyWithUserFilter } from '@/lib/prisma'
import { DraftModel } from '../types/draft-model'
import { SortOptions } from '../types/sort'

export const createDraft = async (
  userId: string,
  title: string,
  content: string,
  folderId: string
): Promise<DraftModel> => {
  const payload: {
    title: string
    content: string
    user: {
      connect: { id: string }
    }
    folder: {
      connect: { id: string }
    }
  } = {
    title,
    content,
    user: {
      connect: { id: userId },
    },
    folder: {
      connect: { id: folderId },
    },
  }

  return prisma.drafts.create({
    data: payload,
  })
}

export const listAllDraftsByFolder = async (
  userId: string,
  folderId: string,
  page: number = 1,
  pageSize: number = 10,
  sort: SortOptions = SortOptions.NEWEST_FIRST,
  searchQuery: string = ''
): Promise<{
  drafts: Array<DraftModel>
  totalCount: number
  totalPages: number
}> => {
  let orderBy: { [key: string]: 'asc' | 'desc' } = {
    updatedAt: 'desc',
  }
  switch (sort) {
    case SortOptions.OLDEST_FIRST:
      orderBy = {
        updatedAt: 'asc',
      }
      break
    case SortOptions.TITLE_ASC:
      orderBy = {
        title: 'asc',
      }
      break
    case SortOptions.TITLE_DESC:
      orderBy = {
        title: 'desc',
      }
      break
    default:
      break
  }

  const [totalCount, data] = await prisma.$transaction([
    prisma.drafts.count({
      ...applyWithUserFilter({
        userId,
        folderId,
        title: searchQuery
          ? { contains: searchQuery, mode: 'insensitive' }
          : undefined,
      }),
    }),
    prisma.drafts.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy,
      ...applyWithUserFilter({
        userId,
        folderId,
        title: searchQuery
          ? { contains: searchQuery, mode: 'insensitive' }
          : undefined,
      }),
    }),
  ])

  const totalPages = Math.ceil(totalCount / pageSize)
  return {
    drafts: data,
    totalCount,
    totalPages,
  }
}

export const deleteDraftById = async (
  userId: string,
  id: string,
  folderId: string
): Promise<void> => {
  await prisma.drafts.deleteMany({
    ...applyWithUserFilter({ userId, id, folderId }),
  })
}

export const getDraftById = async (
  userId: string,
  id: string
): Promise<DraftModel | null> => {
  return prisma.drafts.findFirst({
    ...applyWithUserFilter({ userId, id }),
  })
}

export const editDraftById = async (
  userId: string,
  draftId: string,
  title: string,
  content: string,
  folderId: string | null
): Promise<DraftModel | null> => {
  return prisma.drafts.update({
    data: {
      title,
      content,
      ...(folderId && { folder: { connect: { id: folderId } } }),
    },
    where: { id: draftId },
  })
}

export const getDraftCount = async (
  userId: string,
  folderId: string
): Promise<number> =>
  prisma.drafts.count({ ...applyWithUserFilter({ userId, folderId }) })
