import prisma from '@/lib/prisma'
import { PriceTypeEnum, PricingModel } from '../types/pricing-model'

export const listAllPricings = async (
  page: number = 1,
  pageSize: number = 10
): Promise<Array<PricingModel>> => {
  return prisma.prices.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const getById = async (id: string): Promise<PricingModel | null> => {
  return prisma.prices.findUnique({
    where: { id },
  })
}

export const getByExternalId = async (
  stripePriceId: string,
  planType?: PriceTypeEnum
): Promise<PricingModel | null> => {
  const where = {
    stripePriceId,
    ...(planType && { planType }),
  }
  return prisma.prices.findUnique({
    where,
  })
}
