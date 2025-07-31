import {
  getByExternalId,
  getById,
  listAllPricings as listPrices,
} from '../repositories/pricing'
import { PriceTypeEnum } from '../types/pricing-model'

export const listAllPricings = async (
  page: number = 1,
  pageSize: number = 10
) => listPrices(page, pageSize)

export const getPricingById = async (id: string) => getById(id)

export const getPricingByExternalId = async (
  stripePriceId: string,
  planType?: PriceTypeEnum
) => getByExternalId(stripePriceId, planType)
