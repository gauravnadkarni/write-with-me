import prisma, { applyWithUserFilter } from '@/lib/prisma'
import { UsageModel } from '../types/usage-model'
import { AppError } from '../errors/app-error'

export const createUsageRecordForUser = async (
  userId: string,
  requestCount: number,
  creditStartDate: Date,
  creditEndDate: Date
): Promise<UsageModel> => {
  return prisma.usage.create({
    data: {
      requestCount,
      creditStartDate,
      creditEndDate,
      user: {
        connect: { id: userId },
      },
    },
  })
}

export const listAllUsages = async (
  userId: string,
  page: number = 1,
  pageSize: number = 10,
  checkHasMore: boolean = false
): Promise<Array<UsageModel>> => {
  return prisma.usage.findMany({
    skip: (page - 1) * pageSize,
    take: checkHasMore ? pageSize + 1 : pageSize,
    orderBy: {
      updatedAt: 'desc',
    },
    ...applyWithUserFilter({ userId }),
  })
}

export const getUsageById = async (
  userId: string,
  id: string
): Promise<UsageModel | null> => {
  return prisma.usage.findFirst({
    ...applyWithUserFilter({ userId, id }),
  })
}

export const updateUsageById = async (
  userId: string,
  id: string,
  requestCount: number,
  creditStartDate?: Date,
  creditEndDate?: Date
): Promise<UsageModel | null> => {
  return prisma.usage.update({
    where: {
      id,
      userId,
    },
    data: {
      requestCount,
      ...(creditStartDate && { creditStartDate }),
      ...(creditEndDate && { creditEndDate }),
    },
  })
}

export const findUsageByDate = async (
  userId: string,
  date: Date
): Promise<UsageModel | null> => {
  return prisma.usage.findFirst({
    ...applyWithUserFilter({
      userId,
      AND: [
        { creditStartDate: { lte: date } },
        { creditEndDate: { gte: date } },
      ],
    }),
  })
}

export const deductCredit = async (userId: string, deductionAmount: number) => {
  const result = await prisma.$queryRaw<
    { success: boolean; remaining_credit: number }[]
  >`SELECT * FROM public.deduct_credit(${userId}, ${deductionAmount}::INTEGER)`

  if (result.length === 0) {
    throw new Error('Unexpected response from database.')
  }

  const { success, remaining_credit } = result[0]

  if (!success) {
    throw new AppError('Failed to deduct credit', 500)
  }

  return { success, remaining_credit }
}
